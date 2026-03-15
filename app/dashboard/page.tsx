import { BottomNav } from '../components/bottom-nav'

export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-zinc-50 dark:bg-zinc-950 pb-24">

      {/* Header */}
      <div className="sticky top-0 z-10 border-b border-zinc-200 bg-white/80 px-5 py-4 backdrop-blur-xl dark:border-zinc-800 dark:bg-zinc-900/80">
        <h1 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
          My Study Space
        </h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          Welcome to Muse Noir
        </p>
      </div>

      <div className="px-5 pt-6 space-y-6">

        {/* Quick stats row */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: 'Semesters', value: 0 },
            { label: 'Courses', value: 0 },
            { label: 'Files', value: 0 },
          ].map(({ label, value }) => (
             <div key={label} className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-zinc-200 dark:bg-zinc-900 dark:ring-zinc-800">
              <p className="text-2xl font-semibold text-violet-600 dark:text-violet-400">{value}</p>
              <p className="text-xs text-zinc-500 mt-0.5">{label}</p>
            </div>
          ))}
        </div>

        {/* Empty state */}
        <div className="rounded-2xl border-2 border-dashed border-zinc-200 dark:border-zinc-800 p-10 text-center">
          <p className="text-zinc-400 dark:text-zinc-500 text-sm">No semesters yet</p>
          <p className="text-zinc-400 dark:text-zinc-500 text-xs mt-1">
            Head to Courses to add your first one
          </p>
        </div>

      </div>

      <BottomNav />
    </main>
  )
}