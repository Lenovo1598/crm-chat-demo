'use client';
import { useState } from 'react';
import { MoreHorizontal, X } from 'lucide-react';
import LeadActivoCard from './LeadActivoCard';
import SeguimientosTab from './SeguimientosTab';
import NotasTab from './NotasTab';
import HistorialTab, { HistorialItem } from './HistorialTab';

type Tab = 'seguimientos' | 'notas' | 'historial';

interface Seguimiento {
  descripcion: string;
  fecha_programada?: string;
}

interface CRMSidePanelProps {
  leadData: Record<string, unknown>;
  seguimientos: Seguimiento[];
  notas: string[];
  historial: HistorialItem[];
  isOpen?: boolean;
  onClose?: () => void;
}

export default function CRMSidePanel({ leadData, seguimientos, notas, historial, isOpen = false, onClose }: CRMSidePanelProps) {
  const [tab, setTab] = useState<Tab>('seguimientos');

  const tabs: { id: Tab; label: string }[] = [
    { id: 'seguimientos', label: 'Seguimientos' },
    { id: 'notas', label: 'Notas' },
    { id: 'historial', label: 'Historial' },
  ];

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 md:hidden"
          onClick={onClose}
        />
      )}

      <div className={`
        md:w-[420px] md:shrink-0 md:border-l md:border-white/10 md:flex md:flex-col
        flex flex-col
        fixed inset-y-0 right-0 z-50 w-[90vw] max-w-sm shadow-2xl
        transition-transform duration-300 ease-in-out
        md:relative md:translate-x-0 md:shadow-none md:z-auto
        ${isOpen ? 'translate-x-0' : 'translate-x-full'}
      `}
        style={{ background: 'rgba(10,13,11,0.95)', backdropFilter: 'blur(12px)' }}
      >
        <div className="px-6 py-5 border-b border-white/10">
          <div className="flex justify-between items-start mb-1">
            <p className="text-xs text-green-400/60 italic">✦ CRM</p>
            <div className="flex items-center gap-2">
              <button className="text-white/30 hover:text-white/60 transition-colors">
                <MoreHorizontal size={16} />
              </button>
              <button
                onClick={onClose}
                className="md:hidden text-white/30 hover:text-white/60 transition-colors"
                aria-label="Cerrar CRM"
              >
                <X size={18} />
              </button>
            </div>
          </div>
          <h2 className="text-base font-semibold text-white">Lead activo</h2>
        </div>

        <div className="px-6 py-4 border-b border-white/10">
          <LeadActivoCard leadData={leadData as Parameters<typeof LeadActivoCard>[0]['leadData']} />
        </div>

        <div className="border-b border-white/10 px-6">
          <div className="flex gap-6">
            {tabs.map(({ id, label }) => (
              <button
                key={id}
                onClick={() => setTab(id)}
                className={`py-3 text-sm font-medium border-b-2 transition-colors ${
                  tab === id
                    ? 'border-green-400 text-green-400'
                    : 'border-transparent text-white/40 hover:text-white/70'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-6">
          {tab === 'seguimientos' && <SeguimientosTab seguimientos={seguimientos} />}
          {tab === 'notas' && <NotasTab notas={notas} />}
          {tab === 'historial' && <HistorialTab historial={historial} />}
        </div>
      </div>
    </>
  );
}
