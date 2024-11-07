import React from 'react';
import BarraNavLateral from '../../components/barra-nav-lateral/barra-nav';
import RegistroPaquete from '../../components/registro-paquete/reg-paq';
import './vregistro-paq.css';

const VistaRegistroPaquete = () => {
  return (
    <div className="vista-registro-paquete">
      <div className="barra-nav-lateral">
        <BarraNavLateral />
      </div>
      <div className="registro-paquete">
        <RegistroPaquete />
      </div>
    </div>
  );
};

export default VistaRegistroPaquete;
