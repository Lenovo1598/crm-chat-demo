import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { createSession, getSession } from '@/lib/demoStore';

export async function GET() {
  const cookieStore = cookies();
  const sessionToken = cookieStore.get('demo_session')?.value;

  if (!sessionToken) {
    return NextResponse.json({ error: 'No session' }, { status: 404 });
  }

  const session = getSession(sessionToken);
  if (!session) {
    return NextResponse.json({ error: 'Session not found' }, { status: 404 });
  }

  return NextResponse.json({
    session_id: session.id,
    lead_data: session.lead_data,
    messages: session.messages,
    seguimientos: session.seguimientos,
  });
}

export async function POST(request: Request) {
  const token = request.headers.get('x-forwarded-for') ?? null;
  const userAgent = request.headers.get('user-agent') ?? null;
  const session = createSession(token, userAgent);

  const response = NextResponse.json({
    session_id: session.id,
    session_token: session.token,
    lead_data: session.lead_data,
    messages: session.messages,
    seguimientos: session.seguimientos,
  });

  response.cookies.set('demo_session', session.token, {
    httpOnly: true,
    sameSite: 'lax',
    maxAge: 60 * 60 * 24,
    path: '/',
  });

  return response;
}
