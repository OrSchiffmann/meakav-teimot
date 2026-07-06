'use client'

import { useEffect, useState } from 'react'
import { ref, get, onValue } from 'firebase/database'
import { db } from './client'
import { useAuth } from './auth-context'
import type { Family } from './types'

export function useFamily() {
  const { user } = useAuth()
  const [familyId, setFamilyId] = useState<string | null | undefined>(undefined)
  const [family, setFamily] = useState<Family | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return
    get(ref(db, `users/${user.uid}/familyId`)).then(snap => {
      setFamilyId(snap.val() ?? null)
    })
  }, [user])

  useEffect(() => {
    if (familyId === undefined) return
    if (!familyId) { setLoading(false); return }
    return onValue(ref(db, `families/${familyId}`), snap => {
      if (snap.exists()) setFamily({ id: familyId, ...snap.val() } as Family)
      setLoading(false)
    })
  }, [familyId])

  return { familyId: familyId ?? null, family, loading: loading || familyId === undefined }
}
