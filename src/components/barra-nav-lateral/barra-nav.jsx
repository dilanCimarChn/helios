import React from 'react';
import { Link } from 'react-router-dom'; // Importamos Link para la navegación
import './barra-nav.css';

const BarraNavLateral = () => {
  return (
    <div className="sidebar">
      <div className="logo">
        <img src="/helios.svg" alt="Helios Logo" className="logo-image" />
        <h2>HELIOS</h2>
        <p>PANEL DE ADMINISTRADOR</p>
      </div>
      <div className="user-info">
        <img src="/profile.svg" alt="User Profile" className="user-avatar" />
        <h3>Hermes Choque</h3>
        <p>Administrador</p>
      </div>
      <nav className="nav-links">
        <Link to="/registro-paquete" className="nav-button">Registrar paquete</Link>
        <Link to="/notificaciones" className="nav-button">Notificaciones</Link>
        <Link to="/reportes" className="nav-button">Reportes</Link>
        <Link to="/" className="nav-button">Cerrar sesión</Link> {/* Redirige a la página de bienvenida */}
      </nav>
    </div>
  );
};

export default BarraNavLateral;
