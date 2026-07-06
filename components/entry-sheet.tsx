'use client'

import { useState, useEffect } from 'react'
import { ref, push, set, update, remove } from 'firebase/database'
import { db } from '@/lib/firebase/client'
import type { LogEntry } from '@/lib/firebase/types'

interface Props {
  open: boolean
  onClose: () => void
  familyId: string
  userId: string
  dateISO: string
  entry: LogEntry | null
}

function encodeFood(food: string) { return food.replace(/[.#$[\]]/g, '_') }

export default function EntrySheet({ open, onClose, familyId, userId, dateISO, entry }: Props) {
  const [food, setFood] = useState('')
  const [amount, setAmount] = useState('')
  const [time, setTime] = useState('')
  const [note, setNote] = useState('')
  const [isAllergen, setIsAllergen] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (entry) { setFood(entry.food); setAmount(entry.amount ?? ''); setTime(entry.time ?? ''); setNote(entry.note ?? ''); setIsAllergen(entry.isAllergen) }
    else { setFood(''); setAmount(''); setTime(new Date().toTimeString().slice(0, 5)); setNote(''); setIsAllergen(false) }
  }, [entry, open])

  if (!open) return null

  async function save() {
    if (!food.trim()) return
    setLoading(true)
    if (entry) {
      await update(ref(db, `families/${familyId}/logEntries/${entry.id}`), { food, amount, time, note, isAllergen })
    } else {
      const newRef = push(ref(db, `families/${familyId}/logEntries`))
      await set(newRef, { familyId, date: dateISO, food, amount, time, note, isAllergen, source: 'custom', createdBy: userId, createdAt: new Date().toISOString() })
      await set(ref(db, `families/${familyId}/uniqueFoods/${encodeFood(food)}`), { food, firstTriedAt: new Date().toISOString() })
    }
    setLoading(false)
    onClose()
  }

  async function remove_() {
    if (!entry) return
    setLoading(true)
    await remove(ref(db, `families/${familyId}/logEntries/${entry.id}`))
    setLoading(false)
    onClose()
  }

  return (
    <div onClick={e => { if (e.target === e.currentTarget) onClose() }} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.35)', display: 'flex', alignItems: 'flex-end', zIndex: 100 }}>
      <div style={{ background: '#fff', width: '100%', maxHeight: '88vh', overflowY: 'auto', borderRadius: '20px 20px 0 0', padding: '16px 18px 24px', position: 'relative' }}>
        <button onClick={onClose} style={{ position: 'absolute', left: 16, top: 14, background: 'none', border: 'none', fontSize: 18, color: 'var(--text-light)', cursor: 'pointer' }}>✕</button>
        <div style={{ width: 36, height: 4, background: 'var(--border)', borderRadius: 3, margin: '0 auto 12px' }} />
        <h2 style={{ fontSize: 15, marginBottom: 4 }}>{entry ? 'עריכת ארוחה' : 'הוספת ארוחה'}</h2>
        <p style={{ fontSize: 11.5, color: 'var(--text-light)', marginBottom: 12 }}>{dateISO}</p>

        {[{ label: 'מה אכלה בפועל', value: food, setter: setFood, placeholder: 'למשל: בטטה ואבוקדו' },
          { label: 'כמות', value: amount, setter: setAmount, placeholder: 'למשל: 2 כפות' }].map(f => (
          <div key={f.label} style={{ marginBottom: 10 }}>
            <label style={lbl}>{f.label}</label>
            <input value={f.value} onChange={e => f.setter(e.target.value)} placeholder={f.placeholder} style={inp} />
          </div>
        ))}
        <div style={{ marginBottom: 10 }}>
          <label style={lbl}>שעה</label>
          <input type="time" value={time} onChange={e => setTime(e.target.value)} style={inp} />
        </div>
        <div style={{ marginBottom: 10 }}>
          <label style={lbl}>הערות / תגובה</label>
          <textarea value={note} onChange={e => setNote(e.target.value)} placeholder="תגובה, מרקם, אהבה/לא אהבה..." style={{ ...inp, resize: 'vertical', minHeight: 50 }} />
        </div>
        <div style={{ marginBottom: 14 }}>
          <label style={{ ...lbl, display: 'flex', alignItems: 'center', gap: 6 }}>
            <input type="checkbox" checked={isAllergen} onChange={e => setIsAllergen(e.target.checked)} style={{ width: 'auto' }} />
            זו הגשת אלרגן
          </label>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          {entry && <button onClick={remove_} disabled={loading} style={{ flex: 1, border: 'none', borderRadius: 10, padding: 10, fontSize: 12.5, fontWeight: 700, cursor: 'pointer', background: 'var(--sage-pale)', color: 'var(--allergen)' }}>מחיקה</button>}
          <button onClick={save} disabled={loading} style={{ flex: 1, border: 'none', borderRadius: 10, padding: 10, fontSize: 12.5, fontWeight: 700, cursor: 'pointer', background: 'var(--sage)', color: '#fff' }}>
            {loading ? 'שומר...' : 'שמירה'}
          </button>
        </div>
      </div>
    </div>
  )
}

const lbl: React.CSSProperties = { display: 'block', fontSize: 11.5, color: 'var(--text-mid)', marginBottom: 4 }
const inp: React.CSSProperties = { width: '100%', border: '1px solid var(--border)', borderRadius: 9, padding: '9px 10px', fontSize: 13, fontFamily: 'inherit' }
