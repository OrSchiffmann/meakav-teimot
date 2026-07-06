'use client'

import { signInWithPopup, signInWithRedirect } from 'firebase/auth'
import { auth, googleProvider } from '@/lib/firebase/client'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { useAuth } from '@/lib/firebase/auth-context'

export default function LoginPage() {
  const router = useRouter()
  const { user, loading } = useAuth()
  const [signingIn, setSigningIn] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!loading && user) router.push('/onboarding')
  }, [user, loading, router])

  async function signInWithGoogle() {
    setSigningIn(true)
    setError('')
    const isLocal = window.location.hostname === 'localhost'
    try {
      if (isLocal) {
        await signInWithPopup(auth, googleProvider)
      } else {
        await signInWithRedirect(auth, googleProvider)
      }
    } catch (err: unknown) {
      const code = (err as { code?: string }).code
      if (code !== 'auth/popup-closed-by-user') {
        setError('שגיאה בהתחברות, נסי שוב')
      }
      setSigningIn(false)
    }
  }

  const busy = loading || signingIn

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div style={{ maxWidth: 360, width: '100%' }}>
        <div style={{ background: 'linear-gradient(135deg,var(--sage),var(--sage-light))', borderRadius: 20, padding: '32px 24px', textAlign: 'center', color: '#fff', marginBottom: 24 }}>
          <div style={{ fontSize: 48, marginBottom: 8 }}>🥄</div>
          <h1 style={{ fontSize: 22, fontWeight: 800, marginBottom: 4 }}>מעקב טעימות</h1>
          <p style={{ fontSize: 13, opacity: 0.9 }}>תכנית טעימות משפחתית לתינוקת</p>
        </div>
        <div style={{ background: 'var(--white)', border: '1px solid var(--border)', borderRadius: 16, padding: 20 }}>
          <p style={{ fontSize: 13, color: 'var(--text-mid)', marginBottom: 16, textAlign: 'center' }}>
            התחברי עם חשבון Google לשמירה ושיתוף עם בני המשפחה
          </p>
          {error && <p style={{ color: 'var(--allergen)', fontSize: 12, marginBottom: 10, textAlign: 'center' }}>{error}</p>}
          <button
            onClick={signInWithGoogle}
            disabled={busy}
            style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, background: 'var(--sage)', color: '#fff', border: 'none', borderRadius: 10, padding: '12px 16px', fontSize: 14, fontWeight: 700, cursor: busy ? 'wait' : 'pointer', opacity: busy ? 0.7 : 1 }}
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M17.64 9.205c0-.639-.057-1.252-.164-1.841H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#fff" fillOpacity=".9"/>
              <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" fill="#fff" fillOpacity=".8"/>
              <path d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#fff" fillOpacity=".7"/>
              <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#fff" fillOpacity=".6"/>
            </svg>
            {busy ? 'מתחבר...' : 'המשך עם Google'}
          </button>
        </div>
      </div>
    </div>
  )
}
