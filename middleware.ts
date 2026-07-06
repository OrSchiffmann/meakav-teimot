import { NextResponse } from 'next/server'

// ההגנה על דפים נעשית בצד לקוח (AuthGuard) — Firebase Auth הוא מקור האמת.
// ה-session cookie משמש רק ל-API routes בצד שרת.
export function middleware() {
  return NextResponse.next()
}

export const config = {
  matcher: [],
}
