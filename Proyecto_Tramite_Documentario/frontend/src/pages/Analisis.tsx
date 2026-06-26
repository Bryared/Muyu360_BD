import { useState } from 'react';
import { RefreshCw, ExternalLink, HelpCircle } from 'lucide-react';

const Analisis = () => {
  const iframeUrl = 'http://localhost:8050';
  const [key, setKey] = useState(0);

  const handleRefresh = () => {
    setKey(prev => prev + 1);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <span className="text-xs font-mono tracking-widest text-blue-400 uppercase font-bold bg-blue-50 px-2.5 py-1 rounded-full border border-blue-100">
            Inteligencia de Negocios
          </span>
          <h1 className="text-3xl font-serif font-bold text-slate-800 mt-2">Análisis y Estadísticas</h1>
          <p className="text-xs text-slate-400 mt-1">Supervisión en tiempo real de la carga laboral y estados de trámites en MuyuAgro.</p>
        </div>

        <div className="flex items-center gap-2">
          <button 
            onClick={handleRefresh}
            className="flex items-center gap-1.5 border border-slate-200 bg-white text-slate-600 px-3 py-2 rounded-xl text-xs font-bold hover:bg-slate-50 transition shadow-sm cursor-pointer"
            title="Recargar Dashboard"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Recargar
          </button>
          <a 
            href={iframeUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-xl text-xs font-bold transition shadow-sm cursor-pointer"
          >
            <ExternalLink className="w-3.5 h-3.5" /> Abrir en pestaña
          </a>
        </div>
      </div>

      {/* Info Alert (Kawaii Minimalist) */}
      <div className="bg-sky-50/60 border border-sky-100/85 p-4 rounded-2xl flex items-start gap-3 text-xs text-sky-800 leading-relaxed">
        <HelpCircle className="w-4 h-4 text-sky-500 flex-shrink-0 mt-0.5" />
        <div>
          <span className="font-bold block text-sky-950 uppercase tracking-wider text-[10px] mb-0.5">Integración con Python Dash</span>
          <p>
            Esta sección integra el módulo de analítica desarrollado en Python y Plotly Dash (puerto 8050). 
            Asegúrate de ejecutar el script <code className="bg-sky-100/70 px-1 py-0.5 rounded font-mono text-sky-900">python app.py</code> dentro de la carpeta <code className="bg-sky-100/70 px-1 py-0.5 rounded font-mono text-sky-900">dashboard/</code> para visualizar los gráficos interactivos de carga laboral por área.
          </p>
        </div>
      </div>

      {/* Iframe Card Container (Kawaii Premium Border/Shadow) */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-lg shadow-slate-100/50 overflow-hidden p-2 relative min-h-[600px] flex flex-col">
        {/* Decorative Top Bar */}
        <div className="flex items-center justify-between px-4 py-2 bg-slate-50/50 border-b border-slate-100 rounded-t-2xl">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-400"></span>
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span>
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
            <span className="text-[10px] text-slate-400 font-mono ml-2">Dashboard de Control Ejecutivo</span>
          </div>
          <span className="text-[10px] font-mono text-slate-400 bg-slate-200/50 px-2 py-0.5 rounded-md">localhost:8050</span>
        </div>

        {/* Live Iframe */}
        <div className="flex-1 w-full bg-slate-50/50 relative">
          <iframe
            key={key}
            src={iframeUrl}
            className="w-full h-[550px] border-none rounded-b-2xl"
            title="Python Dash Analytics"
            sandbox="allow-scripts allow-same-origin allow-popups"
          />
        </div>
      </div>
    </div>
  );
};

export default Analisis;
