'use client'

import { useEffect, useState } from 'react'
import { ref, onValue, push, set, remove } from 'firebase/database'
import { db } from '@/lib/firebase/client'
import { useAuth } from '@/lib/firebase/auth-context'
import { useFamily } from '@/lib/firebase/use-family'
import { PLAN_DAYS, BASE_FOODS, TOTAL_FOODS, FOOD_TIPS, isoOf, planIndexForDate, todayMidnight } from '@/lib/plan-data'
import type { LogEntry } from '@/lib/firebase/types'
import EntrySheet from '@/components/entry-sheet'
import { useRouter } from 'next/navigation'

export default function TodayPage() {
  const { user, loading: authLoading } = useAuth()
  const { familyId, family, loading: familyLoading } = useFamily()
  const router = useRouter()
  const [entries, setEntries] = useState<LogEntry[]>([])
  const [uniqueFoodCount, setUniqueFoodCount] = useState(0)
  const [sheetOpen, setSheetOpen] = useState(false)
  const [editEntry, setEditEntry] = useState<LogEntry | null>(null)

  const today = todayMidnight()
  const dateISO = isoOf(today)

  useEffect(() => {
    if (!authLoading && !user) router.push('/login')
    if (!familyLoading && familyId === null) router.push('/onboarding')
  }, [user, authLoading, familyId, familyLoading, router])

  useEffect(() => {
    if (!familyId) return
    return onValue(ref(db, `families/${familyId}/logEntries`), snap => {
      const all: LogEntry[] = []
      snap.forEach(child => {
        const e = child.val() as LogEntry
        if (e.date === dateISO) all.push({ ...e, id: child.key! })
      })
      all.sort((a, b) => a.createdAt.localeCompare(b.createdAt))
      setEntries(all)
    })
  }, [familyId, dateISO])

  useEffect(() => {
    if (!familyId) return
    return onValue(ref(db, `families/${familyId}/uniqueFoods`), snap => {
      setUniqueFoodCount(snap.size)
    })
  }, [familyId])

  if (authLoading || familyLoading || !family || !familyId || !user) {
    return <div style={{ textAlign: 'center', padding: 40, color: 'var(--text-light)' }}>טוען...</div>
  }

  const startDate = new Date(family.startDate + 'T00:00:00')
  const planIndex = planIndexForDate(startDate, today)
  const planDay = planIndex >= 0 && planIndex <= 55 ? PLAN_DAYS[planIndex] : null
  const plannedFood = planDay ? (planDay.type === 'allergen' ? planDay.week.allergen.food : planDay.food) : null
  const foodCount = BASE_FOODS + uniqueFoodCount
  const pct = Math.min(100, Math.round((foodCount / TOTAL_FOODS) * 100))

  async function quickAddPlanned() {
    if (!planDay || !familyId || !user) return
    const isAllergen = planDay.type === 'allergen'
    const food = isAllergen ? planDay.week.allergen.food : planDay.food!
    const newRef = push(ref(db, `families/${familyId}/logEntries`))
    await set(newRef, { familyId, date: dateISO, food, amount: planDay.week.qty, time: new Date().toTimeString().slice(0, 5), note: '', isAllergen, source: 'plan', createdBy: user.uid, createdAt: new Date().toISOString() })
    await set(ref(db, `families/${familyId}/uniqueFoods/${encodeFood(food)}`), { food, firstTriedAt: new Date().toISOString() })
  }

  async function deleteEntry(id: string) {
    await remove(ref(db, `families/${familyId}/logEntries/${id}`))
  }

  return (
    <>
      <div style={{ background: 'linear-gradient(135deg,var(--sage),var(--sage-light))', color: '#fff', padding: '26px 20px 20px', textAlign: 'center', borderRadius: '0 0 20px 20px', margin: '-14px -14px 14px' }}>
        <h1 style={{ fontSize: 19, fontWeight: 800 }}>🥄 {family.childName ? `טעימות של ${family.childName}` : 'מעקב טעימות'}</h1>
        <p style={{ fontSize: 12, opacity: 0.9, marginTop: 3 }}>היום · {dateISO}</p>
      </div>

      <div style={card}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'var(--text-mid)' }}>
          <span>התקדמות במזונות</span><span>{foodCount} מתוך {TOTAL_FOODS}</span>
        </div>
        <div style={{ height: 6, background: 'var(--border)', borderRadius: 4, marginTop: 6, overflow: 'hidden' }}>
          <div style={{ height: '100%', background: 'var(--sage)', borderRadius: 4, width: `${pct}%`, transition: 'width .3s' }} />
        </div>
      </div>

      {planIndex < 0 && <div style={card}><p style={emptyNote}>התכנית תתחיל בעוד {-planIndex} ימים 🌱</p></div>}
      {planIndex > 55 && <div style={card}><p style={emptyNote}>סיימתם את 8 השבועות! 🎉</p></div>}
      {planDay && (
        <div style={card}>
          {planDay.type === 'allergen' ? (
            <>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                <span style={{ fontSize: 30 }}>{planDay.week.allergen.emoji}</span>
                <div><b style={{ display: 'block', fontSize: 14 }}>יום אלרגן: {planDay.week.allergen.name}</b><span style={{ fontSize: 11.5, color: 'var(--text-light)' }}>שבוע {planDay.week.n} · {planDay.dayLabel}{planDay.note ? ` · ${planDay.note}` : ''}</span></div>
              </div>
              <div style={{ background: 'var(--allergen-pale)', border: '1px solid var(--allergen-border)', borderRadius: 10, padding: '8px 11px', fontSize: 12, color: 'var(--allergen)', fontWeight: 700, marginBottom: 8 }}>🚨 {planDay.week.allergen.food}</div>
              <div style={{ background: '#FFF9F0', border: '1px solid #F0E2C8', borderRadius: 10, padding: '8px 11px', fontSize: 11.5, color: 'var(--text-mid)', lineHeight: 1.6, marginBottom: 10 }}>
                <b style={{ color: 'var(--text-dark)' }}>👨‍🍳 איך מכינים:</b> {planDay.week.allergen.recipe}
              </div>
            </>
          ) : (
            <>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                <span style={{ fontSize: 30 }}>{planDay.emoji}</span>
                <div><b style={{ display: 'block', fontSize: 14 }}>{planDay.food}</b><span style={{ fontSize: 11.5, color: 'var(--text-light)' }}>שבוע {planDay.week.n} · {planDay.type === 'new' ? 'מזון חדש' : 'חזרה'}{planDay.note ? ` · ${planDay.note}` : ''}</span></div>
              </div>
              {planDay.food && FOOD_TIPS[planDay.food] && (
                <div style={{ background: '#FFF9F0', border: '1px solid #F0E2C8', borderRadius: 10, padding: '8px 11px', fontSize: 11.5, color: 'var(--text-mid)', lineHeight: 1.6, marginBottom: 10 }}>
                  <b style={{ color: 'var(--text-dark)' }}>👨‍🍳 איך מכינים:</b> {FOOD_TIPS[planDay.food]}
                </div>
              )}
            </>
          )}
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {[planDay.week.meals, planDay.week.qty, planDay.week.texture].map(p => (
              <span key={p} style={{ background: '#F3F0E8', borderRadius: 8, padding: '5px 9px', fontSize: 10.5, color: 'var(--text-mid)' }}>{p}</span>
            ))}
          </div>
        </div>
      )}

      <div style={card}>
        <h3 style={{ fontSize: 14, marginBottom: 6 }}>מה אכלה היום בפועל</h3>
        {entries.length === 0 && <p style={emptyNote}>עדיין לא תועדה ארוחה היום</p>}
        {entries.map(e => {
          const isDiff = plannedFood && e.food !== plannedFood
          return (
            <div key={e.id} style={{ border: `1px solid ${isDiff ? 'var(--orange)' : 'var(--border)'}`, background: isDiff ? '#FFF8F0' : undefined, borderRadius: 12, padding: '9px 12px', marginBottom: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <b style={{ display: 'block', fontSize: 13 }}>🍽️ {e.food}</b>
                <span style={{ color: 'var(--text-light)', fontSize: 11 }}>{[e.time, e.amount, e.note].filter(Boolean).join(' · ')}</span>
              </div>
              <div style={{ display: 'flex', gap: 6 }}>
                <button onClick={() => { setEditEntry(e); setSheetOpen(true) }} style={iconBtn}>✏️</button>
                <button onClick={() => deleteEntry(e.id)} style={iconBtn}>🗑️</button>
              </div>
            </div>
          )
        })}
        <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
          {plannedFood && <button onClick={quickAddPlanned} style={{ flex: 1, border: 'none', borderRadius: 10, padding: 10, fontSize: 12.5, fontWeight: 700, cursor: 'pointer', background: 'var(--sage-pale)', color: 'var(--sage)' }}>✓ ניתן כמתוכנן</button>}
          <button onClick={() => { setEditEntry(null); setSheetOpen(true) }} style={{ flex: 1, border: 'none', borderRadius: 10, padding: 10, fontSize: 12.5, fontWeight: 700, cursor: 'pointer', background: 'var(--sage)', color: '#fff' }}>+ הוסף ארוחה</button>
        </div>
      </div>

      <EntrySheet open={sheetOpen} onClose={() => { setSheetOpen(false); setEditEntry(null) }} familyId={familyId} userId={user.uid} dateISO={dateISO} entry={editEntry} />
    </>
  )
}

function encodeFood(food: string) { return food.replace(/[.#$[\]]/g, '_') }
const card: React.CSSProperties = { background: 'var(--white)', border: '1px solid var(--border)', borderRadius: 16, padding: '14px 16px', marginBottom: 12 }
const emptyNote: React.CSSProperties = { fontSize: 12, color: 'var(--text-light)', textAlign: 'center', padding: '10px 0' }
const iconBtn: React.CSSProperties = { background: 'none', border: 'none', fontSize: 15, cursor: 'pointer', color: 'var(--text-light)', padding: '2px 4px' }
