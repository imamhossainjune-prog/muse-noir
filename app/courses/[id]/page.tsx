'use client'
import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { FileUploader } from '@/app/components/file-uploader'
import { DocumentCard } from '@/app/components/document-card'
import { BottomNav } from '@/app/components/bottom-nav'

export default function CoursePage() {
  const { id } = useParams() as { id: string }
  const router = useRouter()
  const [course, setCourse] = useState<any>(null)
  const [documents, setDocuments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  async function loadCourse() {
    const res = await fetch('/api/courses')
    const courses = await res.json()
    if (Array.isArray(courses)) {
      const found = courses.find((c: any) => c.id === id)
      if (found) setCourse(found)
    }
    const docsRes = await fetch(`/api/documents?courseId=${id}`)
    const docs = await docsRes.json()
    if (Array.isArray(docs)) setDocuments(docs)
    setLoading(false)
  }

  useEffect(() => { loadCourse() }, [id])

  if (loading) {
    return (
      <main className="min-h-screen bg-[#0d0a1a] pb-24 pt-2">
        <div className="h-16 bg-[#0d0a1a]/90 border-b border-[#1e1530]" />
        <div className="px-6 pt-6 space-y-3">
          {[1,2].map(i => <div key={i} className="h-32 rounded-2xl bg-[#150f28] animate-pulse" />)}
        </div>
        <BottomNav />
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-[#0d0a1a] pb-24 pt-2">
      <div className="sticky top-0 z-10 mt-0 border-b border-[#1e1530] bg-[#0d0a1a]/90 px-6 py-5 backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <button onClick={() => router.back()} className="w-8 h-8 rounded-full bg-[#150f28] border border-[#1e1530] flex items-center justify-center">
            <svg className="w-4 h-4 text-[#6b5f8a]" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
          </button>
          {course && <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: course.color }} />}
          <div>
            <h1 className="text-2xl font-semibold text-[#e2d9f3]">{course?.name ?? 'Course'}</h1>
            {course?.code && <p className="text-xs text-[#6b5f8a]">{course.code}</p>}
          </div>
        </div>
      </div>

      <div className="px-6 pt-8 space-y-6">
        <div>
          <p className="text-xs font-medium text-[#6b5f8a] uppercase tracking-wide mb-3">Upload files</p>
          <FileUploader courseId={id} onUploadComplete={loadCourse} />
        </div>

        <div>
          <p className="text-xs font-medium text-[#6b5f8a] uppercase tracking-wide mb-3">
            {documents.length > 0 ? `${documents.length} file${documents.length > 1 ? 's' : ''}` : 'No files yet'}
          </p>
          {documents.length === 0 ? (
            <div className="rounded-2xl border-2 border-dashed border-[#1e1530] p-8 text-center">
              <p className="text-[#6b5f8a] text-sm">Upload your first PDF above</p>
              <p className="text-[#3c3170] text-xs mt-1">Muse Noir will read it and generate a summary</p>
            </div>
          ) : (
            <div className="space-y-3">
              {documents
                .slice()
                .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
                .map(doc => <DocumentCard key={doc.id} document={doc} />)}
            </div>
          )}
        </div>
      </div>

      <BottomNav />
    </main>
  )
}