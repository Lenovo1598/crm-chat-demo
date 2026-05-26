import crypto from 'crypto';

export type Message = {
  role: 'user' | 'assistant';
  content: string;
};

export type Seguimiento = {
  descripcion: string;
  fecha_programada?: string;
};

export type DemoSession = {
  id: number;
  token: string;
  ip_address: string | null;
  user_agent: string | null;
  lead_data: Record<string, unknown>;
  messages: Message[];
  seguimientos: Seguimiento[];
  created_at: string;
  updated_at: string;
};

const sessions = new Map<string, DemoSession>();
let nextId = 1;

export function createSession(ip: string | null, userAgent: string | null) {
  const token = crypto.randomBytes(32).toString('hex');
  const session: DemoSession = {
    id: nextId++,
    token,
    ip_address: ip,
    user_agent: userAgent,
    lead_data: {},
    messages: [],
    seguimientos: [],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
  sessions.set(token, session);
  return session;
}

export function getSession(token: string) {
  return sessions.get(token) ?? null;
}

export function resetSession(token: string) {
  const session = getSession(token);
  if (!session) return null;
  session.messages = [];
  session.lead_data = {};
  session.seguimientos = [];
  session.updated_at = new Date().toISOString();
  return session;
}

export function addMessage(token: string, role: 'user' | 'assistant', content: string) {
  const session = getSession(token);
  if (!session) return null;
  const message = { role, content };
  session.messages.push(message);
  session.updated_at = new Date().toISOString();
  return message;
}

export function updateLeadData(token: string, partial: Record<string, unknown>) {
  const session = getSession(token);
  if (!session) return null;
  session.lead_data = { ...session.lead_data, ...partial };
  session.updated_at = new Date().toISOString();
  return session.lead_data;
}

export function addSeguimientos(token: string, items: Seguimiento[]) {
  const session = getSession(token);
  if (!session) return null;
  session.seguimientos.push(...items);
  session.updated_at = new Date().toISOString();
  return items;
}

export function buildMockResponse(message: string) {
  const text = message.trim().toLowerCase();
  const responseParts: string[] = [];
  const leadData: Record<string, unknown> = {};
  const seguimientos: Seguimiento[] = [];

  if (text.includes('palermo')) {
    leadData.zona = 'Palermo';
    responseParts.push('Entiendo, buscas algo en Palermo.');
  }

  if (text.includes('norte')) {
    leadData.zona = 'Zona Norte';
    responseParts.push('Perfecto, te muestro opciones en zona norte.');
  }

  if (text.includes('2 ambientes')) {
    leadData.tipo_propiedad = '2 ambientes';
    responseParts.push('Estoy buscando un 2 ambientes para vos.');
  }

  if (text.includes('casa') && text.includes('jardín')) {
    leadData.tipo_propiedad = 'Casa con jardín';
    responseParts.push('Casa con jardín registrada en la búsqueda.');
  }

  if (text.includes('invertir')) {
    leadData.intencion = 'invertir';
    responseParts.push('Perfecto, priorizo opciones de inversión.');
  }

  const presupuestoMatch = text.match(/(\d+[\.,]?\d*)\s*(mil|m|usd|dólares)/);
  if (presupuestoMatch) {
    const amount = presupuestoMatch[1].replace(',', '.');
    let value = Number(amount);
    if (presupuestoMatch[2].startsWith('mil')) value *= 1000;
    if (!Number.isNaN(value)) {
      leadData.presupuesto = value;
      responseParts.push(`Anoté tu presupuesto en USD ${value.toLocaleString('es-AR')}.`);
    }
  }

  if (text.includes('llamar') || text.includes('reunión') || text.includes('visita')) {
    const fecha = new Date(Date.now() + 24 * 60 * 60 * 1000);
    const fechaIso = fecha.toISOString();
    seguimientos.push({
      descripcion: 'Coordinar llamada o visita con el cliente',
      fecha_programada: fechaIso,
    });
    responseParts.push('Agendé un seguimiento para coordinar la visita.');
  }

  if (Object.keys(leadData).length === 0 && seguimientos.length === 0) {
    responseParts.push('Gracias por el mensaje. ¿Podrías contarme más sobre el cliente o el interés?');
  }

  return {
    response: responseParts.join(' '),
    lead_data: leadData,
    seguimientos,
  };
}
