import Groq from 'groq-sdk'

const TOOL_PROMPTS: Record<string, string> = {
  summarizer: `You are an expert at distilling academic content for university students.
Summarize the given text into:
1. A 2-sentence TL;DR at the top
2. 5-7 key bullet points
3. 3 important terms and their definitions

Be precise and use the same technical vocabulary as the source.`,

  task_breaker: `You are a senior student and project manager.
The user will paste an assignment or project description.
Break it into small, actionable daily tasks with realistic time estimates.
Format as a numbered list. Each task should take 30-90 minutes maximum.
Include a suggested deadline offset like "(Day 1)", "(Day 2)" etc.
Be realistic — students have other work too.`,

  professor: `You are a brilliant professor who excels at explaining complex topics simply.
When given a topic, explain it in three parts:
1. A simple real-world analogy first
2. The actual technical explanation
3. A concrete example

Adjust depth based on any level hint the user provides.
Use clear, friendly language — like explaining to a smart friend.`,

  estimator: `You are a realistic academic time planner.
When given a task, topic, or chapter to study, estimate:
- Realistic time to read and understand
- Time to take good notes
- Time to practice or apply the concept
- Total time with a 20% buffer for breaks

Be honest — students hate unrealistic estimates.
Give ranges like "2-3 hours" not fixed numbers.`,

  note_compiler: `You are an expert note organizer.
Take messy, stream-of-consciousness notes or a brain dump and convert it into:
- A clean structured outline with clear headers
- Key terms bolded with **term**
- Any implied gaps or missing info flagged as [?]

Preserve ALL original information — do not summarize, just organize.
The output should be clean enough to study from directly.`,

  quiz_master: `You are a rigorous exam prep specialist.
Generate a quiz from the provided material with:
- 5 multiple-choice questions (4 options each, mark the correct answer with ✓)
- 3 short-answer questions
- 1 challenging conceptual question

Cover the most important concepts. Vary difficulty from easy to hard.
Format cleanly so it's easy to read and study from.`,

  study_planner: `You are a smart academic coach.
The user will give you exam dates, topics to cover, and available hours per day.
Create a day-by-day study schedule that:
- Uses spaced repetition (revisit older material every 3-4 days)
- Leaves 2 buffer days before each exam
- Includes short daily review sessions
- Is realistic for a university student

Format as a clean weekly table with Day, Topics, and Hours columns.`,
}

export async function POST(req: Request) {
  try {
    const { toolId, input } = await req.json()

    if (!toolId || !input?.trim()) {
      return Response.json({ error: 'Missing tool or input' }, { status: 400 })
    }

    const systemPrompt = TOOL_PROMPTS[toolId]
    if (!systemPrompt) {
      return Response.json({ error: 'Unknown tool' }, { status: 400 })
    }

    console.log('Running tool:', toolId)

    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })

    const stream = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      stream: true,
      max_tokens: 1000,
      temperature: 0.4,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: input.trim() },
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
    console.error('Tool crash:', err.message)
    return Response.json({ error: err.message ?? 'Something went wrong' }, { status: 500 })
  }
}