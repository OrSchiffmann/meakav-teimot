export default function SafetyPage() {
  const rules = [
    'מגישים אלרגן חדש רק בבוקר, בבית, עם השגחה למשך 2-3 שעות.',
    'מתחילים בכמות קטנה מאוד ומגדילים בהדרגה אם אין תגובה.',
    'לא מכניסים שני אלרגנים חדשים באותו שבוע.',
    'לאחר הכנסה מוצלחת ממשיכים להגיש 2-3 פעמים בשבוע לשימור סבילות.',
    'סימני תגובה: פריחה, נפיחות בפנים/שפתיים, הקאות, שלשול, קושי בנשימה - לפנות מיידית לרופא/מיון.',
    'לא דבש לפני גיל שנה. לא מלח/סוכר. לא חלב פרה כמשקה עיקרי לפני שנה.',
    'אגוזים/בוטנים תמיד טחונים או כחמאה מדוללת - לעולם לא שלמים.',
    'זו הנחיה כללית - יש להתייעץ עם רופא/ת הילדים לפני התחלה, במיוחד עם רקע אלרגי משפחתי.',
  ]

  return (
    <>
      <div style={{ background: 'linear-gradient(135deg,var(--sage),var(--sage-light))', color: '#fff', padding: '26px 20px 20px', textAlign: 'center', borderRadius: '0 0 20px 20px', margin: '-14px -14px 14px' }}>
        <h1 style={{ fontSize: 19, fontWeight: 800 }}>⚕️ כללי בטיחות</h1>
        <p style={{ fontSize: 12, opacity: 0.9, marginTop: 3 }}>באלרגנים ותחילת מזון מוצק</p>
      </div>

      <div style={{ background: 'var(--white)', border: '1px solid var(--border)', borderRadius: 16, padding: '14px 16px' }}>
        <ul style={{ paddingRight: 16, fontSize: 12, color: 'var(--text-mid)', lineHeight: 1.8, margin: 0 }}>
          {rules.map((r, i) => <li key={i}>{r}</li>)}
        </ul>
      </div>

      <div style={{ background: 'var(--allergen-pale)', border: '1px solid var(--allergen-border)', borderRadius: 16, padding: '14px 16px', marginTop: 12 }}>
        <h3 style={{ fontSize: 13, fontWeight: 700, color: 'var(--allergen)', marginBottom: 8 }}>🚨 8 האלרגנים הנפוצים</h3>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {['גלוטן 🌾', 'ביצה 🥚', 'חלב פרה 🥛', 'בוטנים 🥜', 'אגוזי עץ 🌰', 'שומשום 🫙', 'דגים 🐟', 'סויה 🌱'].map(a => (
            <span key={a} style={{ background: 'var(--white)', border: '1px solid var(--allergen-border)', borderRadius: 8, padding: '5px 10px', fontSize: 11.5, color: 'var(--allergen)' }}>{a}</span>
          ))}
        </div>
      </div>
    </>
  )
}
