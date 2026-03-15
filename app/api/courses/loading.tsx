export default function CoursesLoading() {
  return (
    <main className="min-h-screen bg-[#0d0a1a] pb-24">
      <div className="border-b border-[#1e1530] px-5 py-4 flex items-center justify-between">
        <div className="h-6 w-24 rounded-xl bg-[#150f28] animate-pulse" />
        <div className="h-8 w-24 rounded-full bg-[#150f28] animate-pulse" />
      </div>
      <div className="px-5 pt-6 space-y-6">
        {[1,2].map(i => (
          <div key={i} className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="h-5 w-28 rounded-lg bg-[#150f28] animate-pulse" />
              <div className="h-4 w-20 rounded-lg bg-[#150f28] animate-pulse" />
            </div>
            {[1,2,3].map(j => (
              <div key={j} className="rounded-2xl bg-[#150f28] border border-[#1e1530] px-4 py-3.5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-[#2d1f52] animate-pulse" />
                  <div className="space-y-1.5">
                    <div className="h-4 w-32 rounded-lg bg-[#1e1530] animate-pulse" />
                    <div className="h-3 w-16 rounded-lg bg-[#1e1530] animate-pulse" />
                  </div>
                </div>
                <div className="h-3 w-10 rounded-lg bg-[#1e1530] animate-pulse" />
              </div>
            ))}
          </div>
        ))}
      </div>
    </main>
  )
}