import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getName } from "../../services/AuthService";

const UserHome = () => {
    const name = getName();
    const navigate = useNavigate();

    useEffect(() => {
        document.title = 'Inicio - Campus Survey';
    }, []);

    const handleNewSurvey = () => {
        navigate('/surveys/create');
    };

    const handleViewSurveys = () => {
        navigate('/surveys');
    };

    return (
        <section className="main" id="userhome">
            <div className="userhome-header">
                <h1>Hola, {name || "Usuario Ejemplo"}!</h1>
            </div>
            <div className="userhome-content">
                <h2>Bienvenido a Campus Survey</h2>
                <p>Aquí podrás realizar Campus encuestas, revisar tu historial y ver tus estadísticas de participación.</p>
            </div>
            <div className="userhome-actions">
                <button className="primary-button" onClick={handleNewSurvey}>
                    Realizar una nueva encuesta
                </button>
                <button className="secondary-button" onClick={handleViewSurveys}>
                    Ver mis encuestas
                </button>
            </div>
        </section>
    );
};

export default UserHome;
