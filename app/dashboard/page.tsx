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
    <main className="min-h-screen bg-[#0d0a1a] pb-24">
      <div className="sticky top-0 z-10 border-b border-[#1e1530] bg-[#0d0a1a]/90 px-5 py-4 backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-[#150f28] border border-[#2d1f52] flex items-center justify-center text-xs font-bold text-violet-400">
            M
          </div>
          <div>
            <h1 className="text-lg font-semibold text-[#e2d9f3]">My Study Space</h1>
            <p className="text-xs text-[#6b5f8a]">{user.email}</p>
          </div>
        </div>
      </div>

      <div className="px-5 pt-6 space-y-6">
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: 'Semesters', value: semesters?.length ?? 0 },
            { label: 'Courses', value: totalCourses },
            { label: 'Files', value: totalFiles },
          ].map(({ label, value }) => (
            <div key={label} className="rounded-2xl bg-[#150f28] p-4 border border-[#1e1530]">
              <p className="text-2xl font-semibold text-violet-400">{value}</p>
              <p className="text-xs text-[#6b5f8a] mt-0.5">{label}</p>
            </div>
          ))}
        </div>

        {activeSemester && (
          <div>
            <p className="text-xs font-medium text-[#6b5f8a] uppercase tracking-wide mb-3">
              Active semester
            </p>
            <div className="rounded-2xl bg-[#150f28] border border-[#1e1530] p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-[#e2d9f3]">{activeSemester.name}</p>
                  <p className="text-xs text-[#6b5f8a] mt-0.5">
                    {activeSemester.courses?.length ?? 0} courses
                  </p>
                </div>
                <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-[#2d1f52] text-violet-300">
                  Active
                </span>
              </div>
            </div>
          </div>
        )}

        {(!semesters || semesters.length === 0) && (
          <div className="rounded-2xl border-2 border-dashed border-[#1e1530] p-10 text-center">
            <p className="text-[#6b5f8a] text-sm">No semesters yet</p>
            <p className="text-[#6b5f8a] text-xs mt-1">Head to Courses to add your first one</p>
          </div>
        )}

        <p className="text-center text-xs text-[#3c3170] italic pt-4">
          haunts your exams so you don't have to
        </p>
      </div>

      <BottomNav />
    </main>
  )
}