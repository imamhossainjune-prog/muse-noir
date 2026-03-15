import { createClient } from '@/lib/supabase/server'
import Groq from 'groq-sdk'



async function embedQuestion(text: string): Promise<number[]> {
  try {
    const { pipeline } = await import('@xenova/transformers')
    const extractor = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2')
    const output = await extractor(text, { pooling: 'mean', normalize: true })
    return Array.from(output.data as Float32Array)
  } catch (err: any) {
    console.error('Embed error:', err.message)
    return new Array(384).fill(0)
  }
}

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

    // ── STEP 1: Embed the question ──
    const queryEmbedding = await embedQuestion(latestMessage)

    // ── STEP 2: Find the most relevant chunks from notes ──
    const { data: chunks, error: searchError } = await supabase.rpc('match_chunks', {
      query_embedding: queryEmbedding,
      match_user_id: userId,
      match_course_id: courseId || null,
      match_count: 6,
    })

    if (searchError) {
      console.error('Search error:', searchError)
    }

    console.log('Found', chunks?.length ?? 0, 'relevant chunks')

    // ── STEP 3: Build context from retrieved chunks ──
    const context = chunks && chunks.length > 0
      ? chunks.map((c: any, i: number) => `[Source ${i + 1}]\n${c.content}`).join('\n\n---\n\n')
      : ''

    const hasContext = context.length > 0

    // ── STEP 4: Build the system prompt ──
    const systemPrompt = hasContext
      ? `You are Muse Noir, a warm and intelligent study assistant for university students.

RULES:
- Answer ONLY using the context provided below from the student's own notes
- If the answer is not in the context, say: "I couldn't find that in your notes. Try uploading more material for this topic."
- Never make up information or use outside knowledge
- Be warm, clear, and concise — like a brilliant friend explaining something
- If context partially answers the question, share what you found and note what's missing

CONTEXT FROM THE STUDENT'S NOTES:
${context}`
      : `You are Muse Noir, a warm and intelligent study assistant.
The student has not uploaded any notes yet, or no relevant notes were found.
Tell them warmly that you need their notes to answer and suggest they upload course materials first.
Keep it short and encouraging.`

    // ── STEP 5: Stream the response ──
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

    // ── STEP 6: Return streaming response ──
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