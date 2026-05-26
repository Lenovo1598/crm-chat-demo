import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="w-full max-w-3xl rounded-[32px] border border-slate-200 bg-white p-10 shadow-xl">
        <span className="text-xs uppercase tracking-[0.3em] text-slate-400">Demo independiente</span>
        <h1 className="mt-6 text-4xl font-semibold text-slate-900">Flip Chat AI</h1>
        <p className="mt-4 text-slate-600 leading-7">
          Una demo local del asistente Flip para agentes inmobiliarios. Hacé clic en el botón y empezá a chatear con la IA.
        </p>
        <div className="mt-8 flex items-center gap-4">
          <Link
            href="/chat"
            className="inline-flex items-center justify-center rounded-full bg-green-600 px-6 py-3 text-white shadow hover:bg-green-700 transition-colors"
          >
            Abrir demo de chat
          </Link>
        </div>
      </div>
    </main>
  );
}
