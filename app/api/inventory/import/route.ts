import { NextResponse } from 'next/server';
import { importRows } from '@/lib/inventoryStore';

export async function POST(request: Request) {
  const formData = await request.formData();
  const file = formData.get('file') as File | null;
  if (!file) return NextResponse.json({ error: 'No se recibió archivo' }, { status: 400 });
  const text = await file.text();
  let rows: any[] = [];
  try {
    if (file.name.endsWith('.json')) {
      rows = JSON.parse(text);
      if (!Array.isArray(rows)) return NextResponse.json({ error: 'El JSON debe ser un array de objetos' }, { status: 400 });
    } else {
      // simple CSV parse
      const lines = text.split('\n').filter(l => l.trim());
      if (lines.length < 2) return NextResponse.json({ imported: 0, failed: 0, errors: [] });
      const headers = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, ''));
      rows = lines.slice(1).map(line => {
        const values: string[] = [];
        let current = '';
        let inQuotes = false;
        for (const char of line) {
          if (char === '"') { inQuotes = !inQuotes; continue; }
          if (char === ',' && !inQuotes) { values.push(current.trim()); current = ''; continue; }
          current += char;
        }
        values.push(current.trim());
        return Object.fromEntries(headers.map((h, i) => [h, values[i] ?? '']));
      });
    }
  } catch {
    return NextResponse.json({ error: 'Error al parsear el archivo' }, { status: 400 });
  }

  const result = importRows(rows);
  return NextResponse.json(result);
}
