'use client'

import { useEffect, useState } from 'react'
import { ref, onValue, set, remove, update } from 'firebase/database'
import { db } from '@/lib/firebase/client'
import { useFamily } from '@/lib/firebase/use-family'
import { PLAN_DAYS, isAllergenFood, isoOf, dateForPlanIndex, todayMidnight } from '@/lib/plan-data'
import PageHeader from '@/components/page-header'

interface TriedFood {
  key: string
  food: string
  firstTriedAt: string
  isAllergen?: boolean
}

function encodeFood(food: string) { return food.replace(/[.#$[\]]/g, '_') }

export default function FoodsPage() {
  const { familyId, family, loading } = useFamily()
  const [foods, setFoods] = useState<TriedFood[]>([])
  const [newFood, setNewFood] = useState('')

  useEffect(() => {
    if (!familyId) return
    return onValue(ref(db, `families/${familyId}/uniqueFoods`), snap => {
      const list: TriedFood[] = []
      snap.forEach(child => { list.push({ key: child.key!, ...child.val() }) })
      setFoods(list)
    })
  }, [familyId])

  if (loading || !family || !familyId) {
    return <div style={{ textAlign: 'center', padding: 40, color: 'var(--text-light)' }}>טוען...</div>
  }

  // הצעות אוטומטיות מהתכנית: מזונות שתאריכם עבר וטרם ברשימה
  const startDate = new Date(family.startDate + 'T00:00:00')
  const todayISO = isoOf(todayMidnight())
  const knownNames = new Set(foods.map(f => f.food))
  const suggestions = [...new Map(
    PLAN_DAYS
      .filter(pd => isoOf(dateForPlanIndex(startDate, pd.globalIndex)) <= todayISO)
      .map(pd => pd.type === 'allergen' ? pd.week.allergen.food : pd.food)
      .filter((f): f is string => !!f && f !== 'חזרות ותחזוקה' && !knownNames.has(f))
      .map(f => [f, f] as const)
  ).values()]

  const resolveAllergen = (f: TriedFood) => f.isAllergen ?? isAllergenFood(f.food)
  const sortHe = (a: TriedFood, b: TriedFood) => a.food.localeCompare(b.food, 'he')
  const allergens = foods.filter(resolveAllergen).sort(sortHe)
  const regular = foods.filter(f => !resolveAllergen(f)).sort(sortHe)

  async function addFood(name: string) {
    const clean = name.trim()
    if (!clean) return
    await set(ref(db, `families/${familyId}/uniqueFoods/${encodeFood(clean)}`), {
      food: clean, firstTriedAt: new Date().toISOString(),
    })
    setNewFood('')
  }

  async function removeFood(key: string) {
    await remove(ref(db, `families/${familyId}/uniqueFoods/${key}`))
  }

  async function toggleAllergen(f: TriedFood) {
    await update(ref(db, `families/${familyId}/uniqueFoods/${f.key}`), {
      isAllergen: !resolveAllergen(f),
    })
  }

  return (
    <>
      <PageHeader emoji="🍎" title="מזונות שכבר טעמנו" subtitle={`${foods.length} מזונות ברשימה`} />

      {/* הצעות מהתכנית */}
      {suggestions.length > 0 && (
        <div style={{ ...card, background: '#FFF9F0', border: '1px solid #F0E2C8' }}>
          <h3 style={{ fontSize: 13, marginBottom: 4 }}>🤖 מהתכנית — טעמתן את אלה?</h3>
          <p style={{ fontSize: 11, color: 'var(--text-mid)', marginBottom: 10 }}>מזונות שהגיע תורם בתכנית אבל לא תועדו. לחיצה מוסיפה לרשימה.</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {suggestions.map(s => (
              <button key={s} onClick={() => addFood(s)} style={{ background: 'var(--white)', border: '1px dashed var(--sage)', borderRadius: 9, padding: '6px 10px', fontSize: 11.5, color: 'var(--sage)', cursor: 'pointer', fontWeight: 500 }}>
                + {s}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* הוספה ידנית */}
      <div style={card}>
        <div style={{ display: 'flex', gap: 8 }}>
          <input value={newFood} onChange={e => setNewFood(e.target.value)} onKeyDown={e => { if (e.key === 'Enter') addFood(newFood) }} placeholder="הוספת מזון שטעמה (למשל: מלפפון)" style={{ flex: 1, border: '1px solid var(--border)', borderRadius: 9, padding: '9px 10px', fontSize: 13, fontFamily: 'inherit' }} />
          <button onClick={() => addFood(newFood)} style={{ background: 'var(--sage)', color: '#fff', border: 'none', borderRadius: 9, padding: '9px 16px', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>+</button>
        </div>
      </div>

      {/* אלרגנים */}
      <div style={{ ...card, background: 'var(--allergen-pale)', border: '1px solid var(--allergen-border)' }}>
        <h3 style={{ fontSize: 13.5, color: 'var(--allergen)', marginBottom: 8 }}>🚨 אלרגנים ({allergens.length})</h3>
        {allergens.length === 0 && <p style={emptyNote}>עדיין לא תועדו אלרגנים</p>}
        {allergens.map(f => (
          <FoodRow key={f.key} f={f} accent="var(--allergen)" onRemove={() => removeFood(f.key)} onToggle={() => toggleAllergen(f)} toggleLabel="לא אלרגן" />
        ))}
      </div>

      {/* ללא אלרגן */}
      <div style={card}>
        <h3 style={{ fontSize: 13.5, marginBottom: 8 }}>🥗 ללא אלרגן ({regular.length})</h3>
        {regular.length === 0 && <p style={emptyNote}>עדיין לא תועדו מזונות</p>}
        {regular.map(f => (
          <FoodRow key={f.key} f={f} accent="var(--sage)" onRemove={() => removeFood(f.key)} onToggle={() => toggleAllergen(f)} toggleLabel="סמן כאלרגן" />
        ))}
      </div>
    </>
  )
}

function FoodRow({ f, accent, onRemove, onToggle, toggleLabel }: { f: TriedFood; accent: string; onRemove: () => void; onToggle: () => void; toggleLabel: string }) {
  const date = f.firstTriedAt ? new Date(f.firstTriedAt).toLocaleDateString('he-IL', { day: 'numeric', month: 'numeric' }) : ''
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'var(--white)', border: '1px solid var(--border)', borderRadius: 10, padding: '8px 11px', marginBottom: 6 }}>
      <span style={{ flex: 1, fontSize: 13, fontWeight: 500 }}>{f.food}</span>
      {date && <span style={{ fontSize: 10.5, color: 'var(--text-light)' }}>{date}</span>}
      <button onClick={onToggle} title={toggleLabel} style={{ background: 'none', border: `1px solid ${accent}`, borderRadius: 7, padding: '2px 7px', fontSize: 9.5, color: accent, cursor: 'pointer' }}>{toggleLabel}</button>
      <button onClick={onRemove} style={{ background: 'none', border: 'none', fontSize: 13, color: 'var(--text-light)', cursor: 'pointer', padding: '0 2px' }}>🗑️</button>
    </div>
  )
}

const card: React.CSSProperties = { background: 'var(--white)', border: '1px solid var(--border)', borderRadius: 16, padding: '14px 16px', marginBottom: 12 }
const emptyNote: React.CSSProperties = { fontSize: 12, color: 'var(--text-light)', textAlign: 'center', padding: '8px 0' }
