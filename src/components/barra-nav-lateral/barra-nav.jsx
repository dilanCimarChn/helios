import React from 'react';
import { Link } from 'react-router-dom';
import './barra-nav.css';

const BarraNavLateral = () => {
  const userRole = localStorage.getItem('userRole') || 'guest';

  const navOptions = {
    admin: [
      { path: '/registro-paquete', label: 'Registrar paquete' },
      { path: '/convenio_empresas', label: 'Convenios' },
      { path: '/reportes', label: 'Reportes' },
      { path: '/gestion-usuarios', label: 'Gestión de Usuarios' },
      { path: '/', label: 'Cerrar sesión' },
    ],
    receptionist: [
      { path: '/registro-paquete', label: 'Registrar paquete' },
      { path: '/convenio_empresas', label: 'Convenios' },
      { path: '/', label: 'Cerrar sesión' },
    ],
  };

  const userNavOptions = navOptions[userRole] || [];

  return (
    <div className="sidebar">
      <div className="logo">
        <img src="/helios.svg" alt="Helios Logo" className="logo-image" />
        <h2>HELIOS</h2>
        <p>PANEL DE {userRole === 'admin' ? 'ADMINISTRADOR' : 'RECEPCIONISTA'}</p>
      </div>
      <div className="user-info">
        <img src="/profile.svg" alt="User Profile" className="user-avatar" />
        <h3>Hermes Choque</h3>
        <p>{userRole === 'admin' ? 'Administrador' : 'Recepcionista'}</p>
      </div>
      <nav className="nav-links">
        {userNavOptions.map((option) => (
          <Link key={option.path} to={option.path} className="nav-button">
            {option.label}
          </Link>
        ))}
      </nav>
    </div>
  );
};

export default BarraNavLateral;
