'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { ref, get, set, push } from 'firebase/database'
import { db } from '@/lib/firebase/client'
import { useAuth } from '@/lib/firebase/auth-context'
import { isoOf, todayMidnight } from '@/lib/plan-data'

export default function OnboardingPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const invitedFamilyId = searchParams.get('family')

  const [childName, setChildName] = useState('')
  const [startDate, setStartDate] = useState(isoOf(todayMidnight()))
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!user) return
    get(ref(db, `users/${user.uid}/familyId`)).then(snap => {
      if (snap.val()) router.push('/')
    })
  }, [user, router])

  if (loading || !user) return null

  async function joinFamily() {
    if (!invitedFamilyId || !user) return
    setSaving(true)
    try {
      await set(ref(db, `families/${invitedFamilyId}/members/${user.uid}`), {
        userId: user.uid, familyId: invitedFamilyId, role: 'member',
        email: user.email, createdAt: new Date().toISOString(),
      })
      await set(ref(db, `users/${user.uid}/familyId`), invitedFamilyId)
      router.push('/')
    } catch { setError('שגיאה בהצטרפות'); setSaving(false) }
  }

  async function createFamily() {
    if (!user) return
    setSaving(true)
    try {
      const familyRef = push(ref(db, 'families'))
      const familyId = familyRef.key!
      await set(familyRef, {
        name: 'המשפחה שלנו', childName: childName || null,
        startDate, createdAt: new Date().toISOString(),
      })
      await set(ref(db, `families/${familyId}/members/${user.uid}`), {
        userId: user.uid, familyId, role: 'owner',
        email: user.email, createdAt: new Date().toISOString(),
      })
      await set(ref(db, `users/${user.uid}/familyId`), familyId)
      router.push('/')
    } catch { setError('שגיאה ביצירת משפחה'); setSaving(false) }
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div style={{ maxWidth: 400, width: '100%' }}>
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <div style={{ fontSize: 40, marginBottom: 8 }}>🥄</div>
          <h1 style={{ fontSize: 20, fontWeight: 800 }}>ברוכים הבאים!</h1>
          <p style={{ fontSize: 13, color: 'var(--text-mid)', marginTop: 4 }}>{invitedFamilyId ? 'הוזמנתם להצטרף למשפחה' : 'הגדרת המשפחה שלכם'}</p>
        </div>
        <div style={{ background: 'var(--white)', border: '1px solid var(--border)', borderRadius: 16, padding: 20 }}>
          {invitedFamilyId ? (
            <>
              <p style={{ fontSize: 13, color: 'var(--text-mid)', marginBottom: 16, textAlign: 'center' }}>קיבלתם הזמנה להצטרף לתכנית הטעימות המשפחתית.</p>
              {error && <p style={{ color: 'var(--allergen)', fontSize: 12, marginBottom: 10 }}>{error}</p>}
              <button onClick={joinFamily} disabled={saving} style={btnStyle}>{saving ? 'מצטרף...' : 'הצטרפות למשפחה'}</button>
            </>
          ) : (
            <>
              <div style={{ marginBottom: 14 }}>
                <label style={lbl}>שם הילדה (אופציונלי)</label>
                <input value={childName} onChange={e => setChildName(e.target.value)} placeholder="למשל: מיה" style={inp} />
              </div>
              <div style={{ marginBottom: 14 }}>
                <label style={lbl}>תאריך התחלת התכנית</label>
                <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} style={inp} />
                <p style={{ fontSize: 11, color: 'var(--text-light)', marginTop: 4 }}>כל התאריכים יחושבו ממועד זה</p>
              </div>
              {error && <p style={{ color: 'var(--allergen)', fontSize: 12, marginBottom: 10 }}>{error}</p>}
              <button onClick={createFamily} disabled={saving} style={btnStyle}>{saving ? 'יוצר...' : 'יצירת המשפחה שלי'}</button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

const btnStyle: React.CSSProperties = { width: '100%', background: 'var(--sage)', color: '#fff', border: 'none', borderRadius: 10, padding: '12px 16px', fontSize: 14, fontWeight: 700, cursor: 'pointer' }
const lbl: React.CSSProperties = { display: 'block', fontSize: 12, color: 'var(--text-mid)', marginBottom: 4 }
const inp: React.CSSProperties = { width: '100%', border: '1px solid var(--border)', borderRadius: 9, padding: '9px 10px', fontSize: 13, fontFamily: 'inherit' }
