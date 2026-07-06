export default function PageHeader({ emoji, title, subtitle }: { emoji?: string; title: string; subtitle?: string }) {
  return (
    <div style={{
      position: 'relative', overflow: 'hidden',
      background: 'linear-gradient(140deg, #587E59 0%, #6B8E6B 45%, #94B694 100%)',
      color: '#fff', padding: '30px 20px 24px', textAlign: 'center',
      borderRadius: '0 0 28px 28px', margin: '-14px -14px 16px',
      boxShadow: '0 8px 24px rgba(107,142,107,.28)',
    }}>
      <div style={{ position: 'absolute', top: -34, left: -30, width: 120, height: 120, borderRadius: '50%', background: 'rgba(255,255,255,.10)' }} />
      <div style={{ position: 'absolute', bottom: -50, right: -24, width: 150, height: 150, borderRadius: '50%', background: 'rgba(255,255,255,.07)' }} />
      <div style={{ position: 'absolute', top: 14, right: 34, width: 26, height: 26, borderRadius: '50%', background: 'rgba(255,255,255,.12)' }} />
      {emoji && <div style={{ fontSize: 32, marginBottom: 4, position: 'relative', filter: 'drop-shadow(0 2px 4px rgba(0,0,0,.12))' }}>{emoji}</div>}
      <h1 style={{ fontSize: 21, fontWeight: 800, position: 'relative', textShadow: '0 1px 2px rgba(0,0,0,.08)' }}>{title}</h1>
      {subtitle && <p style={{ fontSize: 12.5, opacity: 0.92, marginTop: 5, position: 'relative', fontWeight: 300 }}>{subtitle}</p>}
    </div>
  )
}
