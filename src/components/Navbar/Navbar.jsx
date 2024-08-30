import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="navbar">
      <Link className="option-logo" to="/">
        <img src="/RYALOGO.svg" alt="LOGO" />
      </Link>
      <div className="option">
        <div className="option-icon">
          <i className="fa fa-home" aria-hidden="true"></i>
        </div>
        <Link className="option-link" to="/">Inicio</Link>
      </div>
      <div className="option">
        <div className="option-icon">
          <i className="fa fa-th-list" aria-hidden="true"></i>
        </div>
        <Link className="option-link" to="/listas">Lista de Precios</Link>
      </div>
      <div className="option">
        <div className="option-icon">
          <i className="fa fa-upload" aria-hidden="true"></i>
        </div>
        <Link className="option-link" to="/subir">Cargar Listas</Link>
      </div>
      <div className="option">
        <div className="option-icon">
          <i className="fa fa-truck" aria-hidden="true"></i>
        </div>
        <Link className="option-link" to="/proveedores">Proveedores</Link>
      </div>
      <div className="credit">
        Gestor de Listas<br />
        Rodamientos & Aceros<br />
        v1.3.0
      </div>
    </nav>
  );
};

export default Navbar;