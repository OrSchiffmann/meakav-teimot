import { getAdminAuth, getAdminDb } from '@/lib/firebase/admin'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  const cookieStore = await cookies()
  const session = cookieStore.get('session')?.value
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  let uid: string
  try {
    const decoded = await getAdminAuth().verifySessionCookie(session)
    uid = decoded.uid
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { email, familyId } = await request.json()

  const adminDb = getAdminDb()
  const memberSnap = await adminDb.ref(`families/${familyId}/members/${uid}`).get()
  if (!memberSnap.exists() || memberSnap.val()?.role !== 'owner') {
    return NextResponse.json({ error: 'Only owners can invite' }, { status: 403 })
  }

  const inviteRef = adminDb.ref(`families/${familyId}/invites`).push()
  await inviteRef.set({ familyId, email, status: 'pending', invitedBy: uid, createdAt: new Date().toISOString() })

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? `https://${request.headers.get('host')}`
  const link = `${siteUrl}/onboarding?family=${familyId}`

  try {
    await getAdminAuth().generateSignInWithEmailLink(email, { url: link, handleCodeInApp: true })
  } catch (e) {
    console.error('Email invite error:', e)
  }

  return NextResponse.json({ ok: true, link })
}
