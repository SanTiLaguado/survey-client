import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getName } from "../../services/AuthService";

const AdminHome = () => {
    const name = getName();
    const navigate = useNavigate();

    useEffect(() => {
        document.title = 'Inicio - Campus Survey';
    }, []);

    const handleNewSurvey = () => {
        navigate('/surveys');
    };

    const handleViewResponses = () => {
        navigate('/user/responses');
    };

    return (
        <section className="main" id="userhome">
            <div className="userhome-header">
                <h1>Bienvenido, {name || "Usuario Ejemplo"}!</h1>
            </div>
            <div className="userhome-content">
                <h2>Panel de Administrador Campus Survey</h2>
                <p>En este panel se encuentra toda la gestion detallada de encuestas de la plataforma Campus Survey</p>
            </div>
            <div className="userhome-actions">
                <button className="primary-button" onClick={handleNewSurvey}>
                    Crear nueva encuesta
                </button>
                <button className="secondary-button" onClick={handleViewResponses}>
                    Ver Encuestas
                </button>
            </div>
            <div className="userhome-footer">
                <p>¿Tienes preguntas? <a href="/unauthorized">Contáctanos</a></p>
            </div>
        </section>
    );
};

export default AdminHome;
