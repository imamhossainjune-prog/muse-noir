import { createClient } from '@/lib/supabase/server'
import { BottomNav } from '@/app/components/bottom-nav'
import { redirect } from 'next/navigation'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: semesters } = await supabase
    .from('semesters')
    .select('*, courses(*)')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  const { data: documents } = await supabase
    .from('documents')
    .select('id')
    .eq('user_id', user.id)

  const totalCourses = semesters?.reduce((acc, s) => acc + (s.courses?.length ?? 0), 0) ?? 0
  const totalFiles = documents?.length ?? 0
  const activeSemester = semesters?.find(s => s.is_active)

  return (
    <main className="min-h-screen bg-[#0d0a1a] pb-24 pt-3">

      {/* Header */}
      <div className="sticky top-0 z-10 border-b border-[#1e1530] bg-[#0d0a1a]/90 px-6 py-5 backdrop-blur-xl" style={{ borderBottom: '1px solid rgba(167,139,250,0.08)' }}>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-[#150f28] border border-[#2d1f52] flex items-center justify-center text-xs font-bold text-violet-400" style={{ fontFamily: 'Georgia, serif' }}>
            M
          </div>
          <div>
            <h1 className="text-xl font-semibold text-[#e2d9f3]">My Study Space</h1>
            <p className="text-xs text-[#6b5f8a] mt-0.5">{user.email}</p>
          </div>
        </div>
      </div>

      <div className="px-6 pt-8 space-y-8">

        {/* Stat pills */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: 'SEMESTERS', value: semesters?.length ?? 0, color: '#7c3aed' },
            { label: 'COURSES', value: totalCourses, color: '#a78bfa' },
            { label: 'FILES', value: totalFiles, color: '#c4b5fd' },
          ].map(({ label, value, color }) => (
            <div
              key={label}
              className="rounded-2xl p-4 flex flex-col items-center justify-center gap-2 text-center"
              style={{
                background: '#150f28',
                border: '1px solid #2d1f52',
              }}
            >
              <div
                className="text-3xl font-bold"
                style={{ fontFamily: 'Georgia, serif', color }}
              >
                {value}
              </div>
              <div
                className="text-[9px] font-medium tracking-widest px-2.5 py-1 rounded-full"
                style={{
                  color,
                  background: color + '15',
                  border: `1px solid ${color}30`,
                  letterSpacing: '0.12em',
                }}
              >
                {label}
              </div>
            </div>
          ))}
        </div>

        {/* Active semester */}
        {activeSemester && (
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="flex-1 h-px" style={{ background: '#1e1530' }} />
              <span className="text-[9px] text-[#3c3170] tracking-widest">ACTIVE SEMESTER</span>
              <div className="flex-1 h-px" style={{ background: '#1e1530' }} />
            </div>
            <div
              className="rounded-2xl p-5"
              style={{ background: '#150f28', border: '1px solid #2d1f52' }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-base font-semibold text-[#e2d9f3]">{activeSemester.name}</p>
                  <p className="text-xs text-[#6b5f8a] mt-1">
                    {activeSemester.courses?.length ?? 0} courses
                  </p>
                </div>
                <span
                  className="text-xs font-medium px-3 py-1 rounded-full"
                  style={{ background: '#2d1f52', color: '#c4b5fd', border: '1px solid #4c1d9550' }}
                >
                  Active
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Semesters list */}
        {semesters && semesters.length > 0 && (
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="flex-1 h-px" style={{ background: '#1e1530' }} />
              <span className="text-[9px] text-[#3c3170] tracking-widest">ALL SEMESTERS</span>
              <div className="flex-1 h-px" style={{ background: '#1e1530' }} />
            </div>
            <div className="space-y-3">
              {semesters.map(semester => (
                <div
                  key={semester.id}
                  className="rounded-2xl px-5 py-4"
                  style={{ background: '#150f28', border: '1px solid #1e1530' }}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-[#e2d9f3]">{semester.name}</p>
                      <p className="text-xs text-[#6b5f8a] mt-0.5">
                        {semester.courses?.length ?? 0} courses
                      </p>
                    </div>
                    {semester.is_active && (
                      <span
                        className="text-xs font-medium px-2.5 py-0.5 rounded-full"
                        style={{ background: '#2d1f52', color: '#a78bfa' }}
                      >
                        Active
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty state */}
        {(!semesters || semesters.length === 0) && (
          <div
            className="rounded-2xl p-12 text-center"
            style={{ border: '2px dashed #1e1530' }}
          >
            <p className="text-[#6b5f8a] text-sm">No semesters yet</p>
            <p className="text-[#3c3170] text-xs mt-2">Head to Courses to add your first one</p>
          </div>
        )}

        {/* Tagline watermark */}
        <p className="text-center pb-4" style={{ fontSize: '9px', color: '#1e1530', letterSpacing: '3px', fontFamily: 'Georgia, serif', fontStyle: 'italic' }}>
          haunts your exams so you don't have to
        </p>

      </div>

      <BottomNav />
    </main>
  )
}