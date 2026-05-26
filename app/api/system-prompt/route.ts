import { NextResponse } from 'next/server';
import { getActivePrompt, getDefaultPrompt, insertPrompt } from '@/lib/promptsStore';

export async function GET() {
  const prompt = getActivePrompt();
  if (!prompt) return NextResponse.json({ error: 'No active prompt found' }, { status: 404 });
  const defaultPrompt = getDefaultPrompt();
  return NextResponse.json({ content: prompt.content, is_default: prompt.is_default, is_customized: defaultPrompt ? prompt.content !== defaultPrompt.content : false, character_count: prompt.content.length, version: prompt.version });
}

export async function PUT(request: Request) {
  const body = await request.json();
  const content = body?.content ?? '';
  if (!String(content).trim()) return NextResponse.json({ error: 'Contenido vacío' }, { status: 400 });
  // For demo, created_by is null
  const p = insertPrompt(String(content).trim(), null);
  return NextResponse.json({ success: true, version: p.version, character_count: p.content.length });
}
