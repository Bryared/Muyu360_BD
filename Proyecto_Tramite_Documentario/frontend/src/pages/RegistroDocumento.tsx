import { useState, useEffect, type FormEvent } from 'react';
import { crearDocumento } from '../services/DocumentoService';
import { getTiposDocumento, getRemitentes, crearRemitente } from '../services/CatalogosService';
import { getEmpleados } from '../services/EmpleadoService';
import { crearDerivacion } from '../services/DerivacionService';
import type { TipoDocumento, Remitente, Empleado } from '../types';
import { FileText, UserPlus, Send, Check, AlertTriangle, User } from 'lucide-react';

interface RegistroDocumentoProps {
  usuario: Empleado;
}

const RegistroDocumento = ({ usuario }: RegistroDocumentoProps) => {
  // Catálogos desde el backend
  const [tipos, setTipos] = useState<TipoDocumento[]>([]);
  const [remitentes, setRemitentes] = useState<Remitente[]>([]);
  const [empleados, setEmpleados] = useState<Empleado[]>([]);

  // Estados del formulario principal
  const [idTipoDoc, setIdTipoDoc] = useState<number>(1);
  const [idRemitente, setIdRemitente] = useState<number>(1);
  const [motivo, setMotivo] = useState('');
  const [asunto, setAsunto] = useState('');
  const [requiereRespuesta, setRequiereRespuesta] = useState(true);
  const [observaciones, setObservaciones] = useState('');

  // Primer movimiento (Derivación inicial)
  const [idEmpDestino, setIdEmpDestino] = useState<number>(2);
  const [instrucciones, setInstrucciones] = useState('Recepción y registro inicial');

  // Estado para registro de remitente nuevo al vuelo
  const [creandoNuevoRemitente, setCreandoNuevoRemitente] = useState(false);
  const [nuevoRemitente, setNuevoRemitente] = useState({
    nombreInstitucion: '',
    tipoEntidad: 'Estado',
    rucDni: '',
    correoContacto: '',
    telefono: ''
  });

  const [message, setMessage] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    cargarCatalogos();
  }, []);

  const cargarCatalogos = async () => {
    try {
      const [listaTipos, listaRemitentes, listaEmpleados] = await Promise.all([
        getTiposDocumento(),
        getRemitentes(),
        getEmpleados()
      ]);
      setTipos(listaTipos);
      setRemitentes(listaRemitentes);
      setEmpleados(listaEmpleados);

      // Valores por defecto
      if (listaTipos.length > 0) setIdTipoDoc(listaTipos[0].idTipoDocumento);
      if (listaRemitentes.length > 0) setIdRemitente(listaRemitentes[0].idRemitente);
      
      // Filtrar empleados que no sean el logueado para el destino inicial, o por defecto el siguiente
      if (listaEmpleados.length > 0) {
        const otroEmpleado = listaEmpleados.find(e => e.idEmpleado !== usuario.idEmpleado);
        if (otroEmpleado) {
          setIdEmpDestino(otroEmpleado.idEmpleado);
        } else {
          setIdEmpDestino(listaEmpleados[0].idEmpleado);
        }
      }
    } catch (error) {
      console.error("Error cargando catálogos:", error);
    }
  };

  const handleCrearRemitente = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const creado = await crearRemitente(nuevoRemitente);
      setRemitentes([...remitentes, creado]);
      setIdRemitente(creado.idRemitente);
      setCreandoNuevoRemitente(false);
      setNuevoRemitente({
        nombreInstitucion: '',
        tipoEntidad: 'Estado',
        rucDni: '',
        correoContacto: '',
        telefono: ''
      });
      setMessage('Remitente registrado y seleccionado con éxito');
      setSuccess(true);
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('Error al registrar nuevo remitente. Verifica si el RUC/DNI ya existe.');
      setSuccess(false);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      // 1. Registrar documento
      const docCreado = await crearDocumento({
        idRemitente,
        idTipoDocumento: idTipoDoc,
        motivo,
        asunto,
        requiereRespuesta,
        observaciones
      });

      // 2. Registrar primer movimiento (derivación) usando el ID del usuario logueado
      await crearDerivacion({
        idDocumento: docCreado.idDocumento,
        emisorId: usuario.idEmpleado,
        receptorId: idEmpDestino,
        instrucciones
      });

      setMessage(`Documento registrado y derivado con éxito. Correlativo generado: ${docCreado.correlativo}`);
      setSuccess(true);
      
      // Limpiar formulario
      setMotivo('');
      setAsunto('');
      setObservaciones('');
    } catch (error) {
      setMessage('Error al registrar el documento en el sistema.');
      setSuccess(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <span className="text-xs font-mono tracking-widest text-slate-500 uppercase font-bold">Mesa de Partes Virtual</span>
        <h1 className="text-3xl font-serif font-bold text-slate-800">Registrar Nuevo Trámite</h1>
        <p className="text-xs text-slate-400 mt-1">Ingresa los metadatos del documento y realiza la derivación correspondiente en la Mype.</p>
      </div>

      {message && (
        <div className={`p-4 rounded-xl border flex items-center gap-3 transition-all ${
          success 
            ? 'bg-emerald-50 text-emerald-800 border-emerald-200' 
            : 'bg-red-50 text-red-850 border-red-200'
        }`}>
          {success ? <Check className="w-5 h-5 flex-shrink-0 text-brand-green" /> : <AlertTriangle className="w-5 h-5 flex-shrink-0 text-brand-orange" />}
          <span className="text-xs font-semibold font-mono">{message}</span>
        </div>
      )}

      {/* Sección Remitente Nuevo (Inline Toggle) */}
      <div className="bg-white p-6 rounded-xl border border-slate-200/80 shadow-sm space-y-4">
        <div className="flex justify-between items-center border-b border-slate-100 pb-3">
          <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wide flex items-center gap-2">
            <span className="p-1 bg-brand-teal-light text-brand-teal rounded">
              <UserPlus className="w-4 h-4" />
            </span>
            Remitente del Documento
          </h3>
          <button 
            type="button"
            className="text-xs font-bold text-brand-teal hover:text-brand-teal-hover transition cursor-pointer"
            onClick={() => setCreandoNuevoRemitente(!creandoNuevoRemitente)}
          >
            {creandoNuevoRemitente ? "Seleccionar Remitente Existente" : "+ Registrar Nuevo Remitente"}
          </button>
        </div>

        {creandoNuevoRemitente ? (
          <form onSubmit={handleCrearRemitente} className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50 p-5 rounded-xl border border-slate-200/60">
            <div className="md:col-span-2">
              <label htmlFor="rem-nombre" className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Nombre o Razón Social</label>
              <input 
                id="rem-nombre"
                type="text" 
                className="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-sm focus:ring-1 focus:ring-brand-teal focus:border-brand-teal outline-none transition"
                placeholder="Ej: SENASA / MIDAGRI / AgroLogistics SAC"
                value={nuevoRemitente.nombreInstitucion}
                onChange={e => setNuevoRemitente({...nuevoRemitente, nombreInstitucion: e.target.value})}
                required
              />
            </div>
            <div>
              <label htmlFor="rem-tipo" className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Tipo de Entidad</label>
              <select 
                id="rem-tipo"
                className="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-sm focus:ring-1 focus:ring-brand-teal focus:border-brand-teal outline-none cursor-pointer"
                value={nuevoRemitente.tipoEntidad}
                onChange={e => setNuevoRemitente({...nuevoRemitente, tipoEntidad: e.target.value})}
              >
                <option>Estado</option>
                <option>Proveedor</option>
                <option>Cliente</option>
                <option>Persona Natural</option>
              </select>
            </div>
            <div>
              <label htmlFor="rem-doc" className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">RUC / DNI</label>
              <input 
                id="rem-doc"
                type="text" 
                className="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-sm focus:ring-1 focus:ring-brand-teal focus:border-brand-teal outline-none"
                placeholder="Identificación fiscal"
                value={nuevoRemitente.rucDni}
                onChange={e => setNuevoRemitente({...nuevoRemitente, rucDni: e.target.value})}
                required
              />
            </div>
            <div>
              <label htmlFor="rem-correo" className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Correo Electrónico</label>
              <input 
                id="rem-correo"
                type="email" 
                className="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-sm focus:ring-1 focus:ring-brand-teal focus:border-brand-teal outline-none"
                placeholder="correo@ejemplo.com"
                value={nuevoRemitente.correoContacto}
                onChange={e => setNuevoRemitente({...nuevoRemitente, correoContacto: e.target.value})}
              />
            </div>
            <div>
              <label htmlFor="rem-tel" className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Teléfono</label>
              <input 
                id="rem-tel"
                type="text" 
                className="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-sm focus:ring-1 focus:ring-brand-teal focus:border-brand-teal outline-none"
                placeholder="999888777"
                value={nuevoRemitente.telefono}
                onChange={e => setNuevoRemitente({...nuevoRemitente, telefono: e.target.value})}
              />
            </div>
            <div className="md:col-span-2 flex justify-end">
              <button 
                type="submit" 
                className="bg-brand-teal hover:bg-brand-teal-hover text-slate-950 px-4 py-2 rounded-lg text-xs font-bold transition shadow-sm cursor-pointer"
              >
                Guardar y Seleccionar
              </button>
            </div>
          </form>
        ) : (
          <div>
            <label htmlFor="select-rem" className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Seleccionar Remitente</label>
            <select 
              id="select-rem"
              className="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-sm focus:ring-1 focus:ring-brand-teal focus:border-brand-teal outline-none cursor-pointer"
              value={idRemitente}
              onChange={e => setIdRemitente(parseInt(e.target.value))}
            >
              {remitentes.map(r => (
                <option key={r.idRemitente} value={r.idRemitente}>
                  {r.nombreInstitucion} ({r.tipoEntidad}) — RUC/DNI: {r.rucDni || 'N/A'}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Formulario Principal */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Datos del Documento */}
        <div className="bg-white p-6 rounded-xl border border-slate-200/80 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wide flex items-center gap-2 border-b border-slate-100 pb-3">
            <span className="p-1 bg-brand-teal-light text-brand-teal rounded">
              <FileText className="w-4 h-4" />
            </span>
            Detalles del Documento (Ficha Relacional)
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="select-tipo" className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Tipo de Documento</label>
              <select 
                id="select-tipo"
                className="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-sm focus:ring-1 focus:ring-brand-teal focus:border-brand-teal outline-none cursor-pointer"
                value={idTipoDoc}
                onChange={e => setIdTipoDoc(parseInt(e.target.value))}
              >
                {tipos.map(t => (
                  <option key={t.idTipoDocumento} value={t.idTipoDocumento}>{t.nombre}</option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="reg-motivo-doc" className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Motivo / Resumen</label>
              <input 
                id="reg-motivo-doc"
                type="text"
                className="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-sm focus:ring-1 focus:ring-brand-teal focus:border-brand-teal outline-none"
                placeholder="Ej: Solicitud de Certificado Fitosanitario Lote A"
                value={motivo}
                onChange={e => setMotivo(e.target.value)}
                required
              />
            </div>

            <div className="md:col-span-2">
              <label htmlFor="reg-asunto" className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Asunto / Contenido Detallado</label>
              <textarea 
                id="reg-asunto"
                className="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-sm focus:ring-1 focus:ring-brand-teal focus:border-brand-teal outline-none h-24"
                placeholder="Escribe los detalles o términos claves descritos en el documento..."
                value={asunto}
                onChange={e => setAsunto(e.target.value)}
              />
            </div>

            <div className="flex items-center gap-2 md:col-span-2 py-1">
              <input 
                type="checkbox" 
                id="requiere-r"
                checked={requiereRespuesta}
                onChange={e => setRequiereRespuesta(e.target.checked)}
                className="w-4 h-4 text-slate-900 border-slate-300 rounded focus:ring-brand-teal focus:ring-1 cursor-pointer"
              />
              <label htmlFor="requiere-r" className="text-xs font-bold text-slate-700 select-none uppercase tracking-wide cursor-pointer">
                Requiere Respuesta Obligatoria (Auditable)
              </label>
            </div>

            <div className="md:col-span-2">
              <label htmlFor="reg-obs" className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Observaciones Adicionales</label>
              <input 
                id="reg-obs"
                type="text"
                className="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-sm focus:ring-1 focus:ring-brand-teal focus:border-brand-teal outline-none"
                placeholder="Ej: Adjunta copia digital de aduanas"
                value={observaciones}
                onChange={e => setObservaciones(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Primer Movimiento (Derivación) */}
        <div className="bg-white p-6 rounded-xl border border-slate-200/80 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wide flex items-center gap-2 border-b border-slate-100 pb-3">
            <span className="p-1 bg-brand-teal-light text-brand-teal rounded">
              <Send className="w-4 h-4" />
            </span>
            Primer Movimiento (Derivación Inicial)
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            
            {/* Origin User locked to the logged-in employee */}
            <div className="space-y-1.5">
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                Registrado por (Origen de Trámite)
              </label>
              <div className="bg-slate-50/80 border border-slate-200/60 p-3 rounded-lg flex items-center gap-3">
                <div className="p-2 bg-brand-navy/10 text-brand-navy rounded-lg border border-brand-navy/15">
                  <User className="w-4 h-4" />
                </div>
                <div>
                  <span className="block text-xs font-bold text-slate-850">{usuario.nombre} {usuario.apellidos}</span>
                  <span className="block text-[9px] font-mono text-slate-400 uppercase tracking-wider">{usuario.cargo.nombre}</span>
                </div>
              </div>
            </div>

            {/* Destination Selector */}
            <div>
              <label htmlFor="select-dest" className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Derivar a (Destino)</label>
              <select 
                id="select-dest"
                className="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-sm focus:ring-1 focus:ring-brand-teal focus:border-brand-teal outline-none cursor-pointer"
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
              <label htmlFor="reg-instrucciones" className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Proveído / Instrucciones Iniciales</label>
              <input 
                id="reg-instrucciones"
                type="text"
                className="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-sm focus:ring-1 focus:ring-brand-teal focus:border-brand-teal outline-none"
                placeholder="Ej: Revisar certificado fitosanitario y emitir conformidad"
                value={instrucciones}
                onChange={e => setInstrucciones(e.target.value)}
                required
              />
            </div>
          </div>
        </div>

        {/* Action Bar */}
        <div className="flex justify-end gap-3 bg-slate-50 p-4 border border-slate-200/80 rounded-xl">
          <button 
            type="submit" 
            className="bg-brand-navy hover:bg-slate-800 text-white font-bold py-2.5 px-6 rounded-lg text-xs uppercase tracking-wider transition shadow-md cursor-pointer transform hover:-translate-y-0.5 duration-200"
          >
            Registrar y Derivar Documento
          </button>
        </div>
      </form>
    </div>
  );
};

export default RegistroDocumento;
