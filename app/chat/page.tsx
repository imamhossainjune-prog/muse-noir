'use client'
import { useState, useEffect, useRef } from 'react'
import { ChatBubble } from '../components/chat-bubble'
import { TypingIndicator } from '../components/typing-indicator'
import { CourseSelector } from '../components/course-selector'
import { BottomNav } from '../components/bottom-nav'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

interface Course {
  id: string
  name: string
  code: string | null
  color: string
}

const SUGGESTIONS = [
  'Summarize the key points from my notes',
  'What are the most important concepts?',
  'Explain the main topic in simple terms',
  'What questions might appear on my exam?',
]

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isStreaming, setIsStreaming] = useState(false)
  const [courses, setCourses] = useState<Course[]>([])
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    fetch('/api/courses')
      .then(r => r.json())
      .then(data => { if (Array.isArray(data)) setCourses(data) })
  }, [])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isLoading])

  function handleInputChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    setInput(e.target.value)
    e.target.style.height = 'auto'
    e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px'
  }

  async function sendMessage(text?: string) {
    const messageText = (text ?? input).trim()
    if (!messageText || isLoading || isStreaming) return

    const userMessage: Message = { role: 'user', content: messageText }
    const updatedMessages = [...messages, userMessage]
    setMessages(updatedMessages)
    setInput('')
    setIsLoading(true)

    if (inputRef.current) inputRef.current.style.height = 'auto'

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: updatedMessages,
          courseId: selectedCourseId,
        }),
      })

      if (!response.ok) {
        const err = await response.json()
        throw new Error(err.error ?? 'Chat failed')
      }

      setIsLoading(false)
      setIsStreaming(true)

      setMessages(prev => [...prev, { role: 'assistant', content: '' }])

      const reader = response.body!.getReader()
      const decoder = new TextDecoder()
      let fullText = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        const chunk = decoder.decode(value, { stream: true })
        fullText += chunk
        setMessages(prev => {
          const updated = [...prev]
          updated[updated.length - 1] = { role: 'assistant', content: fullText }
          return updated
        })
      }

    } catch (err: any) {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Something went wrong. Please try again.',
      }])
    } finally {
      setIsLoading(false)
      setIsStreaming(false)
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const showWelcome = messages.length === 0

  return (
    <main className="flex flex-col min-h-screen bg-zinc-50 dark:bg-zinc-950 pb-16">

      {/* Header */}
      <div className="sticky top-0 z-10 border-b border-zinc-200 bg-white/80 px-5 py-4 backdrop-blur-xl dark:border-zinc-800 dark:bg-zinc-900/80 space-y-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-zinc-900 dark:bg-zinc-100 flex items-center justify-center text-xs font-bold text-white dark:text-zinc-900">
            M
          </div>
          <div>
            <h1 className="text-base font-semibold text-zinc-900 dark:text-zinc-100 leading-none">
              Muse Noir
            </h1>
            <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-0.5">
              {selectedCourseId
                ? `Searching: ${courses.find(c => c.id === selectedCourseId)?.name ?? 'selected course'}`
                : 'Searching all your notes'}
            </p>
          </div>
        </div>

        {courses.length > 0 && (
          <CourseSelector
            courses={courses}
            selectedId={selectedCourseId}
            onChange={setSelectedCourseId}
          />
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">

        {/* Welcome screen */}
        {showWelcome && (
          <div className="flex flex-col items-center justify-center min-h-[50vh] text-center px-4 space-y-6">
            <div className="w-16 h-16 rounded-full bg-zinc-900 dark:bg-zinc-100 flex items-center justify-center text-2xl font-bold text-white dark:text-zinc-900">
              M
            </div>
            <div className="space-y-1.5">
              <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
                Muse Noir
              </h2>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 max-w-xs">
                Ask me anything about your uploaded notes. I only answer from what you've given me — nothing made up.
              </p>
            </div>
            <div className="flex flex-col gap-2 w-full max-w-sm">
              {SUGGESTIONS.map(suggestion => (
                <button
                  key={suggestion}
                  onClick={() => sendMessage(suggestion)}
                  className="text-left rounded-2xl bg-white dark:bg-zinc-900 ring-1 ring-zinc-200 dark:ring-zinc-800 px-4 py-3 text-sm text-zinc-700 dark:text-zinc-300 hover:ring-violet-300 dark:hover:ring-violet-700 transition-all"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Message bubbles */}
        {messages.map((message, index) => (
          <ChatBubble
            key={index}
            role={message.role}
            content={message.content}
            isStreaming={isStreaming && index === messages.length - 1 && message.role === 'assistant'}
          />
        ))}

        {isLoading && <TypingIndicator />}
        <div ref={messagesEndRef} />
      </div>

      {/* Input bar */}
      <div className="sticky bottom-16 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-xl border-t border-zinc-200 dark:border-zinc-800 px-4 py-3">
        <div className="flex items-end gap-2 bg-zinc-100 dark:bg-zinc-800 rounded-2xl px-4 py-2.5">
          <textarea
            ref={inputRef}
            value={input}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder="Ask about your notes..."
            rows={1}
            disabled={isLoading || isStreaming}
            className="flex-1 bg-transparent text-sm text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 resize-none focus:outline-none leading-relaxed disabled:opacity-50 max-h-[120px]"
          />
          <button
            onClick={() => sendMessage()}
            disabled={!input.trim() || isLoading || isStreaming}
            className="flex-shrink-0 w-8 h-8 rounded-full bg-violet-600 flex items-center justify-center disabled:opacity-30 transition-opacity"
          >
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 10.5L12 3m0 0l7.5 7.5M12 3v18" />
            </svg>
          </button>
        </div>
        <p className="text-center text-xs text-zinc-400 dark:text-zinc-600 mt-2">
          Enter to send · Shift+Enter for new line
        </p>
      </div>

      <BottomNav />
    </main>
  )
}