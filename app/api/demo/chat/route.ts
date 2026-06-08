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

  if (session) addMessage(sessionToken, 'user', message);

  let agentResponse = '';
  try {
    const n8nRes = await fetch(N8N_WEBHOOK, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sessionId: sessionToken,
        chatInput: message,
      }),
    });

    if (!n8nRes.ok) {
      const errText = await n8nRes.text();
      console.error('n8n error:', n8nRes.status, errText);
      return NextResponse.json({ error: 'Error al contactar el agente' }, { status: 502 });
    }

    const n8nData = await n8nRes.json();
    agentResponse = String(n8nData?.output ?? n8nData?.response ?? '');
  } catch (err) {
    console.error('fetch to n8n failed:', err);
    return NextResponse.json({ error: 'Error al contactar el agente' }, { status: 502 });
  }

  if (session) addMessage(sessionToken, 'assistant', agentResponse);

  return NextResponse.json({
    response: agentResponse,
    lead_data: getSession(sessionToken)?.lead_data ?? {},
    seguimientos: [],
  });
}
