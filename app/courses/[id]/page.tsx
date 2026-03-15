'use client'
import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { FileUploader } from '../../components/file-uploader'
import { DocumentCard } from '../../components/document-card'
import { BottomNav } from '../../components/bottom-nav'

export default function CoursePage() {
  const { id } = useParams() as { id: string }
  const [course, setCourse] = useState<any>(null)
  const [documents, setDocuments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  async function loadCourse() {
    const res = await fetch('/api/courses')
    const courses = await res.json()
    if (Array.isArray(courses)) {
      const found = courses.find((c: any) => c.id === id)
      if (found) {
        setCourse(found)
      }
    }
    const docsRes = await fetch(`/api/documents?courseId=${id}`)
    const docs = await docsRes.json()
    if (Array.isArray(docs)) setDocuments(docs)
    setLoading(false)
  }

  useEffect(() => { loadCourse() }, [id])

  function handleUploadComplete() {
    loadCourse()
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex items-center justify-center pb-24">
        <p className="text-zinc-400 text-sm">Loading...</p>
        <BottomNav />
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-zinc-50 dark:bg-zinc-950 pb-24">
      <div className="sticky top-0 z-10 border-b border-zinc-200 bg-white/80 px-5 py-4 backdrop-blur-xl dark:border-zinc-800 dark:bg-zinc-900/80">
        <div className="flex items-center gap-3">
          {course && (
            <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: course.color }} />
          )}
          <div>
            <h1 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
              {course?.name ?? 'Course'}
            </h1>
            {course?.code && (
              <p className="text-xs text-zinc-400 dark:text-zinc-500">{course.code}</p>
            )}
          </div>
        </div>
      </div>

      <div className="px-5 pt-6 space-y-6">
        <div>
          <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wide mb-3">
            Upload files
          </p>
          <FileUploader courseId={id} onUploadComplete={handleUploadComplete} />
        </div>

        <div>
          <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wide mb-3">
            {documents.length > 0
              ? `${documents.length} file${documents.length > 1 ? 's' : ''}`
              : 'No files yet'}
          </p>

          {documents.length === 0 ? (
            <div className="rounded-2xl border-2 border-dashed border-zinc-200 dark:border-zinc-800 p-8 text-center">
              <p className="text-zinc-400 text-sm">Upload your first PDF above</p>
              <p className="text-zinc-400 text-xs mt-1">
                Muse Noir will read it and generate a summary instantly
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {documents
                .slice()
                .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
                .map(doc => (
                  <DocumentCard key={doc.id} document={doc} />
                ))}
            </div>
          )}
        </div>
      </div>

      <BottomNav />
    </main>
  )
}