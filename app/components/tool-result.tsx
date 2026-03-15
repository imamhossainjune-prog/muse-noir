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
    <div className="rounded-2xl bg-[#150f28] border border-[#1e1530] overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-[#1e1530]">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-violet-500" />
          <p className="text-xs font-medium text-[#6b5f8a]">
            {isStreaming ? 'Muse Noir is thinking...' : 'Result'}
          </p>
        </div>
        {!isStreaming && result && (
          <button onClick={copyToClipboard} className="text-xs text-[#6b5f8a] hover:text-violet-400 transition-colors">
            {copied ? 'Copied!' : 'Copy'}
          </button>
        )}
      </div>
      <div className="px-4 py-3">
        <p className="text-sm text-[#c4b5e8] leading-relaxed whitespace-pre-wrap">
          {result}
          {isStreaming && <span className="inline-block w-0.5 h-4 bg-violet-500 ml-0.5 align-middle animate-pulse" />}
        </p>
      </div>
    </div>
  )
}