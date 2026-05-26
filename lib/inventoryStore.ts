export type InventoryItem = {
  id: string;
  tipo: string | null;
  titulo: string;
  descripcion?: string | null;
  ubicacion?: string | null;
  zona?: string | null;
  precio?: number | null;
  moneda?: string | null;
  estado?: string | null;
  dormitorios?: number | null;
  banos?: number | null;
  m2?: number | null;
  caracteristicas?: string[];
  created_at: string;
};

const items: InventoryItem[] = [];
let nextId = 1;

function genId() {
  return `local-${(nextId++).toString(16).padStart(6, '0')}`;
}

export function listItems() {
  return [...items].sort((a, b) => (a.created_at < b.created_at ? 1 : -1));
}

export function addItem(data: Partial<InventoryItem>) {
  const item: InventoryItem = {
    id: genId(),
    tipo: data.tipo ?? null,
    titulo: String(data.titulo ?? '').trim(),
    descripcion: data.descripcion ?? null,
    ubicacion: data.ubicacion ?? null,
    zona: data.zona ?? null,
    precio: data.precio ?? null,
    moneda: data.moneda ?? null,
    estado: data.estado ?? 'Disponible',
    dormitorios: data.dormitorios ?? null,
    banos: data.banos ?? null,
    m2: data.m2 ?? null,
    caracteristicas: data.caracteristicas ?? [],
    created_at: new Date().toISOString(),
  };
  items.push(item);
  return item;
}

export function deleteAllItems() {
  const count = items.length;
  items.length = 0;
  return count;
}

export function countItems() {
  return items.length;
}

export function deleteItemById(id: string) {
  const idx = items.findIndex(i => i.id === id);
  if (idx === -1) return false;
  items.splice(idx, 1);
  return true;
}

export function importRows(rows: any[]) {
  const errors: { row: number; error: string }[] = [];
  let imported = 0;
  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    if (!row.titulo || !String(row.titulo).trim()) {
      errors.push({ row: i + 2, error: "Campo 'titulo' es obligatorio" });
      continue;
    }
    const precio = row.precio !== '' && row.precio !== undefined ? Number(row.precio) : null;
    if (precio !== null && (isNaN(precio) || precio <= 0)) {
      errors.push({ row: i + 2, error: 'Precio debe ser numérico y mayor a 0' });
      continue;
    }

    try {
      addItem({
        tipo: row.tipo || null,
        titulo: String(row.titulo).trim(),
        descripcion: row.descripcion || null,
        ubicacion: row.ubicacion || null,
        zona: row.zona || null,
        precio,
        moneda: row.moneda || 'ARS',
        estado: row.estado || 'Disponible',
        dormitorios: row.dormitorios ? parseInt(String(row.dormitorios)) : null,
        banos: row.banos ? parseInt(String(row.banos)) : null,
        m2: row.m2 ? parseInt(String(row.m2)) : null,
      });
      imported++;
    } catch (e) {
      errors.push({ row: i + 2, error: 'Error al insertar' });
    }
  }
  return { imported, failed: errors.length, errors };
}

export function exportCSV() {
  const headers = ['tipo', 'titulo', 'descripcion', 'ubicacion', 'zona', 'precio', 'moneda', 'estado', 'dormitorios', 'banos', 'm2'];
  const escapeVal = (val: unknown) => {
    if (val === null || val === undefined) return '';
    const str = String(val);
    return str.includes(',') || str.includes('"') || str.includes('\n') ? `"${str.replace(/"/g, '""')}"` : str;
  };
  const rows = [headers.join(',')];
  for (const item of listItems()) {
    rows.push(headers.map(h => escapeVal((item as any)[h])).join(','));
  }
  return rows.join('\n');
}
