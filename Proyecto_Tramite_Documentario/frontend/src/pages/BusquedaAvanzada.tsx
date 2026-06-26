import { useState, useEffect } from 'react';
import { getDocumentos } from '../services/DocumentoService';
import { getTiposDocumento } from '../services/CatalogosService';
import type { Documento, TipoDocumento } from '../types';
import { Search, Eye, Filter, RefreshCw } from 'lucide-react';
import { Link } from 'react-router-dom';

const BusquedaAvanzada = () => {
  const [documentos, setDocumentos] = useState<Documento[]>([]);
  const [tipos, setTipos] = useState<TipoDocumento[]>([]);
  const [loading, setLoading] = useState(true);

  // Filtros de búsqueda
  const [filtroTipo, setFiltroTipo] = useState<string>('');
  const [filtroRemitente, setFiltroRemitente] = useState('');
  const [filtroMotivo, setFiltroMotivo] = useState('');
  const [filtroFecha, setFiltroFecha] = useState('');

  const [resultados, setResultados] = useState<Documento[]>([]);

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      const [listaDocs, listaTipos] = await Promise.all([
        getDocumentos(0, 100), // Obtenemos una lista grande para filtrar localmente de manera robusta
        getTiposDocumento()
      ]);
      setDocumentos(listaDocs.content || []);
      setResultados(listaDocs.content || []);
      setTipos(listaTipos);
    } catch (error) {
      console.error("Error cargando datos para búsqueda:", error);
    } finally {
      setLoading(false);
    }
  };

  const realizarBusqueda = () => {
    let filtrados = [...documentos];

    if (filtroTipo) {
      filtrados = filtrados.filter(d => d.idTipoDocumento === parseInt(filtroTipo));
    }

    if (filtroRemitente) {
      filtrados = filtrados.filter(d => 
        d.nombreRemitente.toLowerCase().includes(filtroRemitente.toLowerCase())
      );
    }

    if (filtroMotivo) {
      filtrados = filtrados.filter(d => 
        (d.motivo && d.motivo.toLowerCase().includes(filtroMotivo.toLowerCase())) ||
        (d.asunto && d.asunto.toLowerCase().includes(filtroMotivo.toLowerCase()))
      );
    }

    if (filtroFecha) {
      // Filtrado simple de fecha (YYYY-MM-DD)
      filtrados = filtrados.filter(d => 
        d.fechaRecepcion.startsWith(filtroFecha)
      );
    }

    setResultados(filtrados);
  };

  const limpiarFiltros = () => {
    setFiltroTipo('');
    setFiltroRemitente('');
    setFiltroMotivo('');
    setFiltroFecha('');
    setResultados(documentos);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-3">
        <div className="w-10 h-10 border-4 border-brand-teal border-t-transparent rounded-full animate-spin"></div>
        <p className="text-sm font-medium text-slate-500 font-mono">Cargando buscador...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div>
        <span className="text-xs font-mono tracking-widest text-slate-500 uppercase font-bold">Consultas e Informes</span>
        <h1 className="text-3xl font-serif font-bold text-slate-800">Búsqueda Avanzada</h1>
        <p className="text-xs text-slate-400 mt-1">Realiza filtros avanzados en tiempo real sobre todos los expedientes relacionales de la Mype.</p>
      </div>

      {/* Panel de Filtros */}
      <div className="bg-white p-6 rounded-xl border border-slate-200/85 shadow-sm space-y-5">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
          <span className="p-1 bg-brand-teal-light text-brand-teal rounded">
            <Filter className="w-4 h-4" />
          </span>
          <h3 className="text-sm font-bold text-slate-850 uppercase tracking-wider">Criterios de Filtrado Relacional</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
          <div>
            <label htmlFor="f-tipo-doc" className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Tipo de Documento</label>
            <select 
              id="f-tipo-doc"
              className="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-xs font-semibold focus:ring-1 focus:ring-brand-teal focus:border-brand-teal outline-none cursor-pointer"
              value={filtroTipo}
              onChange={e => setFiltroTipo(e.target.value)}
            >
              <option value="">Todos los Tipos</option>
              {tipos.map(t => (
                <option key={t.idTipoDocumento} value={t.idTipoDocumento}>{t.nombre}</option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="f-rem" className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Remitente</label>
            <input 
              id="f-rem"
              type="text"
              className="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-xs focus:ring-1 focus:ring-brand-teal focus:border-brand-teal outline-none"
              placeholder="Nombre del emisor..."
              value={filtroRemitente}
              onChange={e => setFiltroRemitente(e.target.value)}
            />
          </div>

          <div>
            <label htmlFor="f-mot" className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Motivo / Palabra Clave</label>
            <input 
              id="f-mot"
              type="text"
              className="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-xs focus:ring-1 focus:ring-brand-teal focus:border-brand-teal outline-none"
              placeholder="Ej: fitosanitario, palta..."
              value={filtroMotivo}
              onChange={e => setFiltroMotivo(e.target.value)}
            />
          </div>

          <div>
            <label htmlFor="f-fec" className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Fecha Recepción</label>
            <input 
              id="f-fec"
              type="date"
              className="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-xs focus:ring-1 focus:ring-brand-teal focus:border-brand-teal outline-none cursor-pointer"
              value={filtroFecha}
              onChange={e => setFiltroFecha(e.target.value)}
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
          <button 
            onClick={limpiarFiltros}
            className="flex items-center gap-1 border border-slate-300 text-slate-700 px-4 py-2.5 rounded-lg text-xs font-bold hover:bg-slate-50 transition cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Reajustar Filtros
          </button>
          <button 
            onClick={realizarBusqueda}
            className="bg-brand-navy hover:bg-slate-800 text-white px-5 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition flex items-center gap-1.5 shadow-md cursor-pointer transform hover:-translate-y-0.5 duration-200"
          >
            <Search className="w-4 h-4" /> Ejecutar Consulta
          </button>
        </div>
      </div>

      {/* Resultados */}
      <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wide">Expedientes Coincidentes</h3>
          <span className="text-xs font-mono text-slate-500 font-bold bg-slate-200/60 px-2.5 py-1 rounded-md">Encontrados: {resultados.length}</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-100/60 border-b border-slate-200/80 text-slate-500 text-[10px] font-bold uppercase tracking-wider font-mono">
                <th className="p-4 pl-6">Correlativo</th>
                <th className="p-4">Remitente</th>
                <th className="p-4">Tipo</th>
                <th className="p-4">Motivo / Asunto</th>
                <th className="p-4">Fecha Recepción</th>
                <th className="p-4">Estado</th>
                <th className="p-4 text-center">Trazabilidad</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {resultados.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-12 text-center text-slate-400 font-medium">
                    <div className="text-3xl mb-2">🗂️</div>
                    No se encontraron documentos con los filtros de búsqueda seleccionados.
                  </td>
                </tr>
              ) : (
                resultados.map(doc => (
                  <tr key={doc.idDocumento} className="hover:bg-slate-50/75 transition duration-150">
                    <td className="p-4 font-mono font-bold text-slate-900 pl-6 text-xs">{doc.correlativo}</td>
                    <td className="p-4 text-slate-750 font-medium text-xs">{doc.nombreRemitente}</td>
                    <td className="p-4 text-xs">
                      <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded border border-slate-200 text-[10px] font-bold">
                        {doc.nombreTipoDocumento}
                      </span>
                    </td>
                    <td className="p-4 max-w-xs truncate">
                      <span className="font-semibold text-slate-850 text-xs block truncate">{doc.motivo}</span>
                      {doc.asunto && <span className="text-[10px] text-slate-400 block truncate">{doc.asunto}</span>}
                    </td>
                    <td className="p-4 text-slate-500 font-mono text-xs">
                      {new Date(doc.fechaRecepcion).toLocaleDateString('es-PE', { dateStyle: 'medium' })}
                    </td>
                    <td className="p-4">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                        doc.nombreEstadoDocumento === 'Pendiente' ? 'bg-brand-orange-light text-brand-orange border-brand-orange/20' :
                        doc.nombreEstadoDocumento === 'Respondido' ? 'bg-brand-green-light text-brand-green border-brand-green/20' :
                        doc.nombreEstadoDocumento === 'Archivado' ? 'bg-slate-100 text-slate-600 border-slate-200' :
                        'bg-blue-50 text-blue-700 border-blue-200'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${
                          doc.nombreEstadoDocumento === 'Pendiente' ? 'bg-brand-orange' :
                          doc.nombreEstadoDocumento === 'Respondido' ? 'bg-brand-green' :
                          doc.nombreEstadoDocumento === 'Archivado' ? 'bg-slate-455 bg-slate-400' :
                          'bg-blue-500'
                        }`}></span>
                        {doc.nombreEstadoDocumento}
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      <Link 
                        to={`/seguimiento?correlativo=${doc.correlativo}`}
                        className="inline-flex items-center gap-1 text-xs font-bold text-brand-teal hover:text-brand-teal-hover bg-brand-teal/10 hover:bg-brand-teal/20 border border-brand-teal/20 px-3 py-1.5 rounded-lg transition cursor-pointer"
                        title="Ver Historial de Seguimiento"
                      >
                        <Eye className="w-4 h-4" /> Auditar
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default BusquedaAvanzada;
