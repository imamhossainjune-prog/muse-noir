export default function ToolsLoading() {
  return (
    <main className="min-h-screen bg-[#0d0a1a] pb-24">
      <div className="border-b border-[#1e1530] px-6 py-5 space-y-1">
        <div className="h-6 w-28 rounded-xl bg-[#150f28] animate-pulse" />
        <div className="h-3 w-48 rounded-lg bg-[#150f28] animate-pulse" />
      </div>
      <div className="px-6 pt-6">
        <div className="grid grid-cols-2 gap-3">
          {[1,2,3,4,5,6,7].map(i => (
            <div key={i} className="rounded-2xl bg-[#150f28] border border-[#1e1530] p-4 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#1e1530] animate-pulse" />
              <div className="space-y-1.5">
                <div className="h-4 w-20 rounded-lg bg-[#1e1530] animate-pulse" />
                <div className="h-3 w-full rounded-lg bg-[#1e1530] animate-pulse" />
                <div className="h-3 w-3/4 rounded-lg bg-[#1e1530] animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}