import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { createSession, getSession, resetSession } from '@/lib/demoStore';

export async function POST(request: Request) {
  const cookieStore = cookies();
  const sessionToken = cookieStore.get('demo_session')?.value;

  if (sessionToken) {
    const session = getSession(sessionToken);
    if (session) {
      resetSession(sessionToken);
      const response = NextResponse.json({ success: true, session_id: session.id });
      response.cookies.set('demo_session', sessionToken, {
        httpOnly: true,
        sameSite: 'lax',
        maxAge: 60 * 60 * 24,
        path: '/',
      });
      return response;
    }
  }

  const token = request.headers.get('x-forwarded-for') ?? null;
  const userAgent = request.headers.get('user-agent') ?? null;
  const session = createSession(token, userAgent);
  const response = NextResponse.json({ success: true, session_id: session.id });
  response.cookies.set('demo_session', session.token, {
    httpOnly: true,
    sameSite: 'lax',
    maxAge: 60 * 60 * 24,
    path: '/',
  });
  return response;
}
