import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import BienvenidaLogin from './views/vlogin/bienvenida-login';
import RegLogin from './views/vlogin/reg-login';
import VistaRegistroPaquete from './views/vregistro-paq/vregistro-paq';
import Reportes from './views/vreportes/reportes';
import VistaComoany from './views/vconveniose/vconvenio';

// sdfs
function App() {
  return (
    <Router>
      <Routes>
   
        <Route path="/" element={<BienvenidaLogin />} />

    
        <Route path="/login" element={<RegLogin />} />

      
        <Route path="/registro-paquete" element={<VistaRegistroPaquete />} />
        <Route path="/convenio_empresas" element={<VistaComoany />} />
      
        <Route path="/reportes" element={<Reportes />} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
