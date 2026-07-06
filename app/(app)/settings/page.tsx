'use client'

import { useEffect, useState } from 'react'
import { ref, update, onValue, push, set } from 'firebase/database'
import { signOut } from 'firebase/auth'
import { db, auth } from '@/lib/firebase/client'
import { useAuth } from '@/lib/firebase/auth-context'
import { useFamily } from '@/lib/firebase/use-family'
import { useRouter } from 'next/navigation'
import type { Invite, FamilyMember } from '@/lib/firebase/types'

export default function SettingsPage() {
  const { user } = useAuth()
  const { familyId, family, loading } = useFamily()
  const router = useRouter()
  const [members, setMembers] = useState<FamilyMember[]>([])
  const [invites, setInvites] = useState<Invite[]>([])
  const [childName, setChildName] = useState('')
  const [startDate, setStartDate] = useState('')
  const [inviteEmail, setInviteEmail] = useState('')
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState('')

  useEffect(() => {
    if (family) { setChildName(family.childName ?? ''); setStartDate(family.startDate) }
  }, [family])

  useEffect(() => {
    if (!familyId) return
    const unsubM = onValue(ref(db, `families/${familyId}/members`), snap => {
      const list: FamilyMember[] = []
      snap.forEach(child => { list.push(child.val()) })
      setMembers(list)
    })
    const unsubI = onValue(ref(db, `families/${familyId}/invites`), snap => {
      const list: Invite[] = []
      snap.forEach(child => { const v = child.val(); if (v.status === 'pending') list.push({ id: child.key!, ...v }); return false })
      setInvites(list)
    })
    return () => { unsubM(); unsubI() }
  }, [familyId])

  if (loading || !family || !familyId || !user) return <div style={{ textAlign: 'center', padding: 40, color: 'var(--text-light)' }}>טוען...</div>

  const isOwner = members.find(m => m.userId === user.uid)?.role === 'owner'

  async function saveFamily() {
    setSaving(true)
    await update(ref(db, `families/${familyId}`), { childName: childName || null, startDate })
    setSaving(false); setMsg('נשמר!'); setTimeout(() => setMsg(''), 2000)
  }

  async function sendInvite() {
    if (!inviteEmail.trim()) return
    const res = await fetch('/api/invite', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: inviteEmail, familyId }),
    })
    const data = await res.json()
    setMsg(data.error ? 'שגיאה בשליחת הזמנה' : 'הזמנה נשלחה!')
    if (!data.error) setInviteEmail('')
    setTimeout(() => setMsg(''), 3000)
  }

  async function revokeInvite(inviteId: string) {
    await update(ref(db, `families/${familyId}/invites/${inviteId}`), { status: 'revoked' })
  }

  async function handleSignOut() {
    await signOut(auth)
    await fetch('/api/auth/session', { method: 'DELETE' })
    router.push('/login')
  }

  return (
    <>
      <div style={{ background: 'linear-gradient(135deg,var(--sage),var(--sage-light))', color: '#fff', padding: '26px 20px 20px', textAlign: 'center', borderRadius: '0 0 20px 20px', margin: '-14px -14px 14px' }}>
        <h1 style={{ fontSize: 19, fontWeight: 800 }}>⚙️ הגדרות</h1>
      </div>

      <div style={card}>
        <h3 style={{ fontSize: 14, marginBottom: 12 }}>הגדרות המשפחה</h3>
        <div style={{ marginBottom: 10 }}>
          <label style={lbl}>שם הילדה</label>
          <input value={childName} onChange={e => setChildName(e.target.value)} placeholder="למשל: מיה" style={inp} disabled={!isOwner} />
        </div>
        <div style={{ marginBottom: 14 }}>
          <label style={lbl}>תאריך התחלת התכנית</label>
          <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} style={inp} disabled={!isOwner} />
        </div>
        {isOwner && <button onClick={saveFamily} disabled={saving} style={primaryBtn}>{saving ? 'שומר...' : 'שמירה'}</button>}
        {msg && <p style={{ fontSize: 12, color: 'var(--sage)', marginTop: 8 }}>{msg}</p>}
      </div>

      <div style={card}>
        <h3 style={{ fontSize: 14, marginBottom: 10 }}>חברי המשפחה</h3>
        {members.map(m => (
          <div key={m.userId} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12.5, padding: '6px 0', borderBottom: '1px solid var(--border)' }}>
            <span>{m.email}</span>
            <span style={{ color: 'var(--text-light)' }}>{m.role === 'owner' ? '👑 בעלים' : 'חבר/ה'}</span>
          </div>
        ))}
      </div>

      {isOwner && (
        <div style={card}>
          <h3 style={{ fontSize: 14, marginBottom: 10 }}>הזמנת בני משפחה</h3>
          <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
            <input value={inviteEmail} onChange={e => setInviteEmail(e.target.value)} placeholder="כתובת מייל" type="email" style={{ ...inp, flex: 1 }} />
            <button onClick={sendInvite} style={{ ...primaryBtn, flex: 'none', width: 'auto', padding: '9px 14px' }}>שלח</button>
          </div>
          {invites.map(inv => (
            <div key={inv.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 12, padding: '6px 0' }}>
              <span>{inv.email}</span>
              <button onClick={() => revokeInvite(inv.id)} style={{ background: 'none', border: 'none', fontSize: 11, color: 'var(--allergen)', cursor: 'pointer' }}>ביטול</button>
            </div>
          ))}
        </div>
      )}

      <button onClick={handleSignOut} style={{ width: '100%', border: '1px solid var(--border)', borderRadius: 10, padding: 10, fontSize: 13, background: 'var(--white)', color: 'var(--text-mid)', cursor: 'pointer', marginTop: 4 }}>
        התנתקות
      </button>
    </>
  )
}

const card: React.CSSProperties = { background: 'var(--white)', border: '1px solid var(--border)', borderRadius: 16, padding: '14px 16px', marginBottom: 12 }
const lbl: React.CSSProperties = { display: 'block', fontSize: 11.5, color: 'var(--text-mid)', marginBottom: 4 }
const inp: React.CSSProperties = { width: '100%', border: '1px solid var(--border)', borderRadius: 9, padding: '9px 10px', fontSize: 13, fontFamily: 'inherit' }
const primaryBtn: React.CSSProperties = { width: '100%', background: 'var(--sage)', color: '#fff', border: 'none', borderRadius: 10, padding: 10, fontSize: 13, fontWeight: 700, cursor: 'pointer' }
