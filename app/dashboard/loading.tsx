export default function DashboardLoading() {
  return (
    <main className="min-h-screen bg-[#0d0a1a] pb-24 pt-2">
      <div className="border-b border-[#1e1530] px-6 py-5">
        <div className="h-6 w-32 rounded-xl bg-[#150f28] animate-pulse" />
        <div className="h-3 w-24 rounded-xl bg-[#150f28] animate-pulse mt-2" />
      </div>
      <div className="px-6 pt-8 space-y-6">
        <div className="grid grid-cols-3 gap-3">
          {[1,2,3].map(i => (
            <div key={i} className="rounded-2xl bg-[#150f28] border border-[#1e1530] p-4 space-y-2">
              <div className="h-7 w-8 rounded-lg bg-[#1e1530] animate-pulse" />
              <div className="h-3 w-16 rounded-lg bg-[#1e1530] animate-pulse" />
            </div>
          ))}
        </div>
        <div className="h-3 w-28 rounded-lg bg-[#150f28] animate-pulse" />
        <div className="rounded-2xl bg-[#150f28] border border-[#1e1530] p-4 space-y-2">
          <div className="h-4 w-24 rounded-lg bg-[#1e1530] animate-pulse" />
          <div className="h-3 w-16 rounded-lg bg-[#1e1530] animate-pulse" />
        </div>
      </div>
    </main>
  )
}