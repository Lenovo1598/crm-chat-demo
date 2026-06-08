'use client';
import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import ChatHeader from '@/components/demo/ChatHeader';
import ChatPanel from '@/components/demo/ChatPanel';
import CRMSidePanel from '@/components/demo/CRMSidePanel';
import { HistorialItem } from '@/components/demo/HistorialTab';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface Seguimiento {
  descripcion: string;
  fecha_programada?: string;
}

export default function DemoChatPage() {
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([]);
  const [leadData, setLeadData] = useState<Record<string, unknown>>({});
  const [seguimientos, setSeguimientos] = useState<Seguimiento[]>([]);
  const [notas] = useState<string[]>([]);
  const [historial, setHistorial] = useState<HistorialItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [sessionReady, setSessionReady] = useState(false);
  const [showCRM, setShowCRM] = useState(false);

  const initSession = useCallback(async () => {
    try {
      const res = await fetch('/api/demo/session');
      if (res.ok) {
        const existing = await res.json();
        if (existing?.session_id) {
          setMessages(existing.messages || []);
          setLeadData(existing.lead_data || {});
          setSeguimientos(existing.seguimientos || []);
        }
      } else {
        await fetch('/api/demo/session', { method: 'POST' });
      }
    } catch {
      try {
        await fetch('/api/demo/session', { method: 'POST' });
      } catch {}
    } finally {
      setSessionReady(true);
    }
  }, []);

  useEffect(() => {
    initSession();
  }, [initSession]);

  async function handleSendMessage(text: string) {
    if (!text.trim() || loading) return;

    setMessages(prev => [...prev, { role: 'user', content: text }]);
    setLoading(true);

    try {
      const res = await fetch('/api/demo/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text }),
      });

      if (!res.ok) throw new Error('Error en el servidor');

      const data = await res.json();

      setMessages(prev => [...prev, { role: 'assistant', content: data.response }]);

      if (data.lead_data) setLeadData(data.lead_data);

      if (data.seguimientos?.length) {
        setSeguimientos(prev => [...prev, ...data.seguimientos]);
        setHistorial(prev => [
          ...prev,
          ...data.seguimientos.map((s: Seguimiento) => ({
            tipo: 'seguimiento_creado' as const,
            descripcion: s.descripcion,
            timestamp: new Date().toISOString(),
          })),
        ]);
      }

      if (data.lead_data && Object.keys(data.lead_data).length > 0) {
        setHistorial(prev => [
          ...prev,
          {
            tipo: 'dato_extraido',
            descripcion: `Datos actualizados del lead`,
            timestamp: new Date().toISOString(),
          },
        ]);
      }
    } catch {
      setMessages(prev => [
        ...prev,
        { role: 'assistant', content: 'Hubo un error procesando tu mensaje. Probá de nuevo.' },
      ]);
    } finally {
      setLoading(false);
    }
  }

  async function handleReset() {
    if (!confirm('¿Reiniciar la conversación? Se perderán todos los datos.')) return;

    await fetch('/api/demo/reset', { method: 'POST' });
    setMessages([]);
    setLeadData({});
    setSeguimientos([]);
    setHistorial([]);
  }

  const darkBg = {
    background: `radial-gradient(ellipse at 50% 100%, rgba(34,197,94,0.15) 0%, transparent 60%), #0a0d0b`,
    backgroundImage: `linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)`,
    backgroundSize: `28px 28px`,
  } as React.CSSProperties;

  if (!sessionReady) {
    return (
      <div className="h-screen flex items-center justify-center" style={darkBg}>
        <p className="text-sm text-white/50">Cargando demo...</p>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col overflow-hidden" style={darkBg}>
      <ChatHeader onReset={handleReset} onBack={() => router.push('/')} onToggleCRM={() => setShowCRM(v => !v)} />

      <div className="flex-1 flex overflow-hidden relative">
        <ChatPanel messages={messages} onSendMessage={handleSendMessage} loading={loading} />
        <CRMSidePanel
          leadData={leadData}
          seguimientos={seguimientos}
          notas={notas}
          historial={historial}
          isOpen={showCRM}
          onClose={() => setShowCRM(false)}
        />
      </div>
    </div>
  );
}
