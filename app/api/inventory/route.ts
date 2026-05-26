import { NextResponse } from 'next/server';
import { listItems, addItem, deleteAllItems, deleteItemById } from '@/lib/inventoryStore';

export async function GET() {
  const items = listItems();
  return NextResponse.json({ items, total: items.length });
}

export async function POST(request: Request) {
  const body = await request.json();
  if (!body.titulo || !String(body.titulo).trim()) {
    return NextResponse.json({ error: "Campo 'titulo' es obligatorio" }, { status: 400 });
  }
  const item = addItem(body);
  return NextResponse.json({ id: item.id }, { status: 201 });
}

export async function DELETE(request: Request) {
  const url = new URL(request.url);
  const confirm = url.searchParams.get('confirm');
  if (confirm !== 'YES_DELETE_ALL') {
    return NextResponse.json({ error: 'Se requiere confirm=YES_DELETE_ALL' }, { status: 400 });
  }
  const deleted = deleteAllItems();
  return NextResponse.json({ deleted });
}
