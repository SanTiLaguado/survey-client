import React, { useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import SurveyList from '../components/SurveyList/SurveyList';

const SurveyManage = () => {
    const navigate = useNavigate();

    useEffect(() => {
        document.title = 'Gestion de encuestas - Admin Campus Survey';
    }, []);

    const handleButton= () => {
        navigate('/admin/create');
    };

    return (
        <section className="main" id="survmanage">
            <h1>Gestion de Encuestas</h1>
            <div className='upper-card'>
                <button className="primary-button" onClick={handleButton}>
                    Crear nueva encuesta
                </button>
            </div>
            <div className='main-card'></div>
            <SurveyList />
        </section>
    );
};

export default SurveyManage;
