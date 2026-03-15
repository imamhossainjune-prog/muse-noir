interface DocumentCardProps {
  document: {
    id: string
    file_name: string
    summary: string | null
    is_processed: boolean
    created_at: string
  }
}

export function DocumentCard({ document }: DocumentCardProps) {
  const uploadDate = new Date(document.created_at).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
  })

  return (
    <div className="rounded-2xl bg-[#150f28] border border-[#1e1530] p-4 space-y-3">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="flex-shrink-0 w-9 h-9 rounded-xl bg-[#2a0f0f] flex items-center justify-center">
            <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
            </svg>
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium text-[#e2d9f3] truncate">{document.file_name}</p>
            <p className="text-xs text-[#6b5f8a]">{uploadDate}</p>
          </div>
        </div>
        <span className={`flex-shrink-0 text-xs font-medium px-2.5 py-0.5 rounded-full ${
          document.is_processed
            ? 'bg-[#0d2818] text-green-400'
            : 'bg-[#1e1a0a] text-amber-400'
        }`}>
          {document.is_processed ? 'Ready' : 'Processing...'}
        </span>
      </div>

      {document.summary ? (
        <div className="border-t border-[#1e1530] pt-3">
          <p className="text-xs font-medium text-[#6b5f8a] uppercase tracking-wide mb-1.5">AI Summary</p>
          <p className="text-sm text-[#9d8fc0] leading-relaxed whitespace-pre-line">{document.summary}</p>
        </div>
      ) : (
        <div className="border-t border-[#1e1530] pt-3">
          <p className="text-xs text-[#3c3170] italic">Generating summary...</p>
        </div>
      )}
    </div>
  )
}