'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { onIdTokenChanged, getRedirectResult, type User } from 'firebase/auth'
import { auth } from './client'

interface AuthContextValue {
  user: User | null
  loading: boolean
}

const AuthContext = createContext<AuthContextValue>({ user: null, loading: true })

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let unsub: (() => void) | undefined

    // קודם בודקים redirect result, רק אז מאזינים לשינויים
    getRedirectResult(auth)
      .catch(() => null)
      .finally(() => {
        unsub = onIdTokenChanged(auth, (u) => {
          setUser(u)
          setLoading(false)
          if (u) {
            u.getIdToken().then(token =>
              fetch('/api/auth/session', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token }),
              })
            ).catch(console.error)
          } else {
            fetch('/api/auth/session', { method: 'DELETE' }).catch(() => {})
          }
        })
      })

    return () => { unsub?.() }
  }, [])

  return <AuthContext.Provider value={{ user, loading }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  return useContext(AuthContext)
}
