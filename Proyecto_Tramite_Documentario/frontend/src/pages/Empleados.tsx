import { useState, useEffect, type FormEvent } from 'react';
import { getEmpleados, crearEmpleado } from '../services/EmpleadoService';
import { getAreas, getCargos } from '../services/CatalogosService';
import type { Empleado, Area, Cargo } from '../types';
import { UserPlus, X, Mail, Landmark, Briefcase } from 'lucide-react';

const Empleados = () => {
  const [empleados, setEmpleados] = useState<Empleado[]>([]);
  const [areas, setAreas] = useState<Area[]>([]);
  const [cargos, setCargos] = useState<Cargo[]>([]);
  const [loading, setLoading] = useState(true);

  // Estados del modal de registro
  const [modalAbierto, setModalAbierto] = useState(false);
  const [nombre, setNombre] = useState('');
  const [apellidos, setApellidos] = useState('');
  const [email, setEmail] = useState('');
  const [idArea, setIdArea] = useState<number>(1);
  const [idCargo, setIdCargo] = useState<number>(1);

  const [message, setMessage] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      const [listaEmpleados, listaAreas, listaCargos] = await Promise.all([
        getEmpleados(),
        getAreas(),
        getCargos()
      ]);
      setEmpleados(listaEmpleados);
      setAreas(listaAreas);
      setCargos(listaCargos);

      if (listaAreas.length > 0) setIdArea(listaAreas[0].idArea);
      if (listaCargos.length > 0) setIdCargo(listaCargos[0].idCargo);
    } catch (error) {
      console.error("Error cargando personal:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const nuevo = await crearEmpleado({
        nombre,
        apellidos,
        email,
        idArea,
        idCargo
      });

      // Añadir a la lista local
      setEmpleados([...empleados, nuevo]);
      setSuccess(true);
      setMessage('Empleado registrado con éxito');
      
      // Limpiar formulario y cerrar modal
      setNombre('');
      setApellidos('');
      setEmail('');
      setModalAbierto(false);
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('Error al registrar el empleado. Es posible que el correo electrónico ya esté en uso.');
      setSuccess(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-3">
        <div className="w-10 h-10 border-4 border-brand-teal border-t-transparent rounded-full animate-spin"></div>
        <p className="text-sm font-medium text-slate-500 font-mono">Cargando personal...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <span className="text-xs font-mono tracking-widest text-slate-500 uppercase font-bold">Administración de Personal</span>
          <h1 className="text-3xl font-serif font-bold text-slate-800">Personal de Oficina</h1>
          <p className="text-xs text-slate-400 mt-1">Registra y administra las cuentas de funcionarios facultados para el despacho de trámites en la Mype.</p>
        </div>
        <button 
          onClick={() => setModalAbierto(true)}
          className="bg-brand-navy hover:bg-slate-800 text-white px-5 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition shadow-md cursor-pointer flex items-center gap-1.5 transform hover:-translate-y-0.5 duration-200"
        >
          <UserPlus className="w-4 h-4" /> Agregar Empleado
        </button>
      </div>

      {message && (
        <div className={`p-4 rounded-xl border text-xs font-semibold font-mono ${
          success ? 'bg-emerald-50 text-emerald-850 border-emerald-200' : 'bg-red-50 text-red-850 border-red-200'
        }`}>
          {message}
        </div>
      )}

      {/* Tabla de Empleados */}
      <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wide">Trabajadores Activos (MuyuAgro)</h3>
          <span className="text-xs font-mono text-slate-500 font-bold bg-slate-200/60 px-2.5 py-1 rounded-md">Total: {empleados.length}</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-100/60 border-b border-slate-200/80 text-slate-500 text-[10px] font-bold uppercase tracking-wider font-mono">
                <th className="p-4 pl-6">Nombre y Apellido</th>
                <th className="p-4">Cargo</th>
                <th className="p-4">Área / Oficina</th>
                <th className="p-4">Correo Electrónico</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {empleados.map(emp => (
                <tr key={emp.idEmpleado} className="hover:bg-slate-50/75 transition duration-150">
                  <td className="p-4 font-semibold text-slate-900 pl-6 flex items-center gap-3 text-xs">
                    <div className="w-8 h-8 rounded-lg bg-brand-teal/10 text-brand-teal flex items-center justify-center font-bold text-xs border border-brand-teal/20 flex-shrink-0">
                      {emp.nombre.charAt(0)}{emp.apellidos.charAt(0)}
                    </div>
                    <span>{emp.nombre} {emp.apellidos}</span>
                  </td>
                  <td className="p-4 text-slate-600 text-xs">
                    <span className="inline-flex items-center gap-1 bg-brand-teal/10 text-brand-teal px-2 py-0.5 rounded border border-brand-teal/20 font-semibold text-[10px]">
                      <Briefcase className="w-3 h-3 flex-shrink-0" />
                      {emp.cargo.nombre}
                    </span>
                  </td>
                  <td className="p-4 text-slate-700 text-xs">
                    <span className="inline-flex items-center gap-1">
                      <Landmark className="w-3.5 h-3.5 text-slate-455 text-slate-400 flex-shrink-0" />
                      {emp.area ? emp.area.nombre : 'Sin área asignada'}
                    </span>
                  </td>
                  <td className="p-4 text-slate-500 font-mono text-xs">
                    <span className="inline-flex items-center gap-1">
                      <Mail className="w-3.5 h-3.5 text-slate-455 text-slate-400 flex-shrink-0" />
                      {emp.email}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL REGISTRO EMPLEADO */}
      {modalAbierto && (
        <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white rounded-2xl border border-slate-200 w-full max-w-md shadow-2xl overflow-hidden animate-scale-up">
            <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wide">Agregar Nuevo Empleado</h3>
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
                  <label htmlFor="modal-nom" className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Nombre</label>
                  <input 
                    id="modal-nom"
                    type="text"
                    className="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-xs focus:ring-1 focus:ring-brand-teal focus:border-brand-teal outline-none"
                    placeholder="Ej: Carlos"
                    value={nombre}
                    onChange={e => setNombre(e.target.value)}
                    required
                  />
                </div>

                <div>
                  <label htmlFor="modal-ape" className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Apellidos</label>
                  <input 
                    id="modal-ape"
                    type="text"
                    className="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-xs focus:ring-1 focus:ring-brand-teal focus:border-brand-teal outline-none"
                    placeholder="Ej: Vargas Ruiz"
                    value={apellidos}
                    onChange={e => setApellidos(e.target.value)}
                    required
                  />
                </div>

                <div>
                  <label htmlFor="modal-mail" className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Correo Electrónico</label>
                  <input 
                    id="modal-mail"
                    type="email"
                    className="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-xs focus:ring-1 focus:ring-brand-teal focus:border-brand-teal outline-none"
                    placeholder="carlos.vargas@agroexport.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                  />
                </div>

                <div>
                  <label htmlFor="modal-area" className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Área / Oficina</label>
                  <select 
                    id="modal-area"
                    className="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-xs focus:ring-1 focus:ring-brand-teal focus:border-brand-teal outline-none cursor-pointer"
                    value={idArea}
                    onChange={e => setIdArea(parseInt(e.target.value))}
                  >
                    {areas.map(a => (
                      <option key={a.idArea} value={a.idArea}>{a.nombre}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="modal-cargo" className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Cargo</label>
                  <select 
                    id="modal-cargo"
                    className="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-xs focus:ring-1 focus:ring-brand-teal focus:border-brand-teal outline-none cursor-pointer"
                    value={idCargo}
                    onChange={e => setIdCargo(parseInt(e.target.value))}
                  >
                    {cargos.map(c => (
                      <option key={c.idCargo} value={c.idCargo}>{c.nombre}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="p-4 bg-slate-50 border-t border-slate-155 border-slate-100 flex justify-end gap-2">
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
                  Guardar Empleado
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Empleados;
