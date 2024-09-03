import React, { useEffect } from 'react';

const CreateSurvey = () => {

    useEffect(() => {
        document.title = 'Crear Encuesta - Admin Campus Survey';
    }, []);

    return (
        <section className="main" id="createsurveys">
            <h1>Creador de encuestas</h1>
        </section>
    );
};

export default CreateSurvey;
