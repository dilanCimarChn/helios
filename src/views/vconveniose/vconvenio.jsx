import React from 'react';
import BarraNavLateral from '../../components/barra-nav-lateral/barra-nav';
import CompanyList from '../../components/convenio_empresas/CompanyList';
import './vconvenio.css';

const VistaComoany = () => {
  return (
    <div className="vista-registro-paquete">
      <div className="barra-nav-lateral">
        <BarraNavLateral />
      </div>
      <div className="registro-paquete">
        <CompanyList />
      </div>
    </div>
  );
};

export default VistaComoany;
