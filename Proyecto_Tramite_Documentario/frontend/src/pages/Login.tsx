import { useState, useEffect, type FormEvent } from 'react';
import { KeyRound, User, Leaf, Database, Check } from 'lucide-react';
import { getEmpleados } from '../services/EmpleadoService';
import type { Empleado } from '../types';

interface LoginProps {
  onLogin: (empleado: Empleado) => void;
}

// Fallback seed data matching database/data.sql exactly
const FALLBACK_EMPLOYEES: Empleado[] = [
  {
    idEmpleado: 1,
    nombre: 'Ana',
    apellidos: 'García',
    email: 'ana.garcia@agroexport.com',
    area: { idArea: 1, nombre: 'Mesa de Partes', descripcion: 'Recepción central de documentos' },
    cargo: { idCargo: 1, nombre: 'Secretario/a' }
  },
  {
    idEmpleado: 2,
    nombre: 'Carlos',
    apellidos: 'Ramírez',
    email: 'carlos.ramirez@agroexport.com',
    area: { idArea: 2, nombre: 'Gerencia General', descripcion: 'Dirección estratégica de la Mype' },
    cargo: { idCargo: 2, nombre: 'Gerente' }
  },
  {
    idEmpleado: 3,
    nombre: 'Luis',
    apellidos: 'Fernández',
    email: 'luis.fernandez@agroexport.com',
    area: { idArea: 3, nombre: 'Logística', descripcion: 'Gestión de envíos y agroexportación' },
    cargo: { idCargo: 3, nombre: 'Jefe de Operaciones' }
  },
  {
    idEmpleado: 4,
    nombre: 'María',
    apellidos: 'Torres',
    email: 'maria.torres@agroexport.com',
    area: { idArea: 4, nombre: 'Contabilidad', descripcion: 'Gestión financiera y facturación' },
    cargo: { idCargo: 4, nombre: 'Asistente Administrativo' }
  },
  {
    idEmpleado: 5,
    nombre: 'Elena',
    apellidos: 'Vásquez',
    email: 'elena.vasquez@agroexport.com',
    area: { idArea: 3, nombre: 'Logística', descripcion: 'Gestión de envíos y agroexportación' },
    cargo: { idCargo: 5, nombre: 'Especialista de Aduanas' }
  }
];

const Login = ({ onLogin }: LoginProps) => {
  const [empleados, setEmpleados] = useState<Empleado[]>([]);
  const [selectedEmpId, setSelectedEmpId] = useState<number>(0);
  const [password, setPassword] = useState('demo1234');
  const [isLive, setIsLive] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEmpleados = async () => {
      try {
        setLoading(true);
        const data = await getEmpleados();
        if (data && data.length > 0) {
          setEmpleados(data);
          setSelectedEmpId(data[0].idEmpleado);
          setIsLive(true);
        } else {
          // Empty array fallback
          setEmpleados(FALLBACK_EMPLOYEES);
          setSelectedEmpId(FALLBACK_EMPLOYEES[0].idEmpleado);
          setIsLive(false);
        }
      } catch (err) {
        console.warn('Backend offline, usando datos locales de simulación:', err);
        setEmpleados(FALLBACK_EMPLOYEES);
        setSelectedEmpId(FALLBACK_EMPLOYEES[0].idEmpleado);
        setIsLive(false);
      } finally {
        setLoading(false);
      }
    };

    fetchEmpleados();
  }, []);

  const selectedEmpleado = empleados.find(e => e.idEmpleado === selectedEmpId) || empleados[0];

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (selectedEmpleado) {
      onLogin(selectedEmpleado);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 p-4 relative overflow-hidden">
      {/* Decorative Bio-Agro Tech Background Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40rem] h-[40rem] rounded-full bg-brand-teal/5 blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40rem] h-[40rem] rounded-full bg-brand-green/5 blur-[120px] pointer-events-none"></div>

      <div className="bg-brand-navy w-full max-w-md rounded-2xl shadow-2xl overflow-hidden relative border border-slate-800/80 backdrop-blur-md transition-all duration-300 hover:border-slate-700/80">
        
        {/* Folio Stamp (Branding Premium) */}
        <div className="absolute top-6 right-6 w-20 h-20 border border-brand-teal/30 rounded-full flex items-center justify-center rotate-[-12deg] opacity-75 select-none pointer-events-none transition-transform hover:scale-105">
          <div className="border border-dashed border-brand-teal/20 w-[72px] h-[72px] rounded-full flex items-center justify-center">
            <span className="font-mono text-[7px] font-bold text-brand-teal text-center leading-tight uppercase tracking-widest">
              MUYUAGRO<br />TRAMITE<br />2026
            </span>
          </div>
        </div>

        {/* Header - Navy & Teal branding */}
        <div className="p-8 pb-6 border-b border-slate-800/80 bg-gradient-to-b from-slate-900/80 to-brand-navy">
          <div className="flex items-center gap-2 mb-2">
            <div className="p-1.5 bg-brand-teal-light text-brand-teal rounded-lg">
              <Leaf className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-mono tracking-widest text-brand-teal font-bold uppercase">MuyuAgro S.A.C.</span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Mesa de Partes Virtual</h1>
          <p className="text-xs text-slate-400 mt-1">Gestión de Trámites y Trazabilidad Documentaria</p>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-8 space-y-5">
          
          {/* Database Connection Status Banner */}
          <div className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-xs ${
            isLive 
              ? 'bg-emerald-950/40 border-emerald-800/60 text-emerald-300' 
              : 'bg-amber-950/40 border-amber-800/60 text-amber-300'
          }`}>
            <Database className="w-3.5 h-3.5 flex-shrink-0" />
            <div className="flex-1 flex justify-between items-center">
              <span>{isLive ? 'Conectado a Base de Datos Supabase' : 'Modo Simulación Académica'}</span>
              <span className={`w-1.5 h-1.5 rounded-full ${isLive ? 'bg-brand-green animate-pulse' : 'bg-brand-orange animate-pulse'}`}></span>
            </div>
          </div>

          {/* User Selection Dropdown */}
          <div className="space-y-1.5">
            <label htmlFor="login-user" className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Seleccionar Funcionario / Perfil
            </label>
            <div className="relative">
              <User className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
              <select
                id="login-user"
                className="w-full bg-slate-900/90 border border-slate-700/80 text-white rounded-lg pl-9 pr-3 py-2.5 text-sm focus:ring-1 focus:ring-brand-teal focus:border-brand-teal outline-none transition duration-200 cursor-pointer appearance-none"
                value={selectedEmpId}
                onChange={e => setSelectedEmpId(parseInt(e.target.value))}
                disabled={loading}
              >
                {loading ? (
                  <option value={0}>Cargando empleados de la Mype...</option>
                ) : (
                  empleados.map(emp => (
                    <option key={emp.idEmpleado} value={emp.idEmpleado}>
                      {emp.nombre} {emp.apellidos} ({emp.cargo.nombre})
                    </option>
                  ))
                )}
              </select>
              <div className="absolute right-3 top-3.5 pointer-events-none border-l-4 border-r-4 border-t-4 border-transparent border-t-slate-400 w-0 h-0"></div>
            </div>
          </div>

          {/* Context Display (Cargo y Área del usuario seleccionado) */}
          {selectedEmpleado && (
            <div className="bg-slate-900/60 border border-slate-800/80 rounded-lg p-3 space-y-1 transition duration-300">
              <div className="flex justify-between items-center text-[10px] text-slate-500 font-mono">
                <span>ÁREA DE TRABAJO</span>
                <span>CARGO ASOCIADO</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs font-semibold text-slate-300">
                  {selectedEmpleado.area?.nombre || 'Sin Área'}
                </span>
                <span className="text-xs font-semibold text-brand-teal bg-brand-teal/10 px-2 py-0.5 rounded border border-brand-teal/20">
                  {selectedEmpleado.cargo.nombre}
                </span>
              </div>
              <div className="text-[10px] text-slate-400 mt-1 pt-1 border-t border-slate-800 border-dashed truncate">
                <b>Correo:</b> {selectedEmpleado.email}
              </div>
            </div>
          )}

          {/* Password Input (visual validation only for academic simulation) */}
          <div className="space-y-1.5">
            <label htmlFor="login-pass" className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Contraseña de Seguridad
            </label>
            <div className="relative">
              <KeyRound className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
              <input 
                id="login-pass"
                type="password"
                className="w-full bg-slate-900/90 border border-slate-700/80 text-white rounded-lg pl-9 pr-3 py-2.5 text-sm focus:ring-1 focus:ring-brand-teal focus:border-brand-teal outline-none transition duration-200"
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Login Button */}
          <button 
            type="submit"
            className="w-full bg-brand-teal hover:bg-brand-teal-hover text-slate-950 font-bold py-3 rounded-lg text-sm transition shadow-lg shadow-brand-teal/10 mt-2 cursor-pointer flex items-center justify-center gap-1.5 transform hover:-translate-y-0.5 duration-200"
          >
            <Check className="w-4 h-4" /> Ingresar al Sistema
          </button>

          {/* Footer Académico / Demostración */}
          <div className="pt-4 border-t border-dashed border-slate-800/80 text-center text-[10px] text-slate-500 space-y-1 leading-relaxed">
            <p>Proyecto Integrador de Base de Datos y Sistemas Relacionales.</p>
            <p>Puedes cambiar de perfil libremente para auditar derivaciones y flujos.</p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
