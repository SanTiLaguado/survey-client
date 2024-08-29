import React, { useState } from "react";
import "./Auth.css";

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-image-container">
          <img src="/assets/placeholder.svg" alt="Login visual" className="auth-image" />
        </div>
        <div className="auth-form-container">
          <h2 className="auth-title">
            {isLogin ? "Iniciar sesión" : "Registrarse"}
          </h2>
          <form className="auth-form">
            {!isLogin && (
              <div className="auth-input-group">
                <label htmlFor="name">Nombre</label>
                <input id="name" placeholder="Tu nombre" required />
              </div>
            )}
            <div className="auth-input-group">
              <label htmlFor="email">Correo electrónico</label>
              <input id="email" placeholder="tu@ejemplo.com" required type="email" />
            </div>
            <div className="auth-input-group">
              <label htmlFor="password">Contraseña</label>
              <input id="password" required type="password" />
            </div>
            <button className="auth-button" type="submit">
              {isLogin ? "Iniciar sesión" : "Registrarse"}
            </button>
          </form>
          <div className="auth-footer">
            {isLogin ? "¿No tienes una cuenta?" : "¿Ya tienes una cuenta?"}
            <button
              className="auth-switch"
              onClick={() => setIsLogin(!isLogin)}
            >
              {isLogin ? "Regístrate" : "Inicia sesión"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
