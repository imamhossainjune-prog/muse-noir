'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { BottomNav } from '@/app/components/bottom-nav'

export default function ProfilePage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const supabase = createClient()
  const router = useRouter()

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) setEmail(user.email ?? '')
    })
  }, [])

  async function handleSignOut() {
    setLoading(true)
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  return (
    <main className="min-h-screen bg-[#0d0a1a] pb-24">
      <div className="sticky top-0 z-10 border-b border-[#1e1530] bg-[#0d0a1a]/90 px-5 py-4 backdrop-blur-xl">
        <h1 className="text-xl font-semibold text-[#e2d9f3]">Profile</h1>
      </div>

      <div className="px-5 pt-6 space-y-4">

        <div className="rounded-2xl bg-[#150f28] border border-[#1e1530] p-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-[#2d1f52] flex items-center justify-center text-lg font-semibold text-violet-300">
              {email.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="text-sm font-medium text-[#e2d9f3]">{email}</p>
              <p className="text-xs text-[#6b5f8a] mt-0.5">Muse Noir member</p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl bg-[#150f28] border border-[#1e1530] p-4 space-y-3">
          <p className="text-xs font-medium text-[#6b5f8a] uppercase tracking-wide">About</p>
          {[
            { label: 'App', value: 'Muse Noir' },
            { label: 'Version', value: '1.0.0' },
            { label: 'Tagline', value: 'haunts your exams' },
          ].map(({ label, value }) => (
            <div key={label} className="flex items-center justify-between">
              <p className="text-sm text-[#c4b5e8]">{label}</p>
              <p className="text-sm text-[#6b5f8a] italic">{value}</p>
            </div>
          ))}
        </div>

        <button
          onClick={handleSignOut}
          disabled={loading}
          className="w-full rounded-2xl bg-[#2a0f0f] px-4 py-3.5 text-sm font-medium text-red-400 border border-[#3d1515] disabled:opacity-50"
        >
          {loading ? 'Signing out...' : 'Sign out'}
        </button>

        <p className="text-center text-xs text-[#3c3170] italic pt-2">
          haunts your exams so you don't have to
        </p>
      </div>

      <BottomNav />
    </main>
  )
}
