import { Outlet, NavLink } from 'react-router-dom';
import { FileText, Inbox, Search, Menu, Compass, Users, Layers, LogOut, Leaf, BarChart3 } from 'lucide-react';
import type { Empleado } from '../types';

interface LayoutProps {
  usuario: Empleado;
  onLogout: () => void;
}

const Layout = ({ usuario, onLogout }: LayoutProps) => {
  // Softer, kawaii-minimalist styles: larger rounded corners (2xl), friendly icons, soft active glow
  const activeLinkClass = "flex items-center gap-3 p-3 rounded-2xl bg-brand-teal text-slate-950 font-bold shadow-lg shadow-brand-teal/25 transition duration-200 scale-[1.02] transform origin-left";
  const inactiveLinkClass = "flex items-center gap-3 p-3 rounded-2xl text-slate-200/90 hover:bg-white/5 hover:text-white transition duration-200";

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* Sidebar - friendly, soft slate blue */}
      <aside className="w-68 bg-brand-navy text-white flex flex-col justify-between border-r border-slate-200/20 flex-shrink-0">
        <div>
          {/* Logo / Header */}
          <div className="p-5 border-b border-slate-200/10 bg-white/5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-brand-teal-light text-brand-teal rounded-xl border border-brand-teal/20">
                <Leaf className="w-4 h-4" />
              </div>
              <span className="font-bold tracking-tight text-white text-base font-serif">MuyuAgro</span>
            </div>
            <span className="text-[9px] font-mono bg-brand-teal-light text-brand-teal px-2 py-0.5 rounded-full border border-brand-teal/20 font-bold">
              v1.1
            </span>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-2">
            <span className="block px-3 text-[10px] font-bold text-slate-400/80 uppercase tracking-widest mb-2 font-mono">
              Menú de Control
            </span>
            
            <NavLink to="/" className={({ isActive }) => isActive ? activeLinkClass : inactiveLinkClass}>
              <Inbox className="w-4 h-4 flex-shrink-0" />
              <span className="text-sm">Bandeja de Entrada</span>
            </NavLink>
            
            <NavLink to="/registro" className={({ isActive }) => isActive ? activeLinkClass : inactiveLinkClass}>
              <FileText className="w-4 h-4 flex-shrink-0" />
              <span className="text-sm">Registrar Documento</span>
            </NavLink>
            
            <NavLink to="/busqueda" className={({ isActive }) => isActive ? activeLinkClass : inactiveLinkClass}>
              <Search className="w-4 h-4 flex-shrink-0" />
              <span className="text-sm">Búsqueda Avanzada</span>
            </NavLink>
            
            <NavLink to="/seguimiento" className={({ isActive }) => isActive ? activeLinkClass : inactiveLinkClass}>
              <Compass className="w-4 h-4 flex-shrink-0" />
              <span className="text-sm">Seguimiento</span>
            </NavLink>

            <NavLink to="/analisis" className={({ isActive }) => isActive ? activeLinkClass : inactiveLinkClass}>
              <BarChart3 className="w-4 h-4 flex-shrink-0" />
              <span className="text-sm">Análisis (Dash)</span>
            </NavLink>

            <span className="block px-3 text-[10px] font-bold text-slate-400/80 uppercase tracking-widest pt-3 mb-2 font-mono">
              Catálogos
            </span>

            <NavLink to="/empleados" className={({ isActive }) => isActive ? activeLinkClass : inactiveLinkClass}>
              <Users className="w-4 h-4 flex-shrink-0" />
              <span className="text-sm">Personal (Empleados)</span>
            </NavLink>
            
            <NavLink to="/tipos" className={({ isActive }) => isActive ? activeLinkClass : inactiveLinkClass}>
              <Layers className="w-4 h-4 flex-shrink-0" />
              <span className="text-sm">Tipos de Documento</span>
            </NavLink>
          </nav>
        </div>

        {/* Logged-in User Profile & Logout */}
        <div className="p-4 border-t border-slate-200/10 bg-white/5 space-y-3">
          <div className="flex items-center gap-3 bg-slate-950/20 p-3 rounded-2xl border border-slate-200/10">
            {/* User Initials Circle */}
            <div className="w-9 h-9 rounded-xl bg-brand-teal-light text-brand-teal flex items-center justify-center font-bold text-sm border border-brand-teal/20 flex-shrink-0 shadow-inner">
              {usuario.nombre[0]}{usuario.apellidos[0]}
            </div>
            <div className="flex-1 min-w-0">
              <span className="block font-bold text-slate-100 text-xs truncate">
                {usuario.nombre} {usuario.apellidos}
              </span>
              <span className="block text-[9px] font-mono text-slate-400 uppercase tracking-wider truncate mt-0.5">
                {usuario.cargo.nombre}
              </span>
              <span className="block text-[9px] text-brand-teal font-medium truncate mt-0.5">
                {usuario.area?.nombre || 'General'}
              </span>
            </div>
          </div>
          
          <button 
            onClick={onLogout}
            className="w-full flex items-center justify-center gap-2 text-slate-300 hover:text-rose-300 hover:bg-rose-500/10 p-2.5 rounded-xl border border-slate-200/10 hover:border-rose-500/25 transition duration-205 font-bold uppercase tracking-wider text-[10px] cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            Cerrar Sesión
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <header className="bg-white border-b border-slate-100 h-16 px-6 flex justify-between items-center flex-shrink-0 shadow-sm shadow-slate-100/30">
          <div className="flex items-center gap-3">
            <Menu className="w-5 h-5 text-slate-400 md:hidden" />
            <h2 className="text-sm font-bold text-slate-800 tracking-tight flex items-center gap-2">
              <span className="font-serif text-blue-500 font-bold">MuyuAgro</span>
              <span className="text-slate-200">|</span>
              <span className="text-xs font-mono text-slate-400 font-medium">Trámite Documentario</span>
            </h2>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex flex-col text-right">
              <span className="text-[9px] font-mono text-slate-400 uppercase tracking-widest font-bold">MYPE AGROEXPORTADORA</span>
              <span className="text-[9px] text-emerald-500 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-full font-bold mt-0.5 self-end flex items-center gap-1">
                <span className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse"></span> Servidor en Línea
              </span>
            </div>
          </div>
        </header>

        {/* Scrollable Viewport */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8 bg-slate-50/70">
          <div className="max-w-7xl mx-auto space-y-6">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Layout;
