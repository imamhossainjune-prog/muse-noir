'use client'
import { useState } from 'react'

interface ToolResultProps {
  result: string
  isStreaming: boolean
}

export function ToolResult({ result, isStreaming }: ToolResultProps) {
  const [copied, setCopied] = useState(false)

  function copyToClipboard() {
    navigator.clipboard.writeText(result)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (!result) return null

  return (
    <div className="rounded-2xl bg-white dark:bg-zinc-900 ring-1 ring-zinc-200 dark:ring-zinc-800 overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-100 dark:border-zinc-800">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-violet-500" />
          <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
            {isStreaming ? 'Muse Noir is thinking...' : 'Result'}
          </p>
        </div>
        {!isStreaming && result && (
          <button
            onClick={copyToClipboard}
            className="text-xs text-zinc-400 dark:text-zinc-500 hover:text-violet-600 dark:hover:text-violet-400 transition-colors"
          >
            {copied ? 'Copied!' : 'Copy'}
          </button>
        )}
      </div>
      <div className="px-4 py-3">
        <p className="text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed whitespace-pre-wrap">
          {result}
          {isStreaming && (
            <span className="inline-block w-0.5 h-4 bg-violet-500 ml-0.5 align-middle animate-pulse" />
          )}
        </p>
      </div>
    </div>
  )
}