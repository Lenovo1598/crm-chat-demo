import { NextResponse } from 'next/server';
import { exportCSV } from '@/lib/inventoryStore';

export async function GET() {
  const csv = exportCSV();
  return new NextResponse(csv, {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="inventario-${new Date().toISOString().slice(0,10)}.csv"`,
    },
  });
}
