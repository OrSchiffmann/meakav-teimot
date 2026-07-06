'use client'

import { useEffect, useState } from 'react'
import { ref, onValue } from 'firebase/database'
import { db } from '@/lib/firebase/client'
import { useFamily } from '@/lib/firebase/use-family'
import { fmtDate } from '@/lib/plan-data'
import type { LogEntry } from '@/lib/firebase/types'
import PageHeader from '@/components/page-header'

export default function HistoryPage() {
  const { familyId, loading } = useFamily()
  const [entries, setEntries] = useState<LogEntry[]>([])

  useEffect(() => {
    if (!familyId) return
    return onValue(ref(db, `families/${familyId}/logEntries`), snap => {
      const all: LogEntry[] = []
      snap.forEach(child => { all.push({ id: child.key!, ...child.val() }) })
      all.sort((a, b) => b.date.localeCompare(a.date) || b.createdAt.localeCompare(a.createdAt))
      setEntries(all)
    })
  }, [familyId])

  const byDate = new Map<string, string[]>()
  for (const e of entries) {
    if (!byDate.has(e.date)) byDate.set(e.date, [])
    byDate.get(e.date)!.push(e.food)
  }
  const days = Array.from(byDate.entries())

  return (
    <>
      <PageHeader emoji="📖" title="היסטוריית תיעוד" subtitle="כל הימים שתועדו, מהאחרון לראשון" />

      {loading && <p style={{ textAlign: 'center', color: 'var(--text-light)', fontSize: 12 }}>טוען...</p>}
      {!loading && days.length === 0 && (
        <div style={{ background: 'var(--white)', border: '1px solid var(--border)', borderRadius: 16, padding: '20px 16px', textAlign: 'center' }}>
          <p style={{ fontSize: 12, color: 'var(--text-light)' }}>אין עדיין תיעוד. התחילו לתעד מהמסך הראשי!</p>
        </div>
      )}
      {days.map(([date, foods]) => (
        <div key={date} style={{ background: 'var(--white)', border: '1px solid var(--border)', borderRadius: 14, padding: '12px 14px', marginBottom: 10 }}>
          <div style={{ fontSize: 12.5, fontWeight: 700, marginBottom: 4 }}>{fmtDate(new Date(date + 'T00:00:00'))}</div>
          <div style={{ fontSize: 11.5, color: 'var(--text-mid)' }}>{foods.join(' · ')}</div>
        </div>
      ))}
    </>
  )
}
