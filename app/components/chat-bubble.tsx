interface ChatBubbleProps {
  role: 'user' | 'assistant'
  content: string
  isStreaming?: boolean
}

export function ChatBubble({ role, content, isStreaming }: ChatBubbleProps) {
  const isUser = role === 'user'

  return (
    <div className={`flex gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>

      {/* Avatar */}
      <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold ${
        isUser
          ? 'bg-violet-600 text-white'
          : 'bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900'
      }`}>
        {isUser ? 'You' : 'M'}
      </div>

      {/* Bubble */}
      <div className={`max-w-[80%] rounded-2xl px-4 py-3 ${
        isUser
          ? 'bg-violet-600 text-white rounded-tr-sm'
          : 'bg-white dark:bg-zinc-900 ring-1 ring-zinc-200 dark:ring-zinc-800 text-zinc-800 dark:text-zinc-200 rounded-tl-sm'
      }`}>
        <p className="text-sm leading-relaxed whitespace-pre-wrap">
          {content}
          {isStreaming && (
            <span className="inline-block w-0.5 h-4 bg-current ml-0.5 align-middle animate-pulse" />
          )}
        </p>
      </div>
    </div>
  )
}