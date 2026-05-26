import { NextResponse } from 'next/server';
import { restoreDefault } from '@/lib/promptsStore';

export async function POST() {
  const def = restoreDefault();
  if (!def) return NextResponse.json({ error: 'No default prompt found' }, { status: 404 });
  return NextResponse.json({ success: true, content: def.content });
}
