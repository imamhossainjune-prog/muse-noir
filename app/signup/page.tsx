'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function SignupPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  async function handleSignup() {
    if (!email.trim() || !password.trim()) return
    if (password.length < 6) { setError('Password must be at least 6 characters'); return }
    setLoading(true)
    setError('')
    const { error } = await supabase.auth.signUp({ email, password })
    if (error) { setError(error.message); setLoading(false); return }
    router.push('/dashboard')
    router.refresh()
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6 relative overflow-hidden" style={{ background:'#0d0a1a' }}>

      <style>{`
        @keyframes fadeInUp { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
        .signup-form { animation: fadeInUp 0.5s ease forwards; }
      `}</style>

      {/* Decorative background */}
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

      <div className="absolute" style={{ width:'300px', height:'300px', borderRadius:'50%', background:'radial-gradient(circle, rgba(124,58,237,0.08) 0%, transparent 70%)', top:'50%', left:'50%', transform:'translate(-50%,-50%)', pointerEvents:'none' }} />

      <div className="signup-form w-full max-w-sm space-y-8 relative z-10">

        {/* Logo */}
        <div className="text-center space-y-4">
          <div className="relative mx-auto w-20 h-20">
            <div className="absolute inset-0 rounded-full" style={{ border:'1px solid #2d1f52' }} />
            <div className="absolute inset-2 rounded-full" style={{ border:'0.5px solid #1e1530' }} />
            <div className="w-20 h-20 rounded-full flex items-center justify-center text-3xl font-bold text-violet-300 relative" style={{ background:'#150f28', fontFamily:'Georgia,serif' }}>M</div>
          </div>
          <div>
            <h1 className="text-2xl font-semibold text-[#e2d9f3]" style={{ fontFamily:'Georgia,serif', letterSpacing:'2px' }}>MUSE NOIR</h1>
            <p className="text-xs text-[#4c3d6e] mt-1.5 italic tracking-wide">Create your account — it's free</p>
          </div>
        </div>

        {/* Divider */}
        <div className="flex items-center gap-3">
          <div className="flex-1 h-px" style={{ background:'#1e1530' }} />
          <span className="text-xs text-[#3c3170] tracking-widest">CREATE ACCOUNT</span>
          <div className="flex-1 h-px" style={{ background:'#1e1530' }} />
        </div>

        {/* Form */}
        <div className="space-y-3">
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="Email address"
            className="w-full rounded-2xl px-4 py-3.5 text-sm text-[#e2d9f3] placeholder-[#4c3d6e] focus:outline-none transition-all"
            style={{ background:'#150f28', border: email ? '1px solid #4c1d95' : '1px solid #1e1530' }}
          />
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSignup()}
            placeholder="Password (min 6 characters)"
            className="w-full rounded-2xl px-4 py-3.5 text-sm text-[#e2d9f3] placeholder-[#4c3d6e] focus:outline-none transition-all"
            style={{ background:'#150f28', border: password ? '1px solid #4c1d95' : '1px solid #1e1530' }}
          />

          {error && (
            <div className="rounded-xl px-4 py-3" style={{ background:'#2a0f0f', border:'1px solid #3d1515' }}>
              <p className="text-sm text-red-400">{error}</p>
            </div>
          )}

          <button
            onClick={handleSignup}
            disabled={loading || !email.trim() || !password.trim()}
            className="w-full rounded-2xl py-3.5 text-sm font-medium text-white transition-all disabled:opacity-40"
            style={{ background: loading ? '#3b1d8c' : '#4c1d95' }}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Creating account...
              </span>
            ) : 'Create account'}
          </button>
        </div>

        <div className="space-y-3 text-center">
          <p className="text-sm text-[#6b5f8a]">
            Already have an account?{' '}
            <Link href="/login" className="text-violet-400 hover:text-violet-300 transition-colors">Sign in</Link>
          </p>
          <p className="text-xs text-[#2d1f52] italic">Your notes. Your AI. Your privacy.</p>
        </div>

      </div>
    </main>
  )
}
