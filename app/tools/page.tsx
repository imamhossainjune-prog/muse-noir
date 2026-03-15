'use client'
import { useState } from 'react'
import { ToolResult } from '@/app/components/tool-result'
import { BottomNav } from '@/app/components/bottom-nav'

const TOOLS = [
  { id: 'summarizer', name: 'Summarizer', description: 'Turn any text into clean bullet point notes', placeholder: 'Paste your lecture notes, textbook chapter, or any text here...', color: '#a78bfa', icon: 'M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25H12' },
  { id: 'task_breaker', name: 'Task breaker', description: 'Break any assignment into small daily tasks', placeholder: 'Paste your assignment description or project brief here...', color: '#34d399', icon: 'M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15' },
  { id: 'professor', name: 'Professor', description: 'Explain any topic in simple terms with examples', placeholder: 'Type a topic or concept you want explained simply...', color: '#fbbf24', icon: 'M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5' },
  { id: 'estimator', name: 'Estimator', description: 'Find out how long a topic will take to study', placeholder: 'Describe the topic or task you need to study...', color: '#f472b6', icon: 'M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z' },
  { id: 'note_compiler', name: 'Note compiler', description: 'Turn messy notes into a clean structured outline', placeholder: 'Paste your messy notes or brain dump here...', color: '#60a5fa', icon: 'M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10' },
  { id: 'quiz_master', name: 'Quiz master', description: 'Generate MCQ and short answer questions', placeholder: 'Paste the material you want to be quizzed on...', color: '#f87171', icon: 'M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z' },
  { id: 'study_planner', name: 'Study planner', description: 'Create a weekly study schedule from your exam dates', placeholder: 'List your exam dates, topics to cover, and hours available per day...', color: '#818cf8', icon: 'M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5' },
]

export default function ToolsPage() {
  const [activeTool, setActiveTool] = useState<string | null>(null)
  const [input, setInput] = useState('')
  const [result, setResult] = useState('')
  const [isStreaming, setIsStreaming] = useState(false)
  const selectedTool = TOOLS.find(t => t.id === activeTool)

  function selectTool(toolId: string) { setActiveTool(toolId); setInput(''); setResult('') }
  function goBack() { setActiveTool(null); setInput(''); setResult('') }

  async function runTool() {
    if (!input.trim() || !activeTool || isStreaming) return
    setResult('')
    setIsStreaming(true)
    try {
      const response = await fetch('/api/tools', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ toolId: activeTool, input }),
      })
      if (!response.ok) { const err = await response.json(); throw new Error(err.error ?? 'Tool failed') }
      const reader = response.body!.getReader()
      const decoder = new TextDecoder()
      let fullText = ''
      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        fullText += decoder.decode(value, { stream: true })
        setResult(fullText)
      }
    } catch (err: any) {
      setResult('Something went wrong: ' + err.message)
    } finally {
      setIsStreaming(false)
    }
  }

  if (activeTool && selectedTool) {
    return (
      <main className="min-h-screen bg-[#0d0a1a] pb-24 pt-2">
        <div className="sticky top-0 z-10 mt-0 border-b border-[#1e1530] bg-[#0d0a1a]/90 px-6 py-5 backdrop-blur-xl flex items-center gap-3">
          <button onClick={goBack} className="w-8 h-8 rounded-full bg-[#150f28] border border-[#1e1530] flex items-center justify-center">
            <svg className="w-4 h-4 text-[#6b5f8a]" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
          </button>
          <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ backgroundColor: selectedTool.color + '20' }}>
            <svg className="w-4 h-4" fill="none" stroke={selectedTool.color} strokeWidth={1.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d={selectedTool.icon} />
            </svg>
          </div>
          <div>
            <h1 className="text-base font-semibold text-[#e2d9f3]">{selectedTool.name}</h1>
            <p className="text-xs text-[#6b5f8a]">{selectedTool.description}</p>
          </div>
        </div>
        <div className="px-6 pt-6 space-y-4">
          <div className="rounded-2xl bg-[#150f28] border border-[#1e1530] overflow-hidden">
            <textarea
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder={selectedTool.placeholder}
              rows={6}
              className="w-full p-4 text-sm text-[#e2d9f3] placeholder-[#4c3d6e] bg-transparent resize-none focus:outline-none leading-relaxed"
            />
            <div className="flex items-center justify-between px-4 py-3 border-t border-[#1e1530]">
              <p className="text-xs text-[#3c3170]">{input.length} characters</p>
              <button
                onClick={runTool}
                disabled={!input.trim() || isStreaming}
                className="flex items-center gap-2 rounded-full bg-violet-700 px-4 py-2 text-sm font-medium text-white disabled:opacity-40"
              >
                {isStreaming ? (
                  <><span className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />Running...</>
                ) : (
                  <><svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" /></svg>Run</>
                )}
              </button>
            </div>
          </div>
          <ToolResult result={result} isStreaming={isStreaming} />
        </div>
        <BottomNav />
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-[#0d0a1a] pb-24 pt-2">
      <div className="sticky top-0 z-10 mt-0 border-b border-[#1e1530] bg-[#0d0a1a]/90 px-6 py-5 backdrop-blur-xl">
        <h1 className="text-xl font-semibold text-[#e2d9f3]">Magic Tools</h1>
        <p className="text-sm text-[#3c3170] mt-0.5 italic">haunts your exams so you don't have to</p>
      </div>
      <div className="px-6 pt-6">
        <div className="grid grid-cols-2 gap-3">
          {TOOLS.map(tool => (
            <button
              key={tool.id}
              onClick={() => selectTool(tool.id)}
              className="text-left rounded-2xl bg-[#150f28] border border-[#1e1530] p-4 hover:border-[#2d1f52] transition-all active:opacity-70"
            >
              <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3" style={{ backgroundColor: tool.color + '18' }}>
                <svg className="w-5 h-5" fill="none" stroke={tool.color} strokeWidth={1.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d={tool.icon} />
                </svg>
              </div>
              <p className="text-sm font-medium text-[#e2d9f3] mb-1">{tool.name}</p>
              <p className="text-xs text-[#6b5f8a] leading-relaxed">{tool.description}</p>
            </button>
          ))}
        </div>
      </div>
      <BottomNav />
    </main>
  )
}