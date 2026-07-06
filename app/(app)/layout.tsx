import TabBar from '@/components/tab-bar'
import AuthGuard from '@/components/auth-guard'

export const dynamic = 'force-dynamic'

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard>
      <div style={{ paddingBottom: 70 }}>
        <div style={{ maxWidth: 520, margin: '0 auto', padding: '14px 14px 0' }}>
          {children}
        </div>
        <TabBar />
      </div>
    </AuthGuard>
  )
}
