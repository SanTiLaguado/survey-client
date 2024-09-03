import React from 'react';
import { Link } from 'react-router-dom';

import cslogo from '../../assets/cslogo.png'
import { logout } from '../../services/AuthService';

const Navbar = () => {

  const handleLogout = () => {
    logout();
  };


  return (
    <nav className="navbar">
      <div className="option-logo" >
        <img src={cslogo} alt="LOGO" />
      </div>
      <div className='sectitle'>PRINCIPAL</div>
      <div className='ops'>
        <div className="option">
          <div className="option-icon">
            <i className="fa fa-home" aria-hidden="true"></i>
          </div>
          <Link className="option-link" to="/home">Inicio</Link>
        </div>
        <div className="option">
          <div className="option-icon">
            <i className="fa fa-bar-chart" aria-hidden="true"></i>
          </div>
          <Link className="option-link" to="/surveys">Ver Encuestas</Link>
        </div>
        <div className="option">
          <div className="option-icon">
            <i className="fa fa-tasks" aria-hidden="true"></i>
          </div>
          <Link className="option-link" to="/admin/manage">Gestion de Encuestas</Link>
        </div>
        <div className="option">
          <div className="option-icon">
            <i className="fa fa-globe" aria-hidden="true"></i>
          </div>
          <Link className="option-link" to="/admin/post">Publicar Encuestas</Link>
        </div>
      </div>
      <div className='sectitle'>MIS OPCIONES</div>
      <div className='ops'>
      <div className="option">
          <div className="option-icon">
            <i className="fa fa-user-circle" aria-hidden="true"></i>
          </div>
          <Link className="option-link" to="/profile">Mi perfil</Link>
        </div>
        <div className="option" id='logout' onClick={handleLogout}>
          <div className="option-icon">
            <i className="fa fa-sign-out" aria-hidden="true"></i>
          </div>
          <Link className="option-link" to="/login">Cerrar Sesion</Link>
        </div>

      </div>
      <div className="credit">
        Campus Survey <br />
        Panel Administrador <br />        
        v0.3.1
      </div>
    </nav>
  );
};

export default Navbar;
