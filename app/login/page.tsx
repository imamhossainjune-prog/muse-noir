'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function LoginPage() {
  const [showSplash, setShowSplash] = useState(true)
  const [splashFading, setSplashFading] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const fadeTimer = setTimeout(() => setSplashFading(true), 2200)
    const hideTimer = setTimeout(() => setShowSplash(false), 2800)
    return () => { clearTimeout(fadeTimer); clearTimeout(hideTimer) }
  }, [])

  async function handleLogin() {
    if (!email.trim() || !password.trim()) return
    setLoading(true)
    setError('')
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) { setError(error.message); setLoading(false); return }
    router.push('/dashboard')
    router.refresh()
  }

  if (showSplash) {
    return (
      <main
        className="min-h-screen flex flex-col items-center justify-center px-6"
        style={{
          background: '#0d0a1a',
          transition: 'opacity 0.6s ease',
          opacity: splashFading ? 0 : 1,
        }}
      >
        <style>{`
          @keyframes fadeUp {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
          @keyframes pulseGlow {
            0%, 100% { box-shadow: 0 0 0 0 rgba(124, 58, 237, 0); }
            50% { box-shadow: 0 0 40px 8px rgba(124, 58, 237, 0.3); }
          }
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          .splash-m {
            animation: fadeUp 0.7s ease forwards, pulseGlow 2s ease-in-out infinite;
          }
          .splash-name {
            animation: fadeUp 0.7s ease 0.3s forwards;
            opacity: 0;
          }
          .splash-tagline {
            animation: fadeUp 0.7s ease 0.6s forwards;
            opacity: 0;
          }
          .splash-dots {
            animation: fadeIn 0.5s ease 1.2s forwards;
            opacity: 0;
          }
        `}</style>

        <div className="flex flex-col items-center gap-6 text-center">

          <div
            className="splash-m w-24 h-24 rounded-full flex items-center justify-center text-5xl font-bold text-violet-400"
            style={{
              background: '#150f28',
              border: '1.5px solid #2d1f52',
              fontFamily: 'Georgia, serif',
            }}
          >
            M
          </div>

          <div className="space-y-2">
            <h1
              className="splash-name text-3xl font-bold text-[#e2d9f3]"
              style={{ fontFamily: 'Georgia, serif', letterSpacing: '3px' }}
            >
              MUSE NOIR
            </h1>
            <p className="splash-tagline text-sm text-[#6b5f8a] italic">
              haunts your exams so you don't have to
            </p>
          </div>

          <div className="splash-dots flex gap-2 mt-4">
            {[0, 1, 2].map(i => (
              <div
                key={i}
                className="w-1.5 h-1.5 rounded-full bg-violet-700"
                style={{
                  animation: `pulseGlow 1s ease-in-out ${i * 0.2}s infinite`,
                }}
              />
            ))}
          </div>

        </div>
      </main>
    )
  }

  return (
    <main
      className="min-h-screen flex flex-col items-center justify-center px-6"
      style={{
        background: '#0d0a1a',
        animation: 'fadeIn 0.5s ease forwards',
      }}
    >
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <div className="w-full max-w-sm space-y-8">

        <div className="text-center space-y-3">
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold text-violet-400 mx-auto"
            style={{
              background: '#150f28',
              border: '1.5px solid #2d1f52',
              fontFamily: 'Georgia, serif',
            }}
          >
            M
          </div>
          <h1
            className="text-2xl font-semibold text-[#e2d9f3]"
            style={{ fontFamily: 'Georgia, serif' }}
          >
            Muse Noir
          </h1>
          <p className="text-sm text-[#6b5f8a] italic">
            haunts your exams so you don't have to
          </p>
        </div>

        <div className="space-y-3">
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="Email address"
            className="w-full rounded-2xl px-4 py-3 text-sm text-[#e2d9f3] placeholder-[#4c3d6e] focus:outline-none focus:border-violet-600"
            style={{ background: '#150f28', border: '1px solid #2d1f52' }}
          />
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleLogin()}
            placeholder="Password"
            className="w-full rounded-2xl px-4 py-3 text-sm text-[#e2d9f3] placeholder-[#4c3d6e] focus:outline-none focus:border-violet-600"
            style={{ background: '#150f28', border: '1px solid #2d1f52' }}
          />

          {error && (
            <p className="text-sm text-red-400 text-center">{error}</p>
          )}

          <button
            onClick={handleLogin}
            disabled={loading || !email.trim() || !password.trim()}
            className="w-full rounded-2xl py-3 text-sm font-medium text-white disabled:opacity-40 transition-opacity"
            style={{ background: '#4c1d95' }}
          >
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </div>

        <p className="text-center text-sm text-[#6b5f8a]">
          Don't have an account?{' '}
          <Link href="/signup" className="text-violet-400 hover:text-violet-300">
            Sign up
          </Link>
        </p>

      </div>
    </main>
  )
}