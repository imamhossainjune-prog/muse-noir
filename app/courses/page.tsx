'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { BottomNav } from '@/app/components/bottom-nav'

interface Course {
  id: string
  name: string
  code: string | null
  color: string
  documents: any[]
}

interface Semester {
  id: string
  name: string
  is_active: boolean
  courses: Course[]
}

export default function CoursesPage() {
  const [semesters, setSemesters] = useState<Semester[]>([])
  const [loading, setLoading] = useState(true)
  const [showNewSemester, setShowNewSemester] = useState(false)
  const [showNewCourse, setShowNewCourse] = useState<string | null>(null)
  const [semesterName, setSemesterName] = useState('')
  const [courseName, setCourseName] = useState('')
  const [courseCode, setCourseCode] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetch('/api/semesters')
      .then(r => r.json())
      .then(data => {
        setSemesters(Array.isArray(data) ? data : [])
        setLoading(false)
      })
  }, [])

  async function createSemester() {
    if (!semesterName.trim()) return
    setSaving(true)
    const res = await fetch('/api/semesters', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: semesterName }),
    })
    const newSemester = await res.json()
    setSemesters(prev => [{ ...newSemester, courses: [] }, ...prev])
    setSemesterName('')
    setShowNewSemester(false)
    setSaving(false)
  }

  async function createCourse(semesterId: string) {
    if (!courseName.trim()) return
    setSaving(true)
    const res = await fetch('/api/courses', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: courseName, code: courseCode, semesterId }),
    })
    const newCourse = await res.json()
    if (newCourse.error) {
      alert('Error: ' + newCourse.error)
      setSaving(false)
      return
    }
    setSemesters(prev => prev.map(s =>
      s.id === semesterId
        ? { ...s, courses: [...(s.courses ?? []), { ...newCourse, documents: [] }] }
        : s
    ))
    setCourseName('')
    setCourseCode('')
    setShowNewCourse(null)
    setSaving(false)
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-[#0d0a1a] pb-24">
        <div className="border-b border-[#1e1530] px-6 py-5 flex items-center justify-between">
          <div className="h-6 w-24 rounded-xl bg-[#150f28] animate-pulse" />
          <div className="h-8 w-24 rounded-full bg-[#150f28] animate-pulse" />
        </div>
        <div className="px-6 pt-8 space-y-10">
          {[1, 2].map(i => (
            <div key={i} className="space-y-3">
              <div className="h-5 w-28 rounded-lg bg-[#150f28] animate-pulse" />
              {[1, 2, 3].map(j => (
                <div key={j} className="rounded-2xl bg-[#150f28] border border-[#1e1530] px-5 py-4">
                  <div className="h-4 w-32 rounded-lg bg-[#1e1530] animate-pulse" />
                </div>
              ))}
            </div>
          ))}
        </div>
        <BottomNav />
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-[#0d0a1a] pb-24">

      {/* Header */}
      <div className="sticky top-0 z-10 border-b border-[#1e1530] bg-[#0d0a1a]/90 px-6 py-5 backdrop-blur-xl flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-[#e2d9f3]">Courses</h1>
        <button
          onClick={() => setShowNewSemester(true)}
          className="flex items-center gap-1.5 rounded-full bg-violet-700 px-4 py-2 text-sm font-medium text-white"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Semester
        </button>
      </div>

      <div className="px-6 pt-8 space-y-10">

        {/* New semester form */}
        {showNewSemester && (
          <div className="rounded-2xl bg-[#150f28] border border-[#2d1f52] p-5 space-y-3">
            <p className="text-sm font-medium text-[#c4b5e8]">New semester</p>
            <input
              autoFocus
              value={semesterName}
              onChange={e => setSemesterName(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && createSemester()}
              placeholder="e.g. Fall 2025"
              className="w-full rounded-xl border border-[#2d1f52] bg-[#0d0a1a] px-4 py-3 text-sm text-[#e2d9f3] placeholder-[#4c3d6e] focus:outline-none focus:border-violet-600"
            />
            <div className="flex gap-2">
              <button
                onClick={createSemester}
                disabled={saving}
                className="flex-1 rounded-xl bg-violet-700 py-2.5 text-sm font-medium text-white disabled:opacity-50"
              >
                {saving ? 'Creating...' : 'Create'}
              </button>
              <button
                onClick={() => { setShowNewSemester(false); setSemesterName('') }}
                className="rounded-xl px-4 py-2.5 text-sm text-[#6b5f8a]"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Empty state */}
        {semesters.length === 0 && !showNewSemester && (
          <div className="rounded-2xl border-2 border-dashed border-[#1e1530] p-12 text-center">
            <p className="text-[#6b5f8a] text-sm">No semesters yet</p>
            <p className="text-[#3c3170] text-xs mt-2">
              Tap the Semester button above to create your first one
            </p>
          </div>
        )}

        {/* Semesters list */}
        {semesters.map(semester => (
          <div key={semester.id} className="space-y-4">

            {/* Semester header row */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <h2 className="text-base font-semibold text-[#e2d9f3]">{semester.name}</h2>
                {semester.is_active && (
                  <span className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-[#2d1f52] text-violet-300">
                    Active
                  </span>
                )}
              </div>
              <button
                onClick={() => setShowNewCourse(semester.id)}
                className="text-xs font-medium text-violet-400 hover:text-violet-300 transition-colors"
              >
                + Add course
              </button>
            </div>

            {/* New course form */}
            {showNewCourse === semester.id && (
              <div className="rounded-2xl bg-[#150f28] border border-[#2d1f52] p-5 space-y-3">
                <input
                  autoFocus
                  value={courseName}
                  onChange={e => setCourseName(e.target.value)}
                  placeholder="Course name — e.g. Data Structures"
                  className="w-full rounded-xl border border-[#2d1f52] bg-[#0d0a1a] px-4 py-3 text-sm text-[#e2d9f3] placeholder-[#4c3d6e] focus:outline-none focus:border-violet-600"
                />
                <input
                  value={courseCode}
                  onChange={e => setCourseCode(e.target.value)}
                  placeholder="Course code — e.g. CSE 201 (optional)"
                  className="w-full rounded-xl border border-[#2d1f52] bg-[#0d0a1a] px-4 py-3 text-sm text-[#e2d9f3] placeholder-[#4c3d6e] focus:outline-none focus:border-violet-600"
                />
                <div className="flex gap-2">
                  <button
                    onClick={() => createCourse(semester.id)}
                    disabled={saving}
                    className="flex-1 rounded-xl bg-violet-700 py-2.5 text-sm font-medium text-white disabled:opacity-50"
                  >
                    {saving ? 'Creating...' : 'Create course'}
                  </button>
                  <button
                    onClick={() => { setShowNewCourse(null); setCourseName(''); setCourseCode('') }}
                    className="rounded-xl px-4 py-2.5 text-sm text-[#6b5f8a]"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {/* No courses message */}
            {(!semester.courses || semester.courses.length === 0) && showNewCourse !== semester.id && (
              <p className="text-sm text-[#3c3170] pl-1">
                No courses yet — tap + Add course
              </p>
            )}

            {/* Course cards */}
            <div className="space-y-3">
              {(semester.courses ?? []).map(course => (
                <Link
                  key={course.id}
                  href={`/courses/${course.id}`}
                  className="flex items-center justify-between rounded-2xl bg-[#150f28] border border-[#1e1530] px-5 py-4 active:opacity-70 transition-all hover:border-[#2d1f52]"
                >
                  <div className="flex items-center gap-4">
                    <div
                      className="w-3.5 h-3.5 rounded-full flex-shrink-0"
                      style={{ backgroundColor: course.color }}
                    />
                    <div>
                      <p className="text-base font-medium text-[#e2d9f3]">{course.name}</p>
                      {course.code && (
                        <p className="text-xs text-[#6b5f8a] mt-0.5">{course.code}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-[#3c3170]">
                      {course.documents?.length ?? 0} files
                    </span>
                    <svg className="w-4 h-4 text-[#2d1f52]" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                    </svg>
                  </div>
                </Link>
              ))}
            </div>

          </div>
        ))}
      </div>

      <BottomNav />
    </main>
  )
}