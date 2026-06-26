import { useState, useEffect, type FormEvent } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getDocumentos } from '../services/DocumentoService';
import { getDerivacionesByDocumento, crearDerivacion } from '../services/DerivacionService';
import { getEmpleados } from '../services/EmpleadoService';
import { getTiposRespuesta, crearRespuesta } from '../services/RespuestaService';
import type { Documento, Derivacion, Empleado, TipoRespuesta } from '../types';
import { Search, Send, Clock, User, ArrowRight, CornerDownRight, CheckCircle, AlertCircle } from 'lucide-react';

interface SeguimientoDocumentoProps {
  usuario: Empleado;
}

const SeguimientoDocumento = ({ usuario }: SeguimientoDocumentoProps) => {
  const [searchParams] = useSearchParams();
  const [correlativoBusqueda, setCorrelativoBusqueda] = useState('');
  const [documento, setDocumento] = useState<Documento | null>(null);
  const [timeline, setTimeline] = useState<Derivacion[]>([]);
  const [empleados, setEmpleados] = useState<Empleado[]>([]);
  const [tiposRespuesta, setTiposRespuesta] = useState<TipoRespuesta[]>([]);
  const [error, setError] = useState('');

  // Formulario de nueva derivación (idEmpOrigen se bloquea al usuario logueado)
  const [idEmpDestino, setIdEmpDestino] = useState<number>(2);
  const [instrucciones, setInstrucciones] = useState('');
  const [derivacionSuccess, setDerivacionSuccess] = useState('');

  // Formulario de respuesta oficial (idEmpAutor se bloquea al usuario logueado)
  const [idTipoRespuesta, setIdTipoRespuesta] = useState<number>(1);
  const [descRespuesta, setDescRespuesta] = useState('');
  const [respuestaSuccess, setRespuestaSuccess] = useState('');

  useEffect(() => {
    cargarEmpleados();
    cargarTiposRespuesta();
    const corr = searchParams.get('correlativo');
    if (corr) {
      setCorrelativoBusqueda(corr);
      buscarPorCorrelativo(corr);
    }
  }, [searchParams]);

  const cargarEmpleados = async () => {
    try {
      const lista = await getEmpleados();
      setEmpleados(lista);
      if (lista.length > 0) {
        const otroEmpleado = lista.find(e => e.idEmpleado !== usuario.idEmpleado);
        if (otroEmpleado) {
          setIdEmpDestino(otroEmpleado.idEmpleado);
        } else {
          setIdEmpDestino(lista[0].idEmpleado);
        }
      }
    } catch (error) {
      console.error("Error cargando empleados:", error);
    }
  };

  const cargarTiposRespuesta = async () => {
    try {
      const lista = await getTiposRespuesta();
      setTiposRespuesta(lista);
      if (lista.length > 0) {
        setIdTipoRespuesta(lista[0].idTipoRespuesta);
      }
    } catch (error) {
      console.error("Error cargando tipos de respuesta:", error);
    }
  };

  const buscarPorCorrelativo = async (corr: string) => {
    if (!corr.trim()) return;
    setError('');
    setDocumento(null);
    setTimeline([]);
    try {
      const data = await getDocumentos(0, 100);
      const docs: Documento[] = data.content || [];
      const encontrado = docs.find(d => d.correlativo.toLowerCase() === corr.trim().toLowerCase());
      
      if (encontrado) {
        setDocumento(encontrado);
        const movimientos = await getDerivacionesByDocumento(encontrado.idDocumento);
        setTimeline(movimientos);
      } else {
        setError('No se encontró ningún documento con ese código correlativo.');
      }
    } catch (err) {
      setError('Error al conectar con el servidor.');
    }
  };

  const handleBuscar = (e: FormEvent) => {
    e.preventDefault();
    buscarPorCorrelativo(correlativoBusqueda);
  };

  const handleDerivar = async (e: FormEvent) => {
    e.preventDefault();
    if (!documento) return;
    try {
      await crearDerivacion({
        idDocumento: documento.idDocumento,
        emisorId: usuario.idEmpleado, // Emisor bloqueado al usuario logueado
        receptorId: idEmpDestino,
        instrucciones
      });
      setDerivacionSuccess('Documento derivado con éxito');
      setInstrucciones('');
      const movimientos = await getDerivacionesByDocumento(documento.idDocumento);
      setTimeline(movimientos);
      setTimeout(() => setDerivacionSuccess(''), 3000);
    } catch (err) {
      setError('Error al registrar la nueva derivación.');
    }
  };

  const handleRegistrarRespuesta = async (e: FormEvent) => {
    e.preventDefault();
    if (!documento) return;
    try {
      await crearRespuesta({
        idDocumento: documento.idDocumento,
        idTipoRespuesta,
        idEmpleadoAutor: usuario.idEmpleado, // Autor bloqueado al usuario logueado
        descripcion: descRespuesta
      });
      setRespuestaSuccess('Respuesta registrada con éxito. El trámite se ha resuelto y archivado.');
      setDescRespuesta('');
      buscarPorCorrelativo(documento.correlativo);
      setTimeout(() => setRespuestaSuccess(''), 3000);
    } catch (err) {
      setError('Error al registrar la respuesta en el sistema.');
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div>
        <span className="text-xs font-mono tracking-widest text-slate-500 uppercase font-bold">Trazabilidad de Trámite</span>
        <h1 className="text-3xl font-serif font-bold text-slate-800">Seguimiento de Documento</h1>
        <p className="text-xs text-slate-400 mt-1">Consulta el historial completo de derivaciones y añade proveídos o respuestas relacionales.</p>
      </div>

      {/* Buscador */}
      <form onSubmit={handleBuscar} className="bg-white p-6 rounded-xl border border-slate-200/80 shadow-sm">
        <div className="flex flex-col sm:flex-row gap-4 items-end">
          <div className="flex-1 w-full">
            <label htmlFor="bus-corr" className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
              Buscar por Código Correlativo
            </label>
            <input 
              id="bus-corr"
              type="text"
              className="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-sm focus:ring-1 focus:ring-brand-teal focus:border-brand-teal outline-none"
              placeholder="Ej: DOC-2026-0001"
              value={correlativoBusqueda}
              onChange={e => setCorrelativoBusqueda(e.target.value)}
              required
            />
          </div>
          <button 
            type="submit"
            className="w-full sm:w-auto bg-brand-navy hover:bg-slate-850 text-white px-6 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition flex items-center justify-center gap-1.5 h-[42px] shadow-md cursor-pointer"
          >
            <Search className="w-4 h-4" /> Buscar Historial
          </button>
        </div>
        {error && (
          <div className="flex items-center gap-1.5 text-red-600 text-xs font-semibold mt-3">
            <AlertCircle className="w-4 h-4" />
            <span>{error}</span>
          </div>
        )}
      </form>

      {/* Timeline y Detalles */}
      {documento && (
        <div className="space-y-6">
          {/* Detalles del Documento */}
          <div className="bg-gradient-to-r from-slate-900 via-brand-navy to-slate-900 text-white p-6 rounded-xl shadow-lg flex flex-col md:flex-row justify-between items-start md:items-center gap-5 border border-slate-850">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="text-[9px] font-mono tracking-wider text-brand-teal uppercase bg-brand-teal/15 px-2 py-0.5 rounded border border-brand-teal/25 font-bold">
                  EXPEDIENTE RELACIONAL
                </span>
                <span className="text-[10px] font-mono text-slate-400">
                  {documento.nombreTipoDocumento}
                </span>
              </div>
              <h2 className="text-2xl font-mono font-bold text-white tracking-tight">{documento.correlativo}</h2>
              <p className="text-slate-300 text-xs">
                <b>Remitente:</b> {documento.nombreRemitente} <span className="text-slate-500">|</span> <b>Asunto:</b> {documento.motivo}
              </p>
            </div>
            
            <div className="bg-slate-950/55 px-4 py-2.5 rounded-xl border border-slate-850 self-stretch md:self-auto flex flex-col justify-center">
              <span className="text-[9px] block text-slate-500 font-mono uppercase tracking-wider">Estado de Expediente</span>
              <span className={`font-bold text-xs uppercase tracking-wide mt-0.5 ${
                documento.nombreEstadoDocumento === 'Respondido' ? 'text-brand-green' : 'text-brand-orange'
              }`}>
                {documento.nombreEstadoDocumento}
              </span>
            </div>
          </div>

          {/* Línea de Tiempo */}
          <div className="bg-white p-6 rounded-xl border border-slate-200/80 shadow-sm">
            <h3 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-3 mb-6 flex items-center gap-2 uppercase tracking-wide">
              <span className="p-1 bg-brand-teal-light text-brand-teal rounded">
                <Clock className="w-4 h-4" />
              </span>
              Historial de Derivaciones (Flujo de Procesos)
            </h3>

            {timeline.length === 0 ? (
              <p className="text-slate-400 text-xs text-center py-8 font-medium">Este documento no registra movimientos o derivaciones previas.</p>
            ) : (
              <div className="relative border-l-2 border-slate-200 ml-4 space-y-8 pb-4">
                {timeline.map((mov) => (
                  <div key={mov.idDerivacion} className="relative pl-6">
                    {/* Punto del Timeline */}
                    <span className="absolute -left-[11px] top-1 bg-brand-teal border-4 border-white w-5 h-5 rounded-full shadow-md"></span>
                    
                    <div className="space-y-1.5">
                      <span className="text-[10px] font-mono text-slate-500 bg-slate-100 px-2 py-0.5 rounded border border-slate-200 font-semibold">
                        {new Date(mov.fechaDerivacion).toLocaleString('es-PE', { dateStyle: 'medium', timeStyle: 'short' })}
                      </span>
                      
                      <h4 className="text-xs font-bold text-slate-850 mt-1.5 flex items-center gap-2 flex-wrap uppercase tracking-wide">
                        <User className="w-3.5 h-3.5 text-slate-400" />
                        <span>{mov.emisor.nombre} {mov.emisor.apellidos} ({mov.emisor.cargo.nombre})</span>
                        <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                        <span className="text-brand-teal">{mov.receptor.nombre} {mov.receptor.apellidos} ({mov.receptor.cargo.nombre})</span>
                      </h4>
                      
                      <div className="bg-slate-50/80 p-3 rounded-lg border border-slate-200/60 text-xs text-slate-750 flex gap-2.5 items-start max-w-2xl mt-2">
                        <CornerDownRight className="w-3.5 h-3.5 text-slate-400 flex-shrink-0 mt-0.5" />
                        <div>
                          <b className="text-slate-800 text-[10px] font-mono block uppercase tracking-widest">Proveído / Instrucción de Despacho:</b>
                          <p className="mt-1 text-slate-600 font-medium leading-relaxed">{mov.instrucciones || 'Sin instrucciones adicionales.'}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Formulario de Registro de Respuesta (Resolver Trámite) */}
          {documento.requiereRespuesta && documento.nombreEstadoDocumento !== 'Respondido' && documento.nombreEstadoDocumento !== 'Archivado' && (
            <div className="bg-white p-6 rounded-xl border border-slate-200/80 shadow-sm space-y-4">
              <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2 border-b border-slate-100 pb-3 uppercase tracking-wide">
                <span className="p-1 bg-brand-green-light text-brand-green rounded">
                  <CheckCircle className="w-4 h-4" />
                </span>
                Registrar Respuesta Oficial (Resolver Trámite)
              </h3>
              
              {respuestaSuccess && (
                <div className="bg-emerald-50 text-emerald-800 border border-emerald-200 p-3 rounded-lg text-xs font-semibold font-mono">
                  {respuestaSuccess}
                </div>
              )}

              <form onSubmit={handleRegistrarRespuesta} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="resp-tipo" className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Tipo de Respuesta</label>
                  <select 
                    id="resp-tipo"
                    className="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-xs font-semibold focus:ring-1 focus:ring-brand-teal focus:border-brand-teal outline-none cursor-pointer"
                    value={idTipoRespuesta}
                    onChange={e => setIdTipoRespuesta(parseInt(e.target.value))}
                  >
                    {tiposRespuesta.map(tr => (
                      <option key={tr.idTipoRespuesta} value={tr.idTipoRespuesta}>{tr.nombre}</option>
                    ))}
                  </select>
                </div>

                {/* Locked Firmado por Box */}
                <div className="space-y-1.5">
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                    Firmado por (Autor de Respuesta)
                  </label>
                  <div className="bg-slate-50 border border-slate-200/60 p-2 rounded-lg flex items-center gap-2.5 h-[38px]">
                    <User className="w-3.5 h-3.5 text-slate-400" />
                    <span className="text-xs font-bold text-slate-700 truncate">
                      {usuario.nombre} {usuario.apellidos} ({usuario.cargo.nombre})
                    </span>
                  </div>
                </div>

                <div className="md:col-span-2">
                  <label htmlFor="resp-desc" className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Descripción de la Respuesta (Fallo / Solución)</label>
                  <textarea 
                    id="resp-desc"
                    className="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-xs focus:ring-1 focus:ring-brand-teal focus:border-brand-teal outline-none h-24"
                    placeholder="Describe detalladamente los términos oficiales de la respuesta o resolución..."
                    value={descRespuesta}
                    onChange={e => setDescRespuesta(e.target.value)}
                    required
                  />
                </div>

                <div className="md:col-span-2 flex justify-end">
                  <button 
                    type="submit" 
                    className="bg-brand-green hover:bg-brand-green/90 text-slate-950 px-5 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition shadow-md cursor-pointer transform hover:-translate-y-0.5 duration-200"
                  >
                    Resolver y Archivar Expediente
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Formulario de Derivación Extra */}
          {documento.nombreEstadoDocumento !== 'Respondido' && documento.nombreEstadoDocumento !== 'Archivado' && (
            <div className="bg-white p-6 rounded-xl border border-slate-200/80 shadow-sm space-y-4">
              <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2 border-b border-slate-100 pb-3 uppercase tracking-wide">
                <span className="p-1 bg-brand-teal-light text-brand-teal rounded">
                  <Send className="w-4 h-4" />
                </span>
                Derivar Documento (Agregar Movimiento Relacional)
              </h3>
              
              {derivacionSuccess && (
                <div className="bg-emerald-50 text-emerald-800 border border-emerald-200 p-3 rounded-lg text-xs font-semibold font-mono">
                  {derivacionSuccess}
                </div>
              )}

              <form onSubmit={handleDerivar} className="grid grid-cols-1 md:grid-cols-2 gap-5">
                
                {/* Locked Origen Box */}
                <div className="space-y-1.5">
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                    Origen de Derivación
                  </label>
                  <div className="bg-slate-50 border border-slate-200/60 p-2 rounded-lg flex items-center gap-2.5 h-[38px]">
                    <User className="w-3.5 h-3.5 text-slate-400" />
                    <span className="text-xs font-bold text-slate-700 truncate">
                      {usuario.nombre} {usuario.apellidos} ({usuario.cargo.nombre})
                    </span>
                  </div>
                </div>

                {/* Destination Selector */}
                <div>
                  <label htmlFor="seg-dest" className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Derivar a (Empleado Destino)</label>
                  <select 
                    id="seg-dest"
                    className="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-xs font-semibold focus:ring-1 focus:ring-brand-teal focus:border-brand-teal outline-none cursor-pointer"
                    value={idEmpDestino}
                    onChange={e => setIdEmpDestino(parseInt(e.target.value))}
                  >
                    {empleados.map(emp => (
                      <option key={emp.idEmpleado} value={emp.idEmpleado}>
                        {emp.nombre} {emp.apellidos} — {emp.cargo.nombre} ({emp.area?.nombre})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label htmlFor="seg-inst" className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Proveído / Instrucciones de Despacho</label>
                  <input 
                    id="seg-inst"
                    type="text"
                    className="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-xs focus:ring-1 focus:ring-brand-teal focus:border-brand-teal outline-none"
                    placeholder="Ej: Archivar trámite de aduanas / Proceder con revisión fitosanitaria"
                    value={instrucciones}
                    onChange={e => setInstrucciones(e.target.value)}
                    required
                  />
                </div>

                <div className="md:col-span-2 flex justify-end">
                  <button 
                    type="submit" 
                    className="bg-brand-navy hover:bg-slate-800 text-white px-5 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition shadow-md cursor-pointer transform hover:-translate-y-0.5 duration-200"
                  >
                    Registrar Movimiento
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SeguimientoDocumento;
