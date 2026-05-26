'use client';

export interface HistorialItem {
  tipo: 'mensaje' | 'dato_extraido' | 'seguimiento_creado';
  descripcion: string;
  timestamp: string;
}

interface HistorialTabProps {
  historial: HistorialItem[];
}

const tipoStyles: Record<string, { dot: string; label: string }> = {
  mensaje: { dot: 'bg-slate-400', label: 'Mensaje' },
  dato_extraido: { dot: 'bg-green-500', label: 'Dato extraído' },
  seguimiento_creado: { dot: 'bg-blue-500', label: 'Seguimiento' },
};

export default function HistorialTab({ historial }: HistorialTabProps) {
  if (historial.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <p className="text-sm font-medium text-slate-700 mb-1">Sin actividad reciente.</p>
        <p className="text-xs text-slate-500">El historial de la conversación aparecerá acá.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {historial.map((item, idx) => {
        const style = tipoStyles[item.tipo] ?? tipoStyles.mensaje;
        return (
          <div key={idx} className="flex gap-3 items-start">
            <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${style.dot}`} />
            <div>
              <p className="text-xs font-medium text-slate-500">{style.label}</p>
              <p className="text-sm text-slate-900">{item.descripcion}</p>
              <p className="text-xs text-slate-400 mt-0.5">
                {new Date(item.timestamp).toLocaleTimeString('es-AR', {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
