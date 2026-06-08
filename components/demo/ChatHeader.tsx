'use client';
import { ChevronLeft, LayoutList } from 'lucide-react';

interface ChatHeaderProps {
  onReset: () => void;
  onBack: () => void;
  onToggleCRM: () => void;
}

export default function ChatHeader({ onReset, onBack, onToggleCRM }: ChatHeaderProps) {
  return (
    <header className="bg-white border-b border-slate-200 px-4 md:px-8 py-4 flex justify-between items-center">
      <div className="flex items-center gap-3">
        <span className="text-lg font-bold text-slate-900">BriqIA</span>
        <span className="text-xs font-medium text-slate-400 tracking-widest">DEMO</span>
      </div>
      <div className="flex items-center gap-4 md:gap-6">
        <button
          onClick={onToggleCRM}
          className="md:hidden text-slate-500 hover:text-slate-900 transition-colors"
          aria-label="Ver CRM"
        >
          <LayoutList size={20} />
        </button>
        <button
          onClick={onReset}
          className="text-sm text-slate-700 hover:text-slate-900 transition-colors"
        >
          Reiniciar
        </button>
        <button
          onClick={onBack}
          className="text-sm text-slate-700 hover:text-slate-900 flex items-center gap-1 transition-colors"
        >
          <ChevronLeft size={14} />
          <span className="hidden sm:inline">Volver</span>
        </button>
      </div>
    </header>
  );
}
