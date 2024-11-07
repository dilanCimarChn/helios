import React from 'react';
import './reportes.css';
import BarraNavLateral from '../../components/barra-nav-lateral/barra-nav';// Asegúrate de que la ruta a BarraNav sea correcta
import Reporte from '../../components/reporte/reporte'; // Asegúrate de que la ruta a Reporte sea correcta

const Reportes = () => {
    return (
      <div className="vista-reportes">
        <div className="barra-nav-lateral">
          <BarraNavLateral />
        </div>
        <div className="contenido-reporte">
          <Reporte />
        </div>
      </div>
    );
  };
  
  export default Reportes;