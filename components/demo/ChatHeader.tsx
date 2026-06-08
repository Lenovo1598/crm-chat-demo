'use client';
import { ChevronLeft, LayoutList } from 'lucide-react';

interface ChatHeaderProps {
  onReset: () => void;
  onBack: () => void;
  onToggleCRM: () => void;
}

export default function ChatHeader({ onReset, onBack, onToggleCRM }: ChatHeaderProps) {
  return (
    <header className="border-b border-white/10 px-4 md:px-8 py-4 flex justify-between items-center bg-black/20 backdrop-blur-sm">
      <div className="flex items-center gap-3">
        <span className="text-lg font-bold text-white">BriqIA</span>
        <span className="text-xs font-medium text-white/30 tracking-widest">DEMO</span>
      </div>
      <div className="flex items-center gap-4 md:gap-6">
        <button
          onClick={onToggleCRM}
          className="md:hidden text-white/50 hover:text-white transition-colors"
          aria-label="Ver CRM"
        >
          <LayoutList size={20} />
        </button>
        <button
          onClick={onReset}
          className="text-sm text-white/50 hover:text-white transition-colors"
        >
          Reiniciar
        </button>
        <button
          onClick={onBack}
          className="text-sm text-white/50 hover:text-white flex items-center gap-1 transition-colors"
        >
          <ChevronLeft size={14} />
          <span className="hidden sm:inline">Volver</span>
        </button>
      </div>
    </header>
  );
}
