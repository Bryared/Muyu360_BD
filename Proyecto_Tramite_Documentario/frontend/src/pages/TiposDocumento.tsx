import { useState, useEffect, type FormEvent } from 'react';
import { getTiposDocumento, crearTipoDocumento } from '../services/CatalogosService';
import type { TipoDocumento } from '../types';
import { Layers, FolderPlus, X } from 'lucide-react';

const TiposDocumento = () => {
  const [tipos, setTipos] = useState<TipoDocumento[]>([]);
  const [loading, setLoading] = useState(true);

  // Estados del modal
  const [modalAbierto, setModalAbierto] = useState(false);
  const [nombre, setNombre] = useState('');

  const [message, setMessage] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    cargarTipos();
  }, []);

  const cargarTipos = async () => {
    try {
      const lista = await getTiposDocumento();
      setTipos(lista);
    } catch (error) {
      console.error("Error cargando tipos de documento:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const nuevo = await crearTipoDocumento({ nombre });
      setTipos([...tipos, nuevo]);
      setSuccess(true);
      setMessage('Tipo de documento registrado con éxito');

      setNombre('');
      setModalAbierto(false);
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('Error al registrar el tipo de documento.');
      setSuccess(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-3">
        <div className="w-10 h-10 border-4 border-brand-teal border-t-transparent rounded-full animate-spin"></div>
        <p className="text-sm font-medium text-slate-500 font-mono">Cargando catálogo...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <span className="text-xs font-mono tracking-widest text-slate-500 uppercase font-bold">Catálogos del Sistema</span>
          <h1 className="text-3xl font-serif font-bold text-slate-800">Tipos de Documento</h1>
          <p className="text-xs text-slate-400 mt-1">Configura las categorías de expedientes y folios aceptadas en el trámite documentario.</p>
        </div>
        <button 
          onClick={() => setModalAbierto(true)}
          className="bg-brand-navy hover:bg-slate-800 text-white px-5 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition shadow-md cursor-pointer flex items-center gap-1.5 transform hover:-translate-y-0.5 duration-200"
        >
          <FolderPlus className="w-4 h-4" /> Agregar Tipo
        </button>
      </div>

      {message && (
        <div className={`p-4 rounded-xl border text-xs font-semibold font-mono ${
          success ? 'bg-emerald-50 text-emerald-855 text-emerald-800 border-emerald-200' : 'bg-red-50 text-red-855 text-red-800 border-red-200'
        }`}>
          {message}
        </div>
      )}

      {/* Tabla de Tipos */}
      <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wide">Clasificaciones de Expediente</h3>
          <span className="text-xs font-mono text-slate-500 font-bold bg-slate-200/60 px-2.5 py-1 rounded-md">Total: {tipos.length}</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-100/60 border-b border-slate-200/80 text-slate-500 text-[10px] font-bold uppercase tracking-wider font-mono">
                <th className="p-4 pl-6">ID Tipo</th>
                <th className="p-4">Nombre del Tipo de Documento</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {tipos.map(t => (
                <tr key={t.idTipoDocumento} className="hover:bg-slate-50/75 transition duration-150">
                  <td className="p-4 font-mono font-bold text-slate-400 pl-6 text-xs">
                    #{t.idTipoDocumento}
                  </td>
                  <td className="p-4 text-slate-800 font-bold flex items-center gap-2 text-xs">
                    <span className="p-1 bg-brand-teal/10 text-brand-teal rounded-md border border-brand-teal/15">
                      <Layers className="w-3.5 h-3.5" />
                    </span>
                    {t.nombre}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL REGISTRO TIPO */}
      {modalAbierto && (
        <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white rounded-2xl border border-slate-200 w-full max-w-sm shadow-2xl overflow-hidden animate-scale-up">
            <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wide">Agregar Tipo de Documento</h3>
              <button 
                onClick={() => setModalAbierto(false)}
                className="text-slate-400 hover:text-slate-600 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="p-6 space-y-4">
                <div>
                  <label htmlFor="modal-tipo-nombre" className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Nombre del Tipo</label>
                  <input 
                    id="modal-tipo-nombre"
                    type="text"
                    className="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-xs focus:ring-1 focus:ring-brand-teal focus:border-brand-teal outline-none"
                    placeholder="Ej: Packing List, Certificado Fitosanitario"
                    value={nombre}
                    onChange={e => setNombre(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-2">
                <button 
                  type="button" 
                  onClick={() => setModalAbierto(false)}
                  className="border border-slate-300 text-slate-700 px-4 py-2 rounded-lg text-xs font-bold hover:bg-slate-100 transition cursor-pointer"
                >
                  Cancelar
                </button>
                <button 
                  type="submit" 
                  className="bg-brand-navy hover:bg-slate-800 text-white px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition cursor-pointer"
                >
                  Guardar Tipo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TiposDocumento;
