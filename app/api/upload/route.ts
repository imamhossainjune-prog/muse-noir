/* eslint-disable @typescript-eslint/no-require-imports */
import { createClient } from '@/lib/supabase/server'
import Groq from 'groq-sdk'

async function extractFromPDF(buffer: Buffer): Promise<string> {
  if (typeof globalThis.DOMMatrix === 'undefined') {
    (globalThis as any).DOMMatrix = class DOMMatrix {
      constructor() {}
      static fromMatrix() { return new (globalThis as any).DOMMatrix() }
    }
  }
  if (typeof globalThis.Path2D === 'undefined') {
    (globalThis as any).Path2D = class Path2D {}
  }
  if (typeof globalThis.ImageData === 'undefined') {
    (globalThis as any).ImageData = class ImageData {}
  }
  const pdfjsLib = await import('pdfjs-dist/legacy/build/pdf.mjs')
  const loadingTask = pdfjsLib.getDocument({ data: new Uint8Array(buffer) })
  const pdf = await loadingTask.promise
  let fullText = ''
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i)
    const content = await page.getTextContent()
    fullText += content.items.map((item: any) => item.str).join(' ') + '\n'
  }
  return fullText
}

async function extractFromDocx(buffer: Buffer): Promise<string> {
  const mammoth = require('mammoth')
  const result = await mammoth.extractRawText({ buffer })
  return result.value
}

async function extractFromPptx(buffer: Buffer): Promise<string> {
  const officeParser = require('officeparser')
  return new Promise((resolve, reject) => {
    const parseFunc = officeParser.parseOffice ||
      officeParser.default?.parseOffice ||
      officeParser
    if (typeof parseFunc === 'function') {
      try {
        parseFunc(buffer, (text: string, err: any) => {
          if (err) reject(err)
          else resolve(text ?? '')
        })
      } catch (e: any) { reject(e) }
    } else {
      reject(new Error('officeparser not available'))
    }
  })
}

async function extractText(buffer: Buffer, fileName: string): Promise<string> {
  const lower = fileName.toLowerCase()
  if (lower.endsWith('.pdf')) return extractFromPDF(buffer)
  if (lower.endsWith('.docx') || lower.endsWith('.doc')) return extractFromDocx(buffer)
  if (lower.endsWith('.pptx') || lower.endsWith('.ppt')) return extractFromPptx(buffer)
  throw new Error('Unsupported file type')
}

const ALLOWED_EXTENSIONS = ['.pdf', '.docx', '.doc', '.pptx', '.ppt']

function getFileType(fileName: string): string {
  const lower = fileName.toLowerCase()
  if (lower.endsWith('.pdf')) return 'pdf'
  if (lower.endsWith('.docx') || lower.endsWith('.doc')) return 'word'
  if (lower.endsWith('.pptx') || lower.endsWith('.ppt')) return 'powerpoint'
  return 'unknown'
}

export async function POST(req: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return Response.json({ error: 'Not logged in' }, { status: 401 })
  const userId = user.id

  const formData = await req.formData()
  const file = formData.get('file') as File
  const courseId = formData.get('courseId') as string

  if (!file || !courseId) {
    return Response.json({ error: 'Missing file or course' }, { status: 400 })
  }

  const isAllowed = ALLOWED_EXTENSIONS.some(ext => file.name.toLowerCase().endsWith(ext))
  if (!isAllowed) {
    return Response.json({
      error: 'Unsupported file type. Please upload PDF, Word (.docx), or PowerPoint (.pptx)'
    }, { status: 400 })
  }

  try {
    console.log('Starting upload for:', file.name)

    const buffer = Buffer.from(await file.arrayBuffer())
    const filePath = `${userId}/${courseId}/${Date.now()}-${file.name}`
    const fileType = getFileType(file.name)

    const { error: uploadError } = await supabase.storage
      .from('documents')
      .upload(filePath, buffer, { contentType: 'application/octet-stream' })

    if (uploadError) {
      return Response.json({ error: 'File upload failed: ' + uploadError.message }, { status: 500 })
    }

    const { data: doc, error: docError } = await supabase
      .from('documents')
      .insert({
        course_id: courseId,
        user_id: userId,
        file_name: file.name,
        file_path: filePath,
        file_type: fileType,
      })
      .select()
      .single()

    if (docError || !doc) {
      return Response.json({ error: 'Could not save document record' }, { status: 500 })
    }

    let fullText = ''
    try {
      fullText = await extractText(buffer, file.name)
      console.log('Extracted text length:', fullText.length)
    } catch (extractErr: any) {
      return Response.json({ error: 'Could not read file: ' + extractErr.message }, { status: 400 })
    }

    if (!fullText || fullText.trim().length < 50) {
      return Response.json({
        error: 'Could not read text from this file. It may be image-only or empty.'
      }, { status: 400 })
    }

    const cleanedText = fullText
      .replace(/\u0000/g, '')
      .replace(/\x00/g, '')
      .replace(/[\x01-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '')

    // ── Split into chunks and save WITHOUT embeddings ──
    // Embeddings are skipped on Vercel due to timeout limits
    // The chat route uses keyword matching instead
    const chunkSize = 1500
    const chunkOverlap = 200
    const chunks: string[] = []
    let start = 0

    while (start < cleanedText.length) {
      const end = Math.min(start + chunkSize, cleanedText.length)
      const chunk = cleanedText.slice(start, end).trim()
      if (chunk.length > 50) chunks.push(chunk)
      start += chunkSize - chunkOverlap
    }

    console.log('Created', chunks.length, 'chunks')

    const chunkRows = chunks.map((content, i) => ({
      document_id: doc.id,
      course_id: courseId,
      user_id: userId,
      content,
      embedding: null,
      chunk_index: i,
    }))

    const { error: chunksError } = await supabase
      .from('document_chunks')
      .insert(chunkRows)

    if (chunksError) {
      console.error('Chunks insert error:', chunksError)
    } else {
      console.log('Saved', chunks.length, 'chunks')
    }

    // ── Generate summary ──
    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })

    const summaryResponse = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      max_tokens: 500,
      messages: [
        {
          role: 'system',
          content: 'You are a helpful study assistant. Summarize academic content clearly for university students.',
        },
        {
          role: 'user',
          content: `Summarize this document in exactly 4 bullet points. Each bullet should be one clear sentence capturing a key idea. Start each bullet with •\n\n${cleanedText.slice(0, 4000)}`,
        },
      ],
    })

    const summary = summaryResponse.choices[0].message.content ?? ''
    console.log('Summary generated')

    await supabase
      .from('documents')
      .update({ summary, is_processed: true })
      .eq('id', doc.id)

    return Response.json({
      success: true,
      documentId: doc.id,
      chunksCreated: chunks.length,
      summary,
    })

  } catch (err: any) {
    console.error('Upload crash:', err.message)
    return Response.json({ error: err.message ?? 'Something went wrong' }, { status: 500 })
  }
}