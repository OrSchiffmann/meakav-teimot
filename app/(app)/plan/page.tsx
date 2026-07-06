'use client'

import { useState, useEffect } from 'react'
import { ref, onValue } from 'firebase/database'
import { db } from '@/lib/firebase/client'
import { useAuth } from '@/lib/firebase/auth-context'
import { useFamily } from '@/lib/firebase/use-family'
import { WEEKS, PLAN_DAYS, FOOD_TIPS, isoOf, dateForPlanIndex } from '@/lib/plan-data'
import EntrySheet from '@/components/entry-sheet'
import { useRouter } from 'next/navigation'

export default function PlanPage() {
  const { user } = useAuth()
  const { familyId, family, loading } = useFamily()
  const router = useRouter()
  const [openWeeks, setOpenWeeks] = useState<number[]>([])
  const [openRecipe, setOpenRecipe] = useState<number | null>(null)
  const [loggedDates, setLoggedDates] = useState<Set<string>>(new Set())
  const [sheetDate, setSheetDate] = useState<string | null>(null)

  useEffect(() => {
    if (!loading && !familyId) router.push('/onboarding')
  }, [familyId, loading, router])

  useEffect(() => {
    if (!familyId) return
    return onValue(ref(db, `families/${familyId}/logEntries`), snap => {
      const dates = new Set<string>()
      snap.forEach(child => { dates.add(child.val().date) })
      setLoggedDates(dates)
    })
  }, [familyId])

  if (loading || !family || !familyId || !user) return <div style={{ textAlign: 'center', padding: 40, color: 'var(--text-light)' }}>טוען...</div>

  const startDate = new Date(family.startDate + 'T00:00:00')

  return (
    <>
      <div style={{ background: 'linear-gradient(135deg,var(--sage),var(--sage-light))', color: '#fff', padding: '26px 20px 20px', textAlign: 'center', borderRadius: '0 0 20px 20px', margin: '-14px -14px 14px' }}>
        <h1 style={{ fontSize: 19, fontWeight: 800 }}>📋 תכנית 8 השבועות</h1>
        <p style={{ fontSize: 12, opacity: 0.9, marginTop: 3 }}>לחצו על יום לפתיחת תיעוד</p>
      </div>
      <div style={{ background: '#FFF7E8', border: '1px solid #F0DDB0', borderRadius: 12, padding: '10px 13px', fontSize: 11.5, color: '#7A5F1E', marginBottom: 14 }}>
        💡 לחיצה על כל יום בתכנית פותחת תיעוד עבור התאריך המתאים לו בפועל.
      </div>

      {WEEKS.map(w => {
        const weekDays = PLAN_DAYS.filter(pd => pd.week.n === w.n).map(pd => ({
          ...pd, dateISO: isoOf(dateForPlanIndex(startDate, pd.globalIndex)),
        }))
        const isOpen = openWeeks.includes(w.n)
        return (
          <div key={w.n} style={{ background: 'var(--white)', border: '1px solid var(--border)', borderRadius: 16, marginBottom: 10, overflow: 'hidden' }}>
            <div onClick={() => setOpenWeeks(prev => prev.includes(w.n) ? prev.filter(x => x !== w.n) : [...prev, w.n])} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 14px', cursor: 'pointer' }}>
              <div style={{ width: 30, height: 30, borderRadius: 9, background: 'var(--sage)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 13, flexShrink: 0 }}>{w.n}</div>
              <div style={{ flex: 1 }}>
                <h3 style={{ fontSize: 13.5, fontWeight: 700 }}>שבוע {w.n} - {w.title}</h3>
                <p style={{ fontSize: 11, color: 'var(--text-light)', marginTop: 1 }}>אלרגן: {w.allergen.name} {w.allergen.emoji}</p>
              </div>
              <span style={{ fontSize: 15, color: 'var(--text-light)', display: 'inline-block', transform: isOpen ? 'rotate(180deg)' : undefined, transition: 'transform .2s' }}>⌄</span>
            </div>
            {isOpen && (
              <div style={{ padding: '0 14px 14px' }}>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 10 }}>
                  {[w.meals, w.qty, w.texture].map(p => <span key={p} style={{ background: '#F3F0E8', borderRadius: 8, padding: '5px 9px', fontSize: 10.5, color: 'var(--text-mid)' }}>{p}</span>)}
                </div>
                {/* אלרגן השבוע */}
                <div style={{ background: 'var(--allergen-pale)', border: '1px solid var(--allergen-border)', borderRadius: 12, padding: '10px 12px', marginBottom: 10 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--allergen)' }}>⚠️ אלרגן השבוע: {w.allergen.emoji} {w.allergen.name}</span>
                      <p style={{ fontSize: 11, color: 'var(--text-mid)', marginTop: 2 }}>{w.allergen.food}</p>
                    </div>
                    <button onClick={() => setOpenRecipe(openRecipe === w.n ? null : w.n)} style={{ background: 'var(--allergen)', color: '#fff', border: 'none', borderRadius: 8, padding: '5px 9px', fontSize: 10.5, fontWeight: 700, cursor: 'pointer', flexShrink: 0 }}>
                      {openRecipe === w.n ? 'סגור' : '👨‍🍳 מתכון'}
                    </button>
                  </div>
                  {openRecipe === w.n && (
                    <div style={{ marginTop: 8, paddingTop: 8, borderTop: '1px solid var(--allergen-border)', fontSize: 11.5, color: 'var(--text-dark)', lineHeight: 1.6 }}>
                      {w.allergen.recipe}
                    </div>
                  )}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gap: 5 }}>
                  {weekDays.map(pd => {
                    const isAllergen = pd.type === 'allergen'
                    const tip = pd.food ? FOOD_TIPS[pd.food] : null
                    return (
                      <div key={pd.globalIndex} style={{ position: 'relative' }}>
                        <div onClick={() => setSheetDate(pd.dateISO)} style={{
                          borderRadius: 9, padding: '6px 3px 7px', textAlign: 'center', cursor: 'pointer',
                          background: isAllergen ? 'var(--allergen-pale)' : pd.type === 'new' ? 'var(--new-pale)' : 'var(--repeat-pale)',
                          border: `1px solid ${isAllergen ? 'var(--allergen-border)' : pd.type === 'new' ? 'var(--sage-light)' : 'var(--border)'}`,
                          boxShadow: loggedDates.has(pd.dateISO) ? '0 0 0 2px var(--sage) inset' : undefined,
                        }}>
                          <div style={{ fontSize: 8.5, color: 'var(--text-light)', fontWeight: 600 }}>{pd.dayLabel}</div>
                          <span style={{ fontSize: 14, display: 'block', margin: '2px 0' }}>{isAllergen ? w.allergen.emoji : pd.emoji}</span>
                          <div style={{ fontSize: 8, color: isAllergen ? 'var(--allergen)' : 'var(--text-dark)', fontWeight: isAllergen ? 700 : 400, lineHeight: 1.1, minHeight: 20 }}>
                            {isAllergen ? w.allergen.name : pd.food}
                          </div>
                        </div>
                        {tip && pd.type === 'new' && (
                          <div style={{ fontSize: 8, textAlign: 'center', marginTop: 2, color: 'var(--sage)', fontWeight: 600, cursor: 'default' }} title={tip}>ℹ️</div>
                        )}
                      </div>
                    )
                  })}
                </div>

                {/* טיפים למזונות חדשים */}
                {weekDays.filter(pd => pd.type === 'new' && pd.food && FOOD_TIPS[pd.food]).length > 0 && (
                  <div style={{ marginTop: 10, display: 'flex', flexDirection: 'column', gap: 5 }}>
                    {weekDays.filter(pd => pd.type === 'new' && pd.food && FOOD_TIPS[pd.food]).map(pd => (
                      <div key={pd.globalIndex} style={{ background: '#F7F5EE', borderRadius: 9, padding: '7px 10px', fontSize: 11 }}>
                        <span style={{ fontWeight: 700 }}>{pd.emoji} {pd.food}:</span>{' '}
                        <span style={{ color: 'var(--text-mid)' }}>{FOOD_TIPS[pd.food!]}</span>
                      </div>
                    ))}
                  </div>
                )}

                {w.tip && <p style={{ fontSize: 11, color: 'var(--text-light)', marginTop: 8 }}>💡 {w.tip}</p>}
              </div>
            )}
          </div>
        )
      })}

      {sheetDate && <EntrySheet open onClose={() => setSheetDate(null)} familyId={familyId} userId={user.uid} dateISO={sheetDate} entry={null} />}
    </>
  )
}
