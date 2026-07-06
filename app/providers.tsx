'use client'

import dynamic from 'next/dynamic'

const AuthProvider = dynamic(
  () => import('@/lib/firebase/auth-context').then(m => m.AuthProvider),
  { ssr: false }
)

export function Providers({ children }: { children: React.ReactNode }) {
  return <AuthProvider>{children}</AuthProvider>
}
