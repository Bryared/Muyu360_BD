import { useEffect, useState } from 'react';
import { getDocumentos } from '../services/DocumentoService';
import type { Documento, Empleado } from '../types';
import { FileText, Inbox, CheckCircle, AlertTriangle, ArrowRight, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

interface BandejaEntradaProps {
  usuario: Empleado;
}

const BandejaEntrada = ({ usuario }: BandejaEntradaProps) => {
  const [documentos, setDocumentos] = useState<Documento[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDocumentos();
  }, []);

  const fetchDocumentos = async () => {
    try {
      const data = await getDocumentos(0, 20);
      setDocumentos(data.content || []);
    } catch (error) {
      console.error("Error fetching documentos:", error);
    } finally {
      setLoading(false);
    }
  };

  const total = documentos.length;
  const pendientes = documentos.filter(d => d.nombreEstadoDocumento === 'Pendiente').length;
  const respondidos = documentos.filter(d => d.nombreEstadoDocumento === 'Respondido').length;
  const urgentes = documentos.filter(d => d.requiereRespuesta && d.nombreEstadoDocumento === 'Pendiente').length;

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-3">
        <div className="w-10 h-10 border-4 border-brand-teal border-t-transparent rounded-full animate-spin"></div>
        <p className="text-sm font-medium text-slate-500 font-mono">Cargando panel de control...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Dynamic Academic & Professional Welcome Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-brand-navy to-slate-900 rounded-2xl p-6 md:p-8 text-white relative overflow-hidden border border-slate-800 shadow-lg">
        {/* Subtle background graphics */}
        <div className="absolute right-0 bottom-0 w-80 h-80 bg-brand-teal/5 rounded-full blur-3xl pointer-events-none"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono bg-brand-teal/15 text-brand-teal border border-brand-teal/20 px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider">
                MuyuAgro Operaciones
              </span>
              <span className="flex items-center gap-1 text-[10px] font-mono text-brand-green bg-brand-green/10 px-2 py-0.5 rounded-full border border-brand-green/20 font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-green animate-pulse"></span> Sistema Activo
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
              ¡Bienvenido, {usuario.nombre} {usuario.apellidos}!
            </h1>
            <p className="text-xs text-slate-300 max-w-xl leading-relaxed">
              Sesión iniciada como <b className="text-brand-teal">{usuario.cargo.nombre}</b> en el área de <b className="text-brand-teal">{usuario.area?.nombre || 'General'}</b>. 
              Monitorea, deriva y responde documentos para garantizar la trazabilidad de agroexportación de la Mype.
            </p>
          </div>
          
          <Link 
            to="/registro" 
            className="self-start md:self-auto bg-brand-teal hover:bg-brand-teal-hover text-slate-950 px-5 py-3 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-md shadow-brand-teal/15 cursor-pointer transform hover:-translate-y-0.5 duration-200"
          >
            + Registrar Trámite
          </Link>
        </div>
      </div>

      {/* KPIs Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-sm flex items-center gap-4 transition duration-300 hover:border-slate-300 hover:shadow-md">
          <div className="bg-brand-teal-light p-3.5 rounded-xl text-brand-teal border border-brand-teal/10">
            <Inbox className="w-5 h-5" />
          </div>
          <div>
            <div className="text-2xl font-mono font-bold text-slate-900">{total}</div>
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Recibidos</div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-sm flex items-center gap-4 transition duration-300 hover:border-slate-300 hover:shadow-md">
          <div className="bg-brand-orange-light p-3.5 rounded-xl text-brand-orange border border-brand-orange/10">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <div className="text-2xl font-mono font-bold text-slate-900">{pendientes}</div>
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Pendientes</div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-sm flex items-center gap-4 transition duration-300 hover:border-slate-300 hover:shadow-md">
          <div className="bg-brand-green-light p-3.5 rounded-xl text-brand-green border border-brand-green/10">
            <CheckCircle className="w-5 h-5" />
          </div>
          <div>
            <div className="text-2xl font-mono font-bold text-slate-900">{respondidos}</div>
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Respondidos</div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-sm flex items-center gap-4 transition duration-300 hover:border-slate-300 hover:shadow-md">
          <div className="bg-red-50 p-3.5 rounded-xl text-red-600 border border-red-100">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <div className="text-2xl font-mono font-bold text-slate-900">{urgentes}</div>
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Urgentes S/R</div>
          </div>
        </div>

      </div>

      {/* Recent Documents Table Section */}
      <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm overflow-hidden transition duration-300 hover:border-slate-300">
        <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <div className="flex items-center gap-2">
            <span className="p-1 bg-slate-200/70 text-slate-600 rounded-md">
              <FileText className="w-4 h-4" />
            </span>
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wide">Trámites Recientes en la Mype</h3>
          </div>
          <Link 
            to="/busqueda" 
            className="text-xs font-bold text-brand-teal hover:text-brand-teal-hover flex items-center gap-1 transition"
          >
            Búsqueda Avanzada <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-100/60 border-b border-slate-200/80 text-slate-500 text-[10px] font-bold uppercase tracking-wider font-mono">
                <th className="p-4 pl-6">Correlativo</th>
                <th className="p-4">Tipo</th>
                <th className="p-4">Remitente</th>
                <th className="p-4">Motivo / Asunto</th>
                <th className="p-4">Fecha Recepción</th>
                <th className="p-4 text-center">Estado</th>
                <th className="p-4 text-center">Trazabilidad</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {documentos.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-10 text-center text-slate-400 font-medium">
                    No se registran trámites documentarios en la base de datos.
                  </td>
                </tr>
              ) : (
                documentos.map(doc => (
                  <tr key={doc.idDocumento} className="hover:bg-slate-50/75 transition duration-150">
                    <td className="p-4 font-mono font-bold text-slate-900 pl-6 text-xs">{doc.correlativo}</td>
                    <td className="p-4 text-slate-600 text-xs">
                      <span className="bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded border border-slate-200 text-[11px] font-semibold">
                        {doc.nombreTipoDocumento}
                      </span>
                    </td>
                    <td className="p-4 text-slate-700 font-medium text-xs">{doc.nombreRemitente}</td>
                    <td className="p-4 max-w-xs truncate">
                      <span className="font-semibold text-slate-800 text-xs block">{doc.motivo}</span>
                      {doc.asunto && <span className="text-[10px] text-slate-400 block truncate">{doc.asunto}</span>}
                    </td>
                    <td className="p-4 text-slate-500 font-mono text-xs">
                      {new Date(doc.fechaRecepcion).toLocaleString('es-PE', { dateStyle: 'medium', timeStyle: 'short' })}
                    </td>
                    <td className="p-4 text-center">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                        doc.nombreEstadoDocumento === 'Pendiente' ? 'bg-brand-orange-light text-brand-orange border-brand-orange/20' :
                        doc.nombreEstadoDocumento === 'Respondido' ? 'bg-brand-green-light text-brand-green border-brand-green/20' :
                        doc.nombreEstadoDocumento === 'Archivado' ? 'bg-slate-100 text-slate-600 border-slate-200' :
                        'bg-blue-50 text-blue-700 border-blue-200'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${
                          doc.nombreEstadoDocumento === 'Pendiente' ? 'bg-brand-orange' :
                          doc.nombreEstadoDocumento === 'Respondido' ? 'bg-brand-green' :
                          doc.nombreEstadoDocumento === 'Archivado' ? 'bg-slate-400' :
                          'bg-blue-500'
                        }`}></span>
                        {doc.nombreEstadoDocumento}
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      <Link 
                        to={`/seguimiento?correlativo=${doc.correlativo}`}
                        className="inline-flex items-center gap-1 text-xs font-bold text-brand-teal hover:text-brand-teal-hover bg-brand-teal/10 hover:bg-brand-teal/20 border border-brand-teal/20 px-2.5 py-1 rounded-lg transition cursor-pointer"
                      >
                        Auditar
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

export default BandejaEntrada;
