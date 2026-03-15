export default function ChatLoading() {
  return (
    <main className="min-h-screen bg-[#0d0a1a] pb-16 flex flex-col">
      <div className="border-b border-[#1e1530] px-5 py-4 space-y-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-[#150f28] animate-pulse" />
          <div className="space-y-1.5">
            <div className="h-4 w-20 rounded-lg bg-[#150f28] animate-pulse" />
            <div className="h-3 w-32 rounded-lg bg-[#150f28] animate-pulse" />
          </div>
        </div>
        <div className="flex gap-2">
          {[1,2,3].map(i => (
            <div key={i} className="h-7 w-20 rounded-full bg-[#150f28] animate-pulse" />
          ))}
        </div>
      </div>
      <div className="flex-1 flex flex-col items-center justify-center gap-6 px-4">
        <div className="w-16 h-16 rounded-full bg-[#150f28] animate-pulse" />
        <div className="space-y-2 text-center">
          <div className="h-5 w-24 rounded-lg bg-[#150f28] animate-pulse mx-auto" />
          <div className="h-3 w-48 rounded-lg bg-[#150f28] animate-pulse mx-auto" />
        </div>
        <div className="w-full max-w-sm space-y-2">
          {[1,2,3,4].map(i => (
            <div key={i} className="h-12 rounded-2xl bg-[#150f28] animate-pulse" />
          ))}
        </div>
      </div>
    </main>
  )
}