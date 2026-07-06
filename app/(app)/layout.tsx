import TabBar from '@/components/tab-bar'

export const dynamic = 'force-dynamic'

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ paddingBottom: 70 }}>
      <div style={{ maxWidth: 520, margin: '0 auto', padding: '14px 14px 0' }}>
        {children}
      </div>
      <TabBar />
    </div>
  )
}
