'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { BottomNav } from '../components/bottom-nav'

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
    <main className="min-h-screen bg-zinc-50 dark:bg-zinc-950 pb-24">
      <div className="sticky top-0 z-10 border-b border-zinc-200 bg-white/80 px-5 py-4 backdrop-blur-xl dark:border-zinc-800 dark:bg-zinc-900/80">
        <h1 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">Profile</h1>
      </div>

      <div className="px-5 pt-6 space-y-4">

        {/* User info card */}
        <div className="rounded-2xl bg-white dark:bg-zinc-900 ring-1 ring-zinc-200 dark:ring-zinc-800 p-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center text-lg font-semibold text-violet-600 dark:text-violet-400">
              {email.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                {email}
              </p>
              <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-0.5">
                Muse Noir member
              </p>
            </div>
          </div>
        </div>

        {/* App info */}
        <div className="rounded-2xl bg-white dark:bg-zinc-900 ring-1 ring-zinc-200 dark:ring-zinc-800 p-4 space-y-3">
          <p className="text-xs font-medium text-zinc-400 uppercase tracking-wide">About</p>
          <div className="flex items-center justify-between">
            <p className="text-sm text-zinc-700 dark:text-zinc-300">App</p>
            <p className="text-sm text-zinc-400">Muse Noir</p>
          </div>
          <div className="flex items-center justify-between">
            <p className="text-sm text-zinc-700 dark:text-zinc-300">Version</p>
            <p className="text-sm text-zinc-400">1.0.0</p>
          </div>
          <div className="flex items-center justify-between">
            <p className="text-sm text-zinc-700 dark:text-zinc-300">Tagline</p>
            <p className="text-sm text-zinc-400 italic">haunts your exams</p>
          </div>
        </div>

        {/* Sign out button */}
        <button
          onClick={handleSignOut}
          disabled={loading}
          className="w-full rounded-2xl bg-red-50 dark:bg-red-950/30 px-4 py-3.5 text-sm font-medium text-red-600 dark:text-red-400 ring-1 ring-red-200 dark:ring-red-900 disabled:opacity-50"
        >
          {loading ? 'Signing out...' : 'Sign out'}
        </button>
      </div>

      <BottomNav />
    </main>
  )
}
