import { createClient } from '@/lib/supabase/server'
import Groq from 'groq-sdk'

export async function POST(req: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return Response.json({ error: 'Not logged in' }, { status: 401 })
    const userId = user.id

    const { messages, courseId } = await req.json()

    if (!messages || messages.length === 0) {
      return Response.json({ error: 'No messages provided' }, { status: 400 })
    }

    const latestMessage = messages[messages.length - 1].content as string
    console.log('Chat question:', latestMessage)

    // ── Keyword search through chunks ──
    // Extract keywords from the question and search chunk content
    const keywords = latestMessage
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, '')
      .split(' ')
      .filter(w => w.length > 3)
      .slice(0, 8)

    let query = supabase
      .from('document_chunks')
      .select('id, content, document_id')
      .eq('user_id', userId)
      .order('chunk_index', { ascending: true })
      .limit(50)

    if (courseId) {
      query = query.eq('course_id', courseId)
    }

    const { data: allChunks } = await query

    // Score chunks by keyword matches
    const scored = (allChunks ?? []).map(chunk => {
      const lower = chunk.content.toLowerCase()
      const score = keywords.reduce((acc, kw) => {
        const matches = (lower.match(new RegExp(kw, 'g')) || []).length
        return acc + matches
      }, 0)
      return { ...chunk, score }
    })

    // Take top 6 most relevant chunks
    const topChunks = scored
      .sort((a, b) => b.score - a.score)
      .slice(0, 6)
      .filter(c => c.score > 0)

    console.log('Found', topChunks.length, 'relevant chunks')

    const context = topChunks.length > 0
      ? topChunks.map((c, i) => `[Source ${i + 1}]\n${c.content}`).join('\n\n---\n\n')
      : ''

    const hasContext = context.length > 0

    const systemPrompt = hasContext
      ? `You are Muse Noir, a warm and intelligent study assistant for university students.

RULES:
- Answer ONLY using the context provided below from the student's own notes
- If the answer is not in the context, say: "I couldn't find that in your notes. Try uploading more material for this topic."
- Never make up information or use outside knowledge
- Be warm, clear, and concise

CONTEXT FROM THE STUDENT'S NOTES:
${context}`
      : `You are Muse Noir, a warm and intelligent study assistant.
The student has not uploaded any notes yet, or no relevant notes were found.
Tell them warmly to upload their course materials first.
Keep it short and encouraging.`

    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })

    const stream = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      stream: true,
      max_tokens: 800,
      temperature: 0.3,
      messages: [
        { role: 'system', content: systemPrompt },
        ...messages,
      ],
    })

    const encoder = new TextEncoder()
    const readable = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of stream) {
            const text = chunk.choices[0]?.delta?.content || ''
            if (text) controller.enqueue(encoder.encode(text))
          }
        } finally {
          controller.close()
        }
      },
    })

    return new Response(readable, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Transfer-Encoding': 'chunked',
      },
    })

  } catch (err: any) {
    console.error('Chat crash:', err.message)
    return Response.json({ error: err.message ?? 'Something went wrong' }, { status: 500 })
  }
}