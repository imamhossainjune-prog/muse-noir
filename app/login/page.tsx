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
        style={{ background: '#0d0a1a', transition: 'opacity 0.6s ease', opacity: splashFading ? 0 : 1 }}
      >
        <style>{`
          @keyframes fadeUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
          @keyframes pulseGlow { 0%,100%{box-shadow:0 0 0 0 rgba(124,58,237,0)} 50%{box-shadow:0 0 40px 8px rgba(124,58,237,0.3)} }
          @keyframes fadeIn { from{opacity:0} to{opacity:1} }
          .splash-m { animation: fadeUp 0.7s ease forwards, pulseGlow 2s ease-in-out infinite; }
          .splash-name { animation: fadeUp 0.7s ease 0.3s forwards; opacity:0; }
          .splash-tagline { animation: fadeUp 0.7s ease 0.6s forwards; opacity:0; }
          .splash-dots { animation: fadeIn 0.5s ease 1.2s forwards; opacity:0; }
        `}</style>
        <div className="flex flex-col items-center gap-6 text-center">
          <div className="splash-m w-24 h-24 rounded-full flex items-center justify-center text-5xl font-bold text-violet-400" style={{ background:'#150f28', border:'1.5px solid #2d1f52', fontFamily:'Georgia,serif' }}>M</div>
          <div className="space-y-2">
            <h1 className="splash-name text-3xl font-bold text-[#e2d9f3]" style={{ fontFamily:'Georgia,serif', letterSpacing:'3px' }}>MUSE NOIR</h1>
            <p className="splash-tagline text-sm text-[#6b5f8a] italic">haunts your exams so you don't have to</p>
          </div>
          <div className="splash-dots flex gap-2 mt-4">
            {[0,1,2].map(i => <div key={i} className="w-1.5 h-1.5 rounded-full bg-violet-700" style={{ animation:`pulseGlow 1s ease-in-out ${i*0.2}s infinite` }} />)}
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6 relative overflow-hidden" style={{ background:'#0d0a1a' }}>

      <style>{`
        @keyframes fadeInUp { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
        .login-form { animation: fadeInUp 0.5s ease forwards; }
        @keyframes floatLine { 0%,100%{opacity:0.03} 50%{opacity:0.07} }
      `}</style>

      {/* Decorative background lines */}
      <svg className="absolute inset-0 w-full h-full" style={{ opacity:0.04 }} viewBox="0 0 400 800" preserveAspectRatio="xMidYMid slice">
        <line x1="0" y1="200" x2="400" y2="200" stroke="#a78bfa" strokeWidth="0.5"/>
        <line x1="0" y1="400" x2="400" y2="400" stroke="#a78bfa" strokeWidth="0.5"/>
        <line x1="0" y1="600" x2="400" y2="600" stroke="#a78bfa" strokeWidth="0.5"/>
        <line x1="100" y1="0" x2="100" y2="800" stroke="#a78bfa" strokeWidth="0.5"/>
        <line x1="200" y1="0" x2="200" y2="800" stroke="#a78bfa" strokeWidth="0.5"/>
        <line x1="300" y1="0" x2="300" y2="800" stroke="#a78bfa" strokeWidth="0.5"/>
        <circle cx="200" cy="400" r="160" fill="none" stroke="#7c3aed" strokeWidth="0.5"/>
        <circle cx="200" cy="400" r="240" fill="none" stroke="#7c3aed" strokeWidth="0.3"/>
      </svg>

      {/* Soft violet glow in background */}
      <div className="absolute" style={{ width:'300px', height:'300px', borderRadius:'50%', background:'radial-gradient(circle, rgba(124,58,237,0.08) 0%, transparent 70%)', top:'50%', left:'50%', transform:'translate(-50%,-50%)', pointerEvents:'none' }} />

      <div className="login-form w-full max-w-sm space-y-8 relative z-10">

        {/* Logo area */}
        <div className="text-center space-y-4">
          <div className="relative mx-auto w-20 h-20">
            {/* Outer ring */}
            <div className="absolute inset-0 rounded-full" style={{ border:'1px solid #2d1f52' }} />
            {/* Inner ring */}
            <div className="absolute inset-2 rounded-full" style={{ border:'0.5px solid #1e1530' }} />
            {/* M */}
            <div className="w-20 h-20 rounded-full flex items-center justify-center text-3xl font-bold text-violet-300 relative" style={{ background:'#150f28', fontFamily:'Georgia,serif' }}>
              M
            </div>
          </div>

          <div>
            <h1 className="text-2xl font-semibold text-[#e2d9f3]" style={{ fontFamily:'Georgia,serif', letterSpacing:'2px' }}>
              MUSE NOIR
            </h1>
            <p className="text-xs text-[#4c3d6e] mt-1.5 italic tracking-wide">
              haunts your exams so you don't have to
            </p>
          </div>
        </div>

        {/* Divider */}
        <div className="flex items-center gap-3">
          <div className="flex-1 h-px" style={{ background:'#1e1530' }} />
          <span className="text-xs text-[#3c3170] tracking-widest">SIGN IN</span>
          <div className="flex-1 h-px" style={{ background:'#1e1530' }} />
        </div>

        {/* Form */}
        <div className="space-y-3">
          <div className="relative">
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="Email address"
              className="w-full rounded-2xl px-4 py-3.5 text-sm text-[#e2d9f3] placeholder-[#4c3d6e] focus:outline-none transition-all"
              style={{ background:'#150f28', border: email ? '1px solid #4c1d95' : '1px solid #1e1530' }}
            />
          </div>

          <div className="relative">
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleLogin()}
              placeholder="Password"
              className="w-full rounded-2xl px-4 py-3.5 text-sm text-[#e2d9f3] placeholder-[#4c3d6e] focus:outline-none transition-all"
              style={{ background:'#150f28', border: password ? '1px solid #4c1d95' : '1px solid #1e1530' }}
            />
          </div>

          {error && (
            <div className="rounded-xl px-4 py-3" style={{ background:'#2a0f0f', border:'1px solid #3d1515' }}>
              <p className="text-sm text-red-400">{error}</p>
            </div>
          )}

          <button
            onClick={handleLogin}
            disabled={loading || !email.trim() || !password.trim()}
            className="w-full rounded-2xl py-3.5 text-sm font-medium text-white transition-all disabled:opacity-40"
            style={{ background: loading ? '#3b1d8c' : '#4c1d95' }}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Signing in...
              </span>
            ) : 'Sign in'}
          </button>
        </div>

        {/* Footer */}
        <div className="space-y-3 text-center">
          <p className="text-sm text-[#6b5f8a]">
            Don't have an account?{' '}
            <Link href="/signup" className="text-violet-400 hover:text-violet-300 transition-colors">
              Sign up
            </Link>
          </p>
          <p className="text-xs text-[#2d1f52] italic">Your notes. Your AI. Your privacy.</p>
        </div>

      </div>
    </main>
  )
}