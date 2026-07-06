export default function SafetyPage() {
  return (
    <>
      <div style={{ background: 'linear-gradient(135deg,var(--sage),var(--sage-light))', color: '#fff', padding: '26px 20px 20px', textAlign: 'center', borderRadius: '0 0 20px 20px', margin: '-14px -14px 14px' }}>
        <h1 style={{ fontSize: 19, fontWeight: 800 }}>⚕️ מדריך בטיחות</h1>
        <p style={{ fontSize: 12, opacity: 0.9, marginTop: 3 }}>כל מה שחשוב לדעת לפני ותוך כדי</p>
      </div>

      <Section title="✅ סימני מוכרות למזון מוצק (בסביבות 6 חודשים)">
        <ul style={ul}>
          <li>יושבת עם תמיכה קלה ומחזיקה ראש יציב</li>
          <li>מתעניינת באוכל — עוקבת בעיניים, מושיטה יד</li>
          <li>רפלקס דחיפת הלשון נחלש (לא דוחפת אוכל החוצה אוטומטית)</li>
          <li>מכניסה חפצים לפה בעצמה</li>
        </ul>
      </Section>

      <Section title="🩸 ברזל — הדבר הכי חשוב תזונתית">
        <p style={p}>מאגרי הברזל מהלידה מתדלדלים סביב גיל 6 חודשים. מזונות עשירים בברזל שכדאי לשלב מוקדם: <b>חלמון ביצה, טחינה, קטניות מרוסקות (עדשים), דייסות מועשרות בברזל, בשר/עוף מרוסק</b> (אפשר להוסיף לתכנית!). טיפ: ויטמין C (עגבניה, פלפל, תפוז) משפר ספיגת ברזל — שווה לשלב באותה ארוחה.</p>
      </Section>

      <Section title="🚨 כללי הזהב לאלרגנים">
        <ul style={ul}>
          <li>אלרגן חדש — <b>רק בבוקר, בבית</b>, עם השגחה 2-3 שעות אחרי</li>
          <li>מתחילים בכמות זעירה (רבע כפית) ומגדילים בהדרגה יומיים-שלושה</li>
          <li>אלרגן אחד חדש בשבוע — כדי שנדע מה גרם לתגובה אם תהיה</li>
          <li>אחרי הכנסה מוצלחת — <b>ממשיכים 2-3 פעמים בשבוע</b>. הפסקה ארוכה עלולה לבטל את הסבילות שנבנתה!</li>
          <li>מחקרים (LEAP ואחרים) מראים: חשיפה מוקדמת ועקבית לאלרגנים <b>מפחיתה</b> סיכון לאלרגיה — לא מגבירה</li>
        </ul>
      </Section>

      <div style={{ background: 'var(--allergen-pale)', border: '1px solid var(--allergen-border)', borderRadius: 16, padding: '14px 16px', marginBottom: 12 }}>
        <h3 style={{ fontSize: 13.5, fontWeight: 700, color: 'var(--allergen)', marginBottom: 8 }}>⚠️ זיהוי תגובה אלרגית</h3>
        <p style={{ ...p, marginBottom: 6 }}><b>תגובה קלה</b> (מתקשרים לרופא/ה): פריחה מקומית סביב הפה, אדמומיות, כמה נקודות אורטיקריה (סרפדת), גירוד.</p>
        <p style={{ ...p, marginBottom: 6 }}><b style={{ color: 'var(--allergen)' }}>תגובה חמורה (מיד 101/מיון!):</b> נפיחות שפתיים/לשון/פנים, קושי בנשימה, צפצופים, שיעול פתאומי מתמשך, הקאות חוזרות, חיוורון/רפיון, אובדן הכרה.</p>
        <p style={p}>רוב התגובות מופיעות תוך דקות עד שעתיים מהחשיפה.</p>
      </div>

      <Section title="🫁 רפלקס הקאה (Gag) מול חנק — חשוב להכיר את ההבדל">
        <p style={{ ...p, marginBottom: 6 }}><b style={{ color: 'var(--sage)' }}>Gag (תקין!):</b> משתעלת, פנים אדומות, קול — היא מתמודדת. זה רפלקס הגנה בריא שמלמד אותה לאכול. <b>לא מתערבים</b>, נשארים רגועים.</p>
        <p style={{ ...p, marginBottom: 6 }}><b style={{ color: 'var(--allergen)' }}>חנק (חירום!):</b> שקט, בלי קול, שפתיים מכחילות, מבט מבוהל. פועלים מיד — טפיחות גב (תינוקת על האמה, ראש נמוך מהגוף).</p>
        <p style={p}>💪 מומלץ מאוד: קורס החייאת תינוקות להורים (מד״א/טרם מציעים).</p>
      </Section>

      <Section title="🚫 אסור לפני גיל שנה">
        <ul style={ul}>
          <li><b>דבש</b> — סכנת בוטוליזם, גם מבושל</li>
          <li><b>מלח וסוכר</b> — הכליות לא בשלות; אין צורך בתיבול</li>
          <li><b>אגוזים/בוטנים שלמים או חתיכות</b> — סכנת חנק (רק כחמאה מדוללת!)</li>
          <li><b>ענבים/עגבניות שרי שלמים</b> — תמיד לחתוך לרבעים לאורך</li>
          <li><b>חלב פרה כמשקה</b> — כן מותר ביוגורט/בישול, לא ככוס חלב</li>
          <li><b>מיץ פירות</b> — אין בו צורך; פרי אמיתי עדיף תמיד</li>
          <li>ירקות קשים גולמיים (גזר חי), פופקורן, סוכריות</li>
        </ul>
      </Section>

      <Section title="💧 מים">
        <p style={p}>מגיל 6 חודשים אפשר להציע מעט מים בכוס פתוחה קטנה או כוס קש עם הארוחות (לא בקבוק). כמות קטנה — 30-60 מ״ל ליום מספיקים. חלב אם/פורמולה נשארים מקור הנוזלים העיקרי.</p>
      </Section>

      <Section title="🍽️ עקרונות האכלה נכונה">
        <ul style={ul}>
          <li><b>התינוקת קובעת כמה</b> — התפקיד שלנו מה ומתי, שלה כמה. לא מכריחים ולא "עוד כפית אחת"</li>
          <li>סירוב למזון חדש הוא נורמלי — לפעמים צריך <b>8-15 חשיפות</b> עד שמזון מתקבל. לא מוותרים אחרי פעם אחת!</li>
          <li>מתקדמים במרקמים — להישאר על מחיות חלקות יותר מדי זמן מקשה על התפתחות הלעיסה. עד גיל 9-10 חודשים כדאי גושים רכים</li>
          <li>אוכלים יחד — תינוקות לומדים מחיקוי. שבו מולה ואכלו מאותם מזונות</li>
          <li>בלגן הוא חלק מהלמידה 🎨 — לתת לה לגעת, למרוח ולחקור</li>
        </ul>
      </Section>

      <div style={{ background: 'var(--allergen-pale)', border: '1px solid var(--allergen-border)', borderRadius: 16, padding: '14px 16px', marginBottom: 12 }}>
        <h3 style={{ fontSize: 13, fontWeight: 700, color: 'var(--allergen)', marginBottom: 8 }}>🚨 8 האלרגנים בתכנית</h3>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {['גלוטן 🌾', 'ביצה 🥚', 'חלב פרה 🥛', 'בוטנים 🥜', 'אגוזי עץ 🌰', 'שומשום 🫙', 'דגים 🐟', 'סויה 🌱'].map(a => (
            <span key={a} style={{ background: 'var(--white)', border: '1px solid var(--allergen-border)', borderRadius: 8, padding: '5px 10px', fontSize: 11.5, color: 'var(--allergen)' }}>{a}</span>
          ))}
        </div>
      </div>

      <p style={{ fontSize: 11, color: 'var(--text-light)', textAlign: 'center', padding: '4px 10px 10px', lineHeight: 1.6 }}>
        המידע כאן הוא הכוונה כללית ואינו תחליף לייעוץ רפואי. התייעצו עם רופא/ת הילדים או טיפת חלב לפני תחילת התכנית — במיוחד אם יש אטופיק דרמטיטיס (אקזמה) או רקע אלרגי משפחתי.
      </p>
    </>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ background: 'var(--white)', border: '1px solid var(--border)', borderRadius: 16, padding: '14px 16px', marginBottom: 12 }}>
      <h3 style={{ fontSize: 13.5, fontWeight: 700, marginBottom: 8 }}>{title}</h3>
      {children}
    </div>
  )
}

const ul: React.CSSProperties = { paddingRight: 16, fontSize: 12, color: 'var(--text-mid)', lineHeight: 1.8, margin: 0 }
const p: React.CSSProperties = { fontSize: 12, color: 'var(--text-mid)', lineHeight: 1.7, margin: 0 }
