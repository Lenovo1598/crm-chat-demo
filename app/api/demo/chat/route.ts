import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { addMessage, addSeguimientos, getSession, updateLeadData, buildMockResponse } from '@/lib/demoStore';

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

  const chatResult = buildMockResponse(message);
  addMessage(sessionToken, 'assistant', chatResult.response);

  if (Object.keys(chatResult.lead_data).length > 0) {
    updateLeadData(sessionToken, chatResult.lead_data);
  }

  if (chatResult.seguimientos.length > 0) {
    addSeguimientos(sessionToken, chatResult.seguimientos);
  }

  return NextResponse.json({
    response: chatResult.response,
    lead_data: getSession(sessionToken)?.lead_data ?? {},
    seguimientos: chatResult.seguimientos,
  });
}
