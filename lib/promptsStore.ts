type Prompt = {
  id: number;
  content: string;
  is_default: boolean;
  is_active: boolean;
  version: number;
  created_by?: number | null;
  created_at: string;
};

const prompts: Prompt[] = [
  {
    id: 1,
    content: `Sos Flip, asistente AI de un agente inmobiliario en Argentina.\nRespondé en JSON cuando corresponda.`,
    is_default: true,
    is_active: true,
    version: 1,
    created_by: null,
    created_at: new Date().toISOString(),
  },
];

let nextPromptId = 2;

export function getActivePrompt() {
  return prompts.find(p => p.is_active) ?? null;
}

export function getDefaultPrompt() {
  return prompts.find(p => p.is_default) ?? null;
}

export function insertPrompt(content: string, created_by?: number | null) {
  // Deactivate current
  prompts.forEach(p => (p.is_active = false));
  const version = Math.max(...prompts.map(p => p.version)) + 1;
  const p = {
    id: nextPromptId++,
    content,
    is_default: false,
    is_active: true,
    version,
    created_by: created_by ?? null,
    created_at: new Date().toISOString(),
  };
  prompts.push(p);
  return p;
}

export function restoreDefault() {
  const def = getDefaultPrompt();
  if (!def) return null;
  prompts.forEach(p => (p.is_active = false));
  def.is_active = true;
  return def;
}
