import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import BienvenidaLogin from './views/vlogin/bienvenida-login';
import RegLogin from './views/vlogin/reg-login';
import VistaRegistroPaquete from './views/vregistro-paq/vregistro-paq';
import Reportes from './views/vreportes/reportes';
import VistaComoany from './views/vconveniose/vconvenio';
import VistaGestionUsuarios from './views/vgestion-usuarios/gestion-usuarios';
import BarraNavLateral from './components/barra-nav-lateral/barra-nav';

function App() {
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    // Recuperar el rol del usuario desde localStorage
    const role = localStorage.getItem('userRole');
    setUserRole(role);
  }, []);

  // Si el rol aún no está cargado, mostrar una pantalla de carga
  if (userRole === null && window.location.pathname !== '/login' && window.location.pathname !== '/') {
    return <div>Cargando...</div>;
  }

  return (
    <Router>
      <div className="app-container">
        {/* Mostrar barra de navegación solo en rutas protegidas */}
        {userRole && window.location.pathname !== '/login' && window.location.pathname !== '/' && (
          <BarraNavLateral />
        )}
        <Routes>
          {/* Rutas públicas */}
          <Route path="/" element={<BienvenidaLogin />} />
          <Route path="/login" element={<RegLogin />} />

          {/* Rutas específicas para cada rol */}
          {userRole === 'admin' && (
            <>
              <Route path="/registro-paquete" element={<VistaRegistroPaquete />} />
              <Route path="/convenio_empresas" element={<VistaComoany />} />
              <Route path="/reportes" element={<Reportes />} />
              <Route path="/gestion-usuarios" element={<VistaGestionUsuarios />} />
            </>
          )}
          {userRole === 'receptionist' && (
            <>
              <Route path="/registro-paquete" element={<VistaRegistroPaquete />} />
              <Route path="/convenio_empresas" element={<VistaComoany />} />
            </>
          )}

          {/* Redirigir a la página principal si no hay coincidencias */}
          <Route path="*" element={<Navigate to={userRole ? '/registro-paquete' : '/login'} replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
