'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const tabs = [
  { href: '/', label: 'היום', icon: '📅' },
  { href: '/plan', label: 'התכנית', icon: '📋' },
  { href: '/foods', label: 'מזונות', icon: '🍎' },
  { href: '/history', label: 'היסטוריה', icon: '📖' },
  { href: '/safety', label: 'בטיחות', icon: '⚕️' },
  { href: '/settings', label: 'הגדרות', icon: '⚙️' },
]

export default function TabBar() {
  const pathname = usePathname()

  return (
    <nav style={{
      position: 'fixed',
      bottom: 0,
      right: 0,
      left: 0,
      background: '#fff',
      borderTop: '1px solid var(--border)',
      display: 'flex',
      zIndex: 50,
    }}>
      {tabs.map(tab => {
        const active = pathname === tab.href
        return (
          <Link key={tab.href} href={tab.href} style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            padding: '10px 4px 8px',
            fontSize: 11,
            color: active ? 'var(--sage)' : 'var(--text-light)',
            fontWeight: active ? 700 : 400,
            textDecoration: 'none',
          }}>
            <span style={{ fontSize: 19, marginBottom: 2 }}>{tab.icon}</span>
            {tab.label}
          </Link>
        )
      })}
    </nav>
  )
}
