'use client'
import { useState, useRef } from 'react'

interface FileUploaderProps {
  courseId: string
  onUploadComplete: (result?: any) => void
}

export function FileUploader({ courseId, onUploadComplete }: FileUploaderProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [status, setStatus] = useState('')
  const [error, setError] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  async function handleFile(file: File) {
    if (!file.name.endsWith('.pdf')) {
      setError('Only PDF files are supported right now.')
      return
    }
    setError('')
    setIsUploading(true)
    setStatus('Uploading your file...')
    const formData = new FormData()
    formData.append('file', file)
    formData.append('courseId', courseId)
    try {
      setStatus('Reading and splitting the PDF...')
      const response = await fetch('/api/upload', { method: 'POST', body: formData })
      const result = await response.json()
      if (!response.ok) throw new Error(result.error ?? 'Upload failed')
      setStatus(`Done! Created ${result.chunksCreated} searchable chunks.`)
      onUploadComplete(result)
      setTimeout(() => setStatus(''), 4000)
    } catch (err: any) {
      setError(err.message ?? 'Something went wrong. Try again.')
    } finally {
      setIsUploading(false)
    }
  }

  function onDrop(e: React.DragEvent) {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) handleFile(file)
  }

  return (
    <div className="space-y-3">
      <div
        onClick={() => !isUploading && inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={onDrop}
        className={`flex flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed p-8 text-center transition-colors cursor-pointer ${
          isUploading
            ? 'border-violet-700 bg-[#1a0f30] cursor-wait'
            : isDragging
              ? 'border-violet-500 bg-[#1a0f30]'
              : 'border-[#2d1f52] bg-[#150f28] hover:border-violet-700'
        }`}
      >
        <svg className={`h-8 w-8 ${isUploading ? 'text-violet-400 animate-bounce' : 'text-[#4c3d6e]'}`} fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
        </svg>
        {isUploading ? (
          <p className="text-sm font-medium text-violet-400">{status}</p>
        ) : (
          <>
            <p className="text-sm font-medium text-[#c4b5e8]">Drop a PDF here or tap to browse</p>
            <p className="text-xs text-[#4c3d6e]">PDF files only · AI reads and summarizes automatically</p>
          </>
        )}
      </div>
      <input ref={inputRef} type="file" accept=".pdf" className="hidden" onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f); e.target.value = '' }} />
      {status && !isUploading && <p className="text-sm text-green-400 text-center">{status}</p>}
      {error && <div className="rounded-xl bg-[#2a0f0f] px-4 py-3"><p className="text-sm text-red-400">{error}</p></div>}
    </div>
  )
}