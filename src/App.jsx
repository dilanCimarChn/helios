import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import BienvenidaLogin from './views/vlogin/bienvenida-login';
import RegLogin from './views/vlogin/reg-login';
import VistaRegistroPaquete from './views/vregistro-paq/vregistro-paq';
import Reportes from './views/vreportes/reportes';
import VistaComoany from './views/vconveniose/vconvenio';
import GenerateQR from './components/generador_qr/GenerateQR'; // Importa el componente para generar QR

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

        {/* Nueva ruta para el generador de QR */}
        <Route path="/generar-qr" element={<GenerateQR />} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
