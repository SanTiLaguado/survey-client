import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getEmail, getName, getRole } from '../services/AuthService.js';

const Profile = () => {
    const navigate = useNavigate();

    const role = getRole();
    const name = getName();  
    const email = getEmail();

    useEffect(() => {
        document.title = 'Mi Perfil - Campus Survey';
    }, []);

    const handleButton= () => {
        navigate('/user/responses');
    };

    return (
        <section className="main" id="profile">
            <div className="profile-container">
                <h1 className="profile-title">Mi Perfil</h1>
                <div className="profile-card">
                    <div className="profile-header">
                        <img
                            src="/placeholder-avatar.jpg"
                            alt="Avatar del usuario"
                            className="profile-avatar"
                        />
                        <div className="profile-info">
                            <h2 className="profile-name">{name || "Usuario Ejemplo"}</h2>
                            <p className="profile-email">{email || "usuario@ejemplo.com"}</p>
                            <p className="profile-role">{role || "Rol no especificado"}</p>
                        </div>
                    </div>
                    <div className="profile-stats">
                        <div className="stat-card">
                            <h3 className="stat-title">Encuestas Completadas</h3>
                            <p className="stat-value">15</p>
                            <p className="stat-subtitle">Última: 12/05/2023</p>
                        </div>
                        <div className="stat-card">
                            <h3 className="stat-title">Puntos Acumulados</h3>
                            <p className="stat-value">750</p>
                            <p className="stat-subtitle">Nivel: Encuestador Experto</p>
                        </div>
                    </div>
                    <button className="history-button" onClick={handleButton}>
                        Ver Historial de Encuestas
                    </button>
                </div>
            </div>
        </section>
    );
};

export default Profile;
