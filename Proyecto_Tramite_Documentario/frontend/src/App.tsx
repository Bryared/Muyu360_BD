import { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import RegistroDocumento from './pages/RegistroDocumento';
import BandejaEntrada from './pages/BandejaEntrada';
import DetalleDocumento from './pages/DetalleDocumento';
import BusquedaAvanzada from './pages/BusquedaAvanzada';
import SeguimientoDocumento from './pages/SeguimientoDocumento';
import Empleados from './pages/Empleados';
import TiposDocumento from './pages/TiposDocumento';
import Analisis from './pages/Analisis';
import Login from './pages/Login';
import type { Empleado } from './types';

function App() {
  const [usuario, setUsuario] = useState<Empleado | null>(null);

  if (!usuario) {
    return <Login onLogin={(emp) => setUsuario(emp)} />;
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout usuario={usuario} onLogout={() => setUsuario(null)} />}>
          <Route index element={<BandejaEntrada usuario={usuario} />} />
          <Route path="registro" element={<RegistroDocumento usuario={usuario} />} />
          <Route path="busqueda" element={<BusquedaAvanzada />} />
          <Route path="seguimiento" element={<SeguimientoDocumento usuario={usuario} />} />
          <Route path="analisis" element={<Analisis />} />
          <Route path="empleados" element={<Empleados />} />
          <Route path="tipos" element={<TiposDocumento />} />
          <Route path="documento/:id" element={<DetalleDocumento />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
