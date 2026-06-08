import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { addMessage, getSession } from '@/lib/demoStore';

const N8N_WEBHOOK = process.env.N8N_CHAT_WEBHOOK!;

export async function POST(request: Request) {
  const body = await request.json();
  const message = String(body?.message ?? '').trim();

  if (!message) {
    return NextResponse.json({ error: 'Mensaje vacío' }, { status: 400 });
  }

  const cookieStore = cookies();
  const sessionToken = cookieStore.get('demo_session')?.value;
  if (!sessionToken) {
    return NextResponse.json({ error: 'No session' }, { status: 401 });
  }

  const session = getSession(sessionToken);
  if (!session) {
    return NextResponse.json({ error: 'Session not found' }, { status: 404 });
  }

  addMessage(sessionToken, 'user', message);

  const n8nRes = await fetch(N8N_WEBHOOK, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      sessionId: session.token,
      chatInput: message,
    }),
  });

  if (!n8nRes.ok) {
    return NextResponse.json({ error: 'Error al contactar el agente' }, { status: 502 });
  }

  const n8nData = await n8nRes.json();
  const agentResponse = String(n8nData?.output ?? n8nData?.response ?? '');

  addMessage(sessionToken, 'assistant', agentResponse);

  return NextResponse.json({
    response: agentResponse,
    lead_data: getSession(sessionToken)?.lead_data ?? {},
    seguimientos: [],
  });
}
