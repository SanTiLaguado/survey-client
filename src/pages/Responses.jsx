import React, { useEffect } from "react";

const Surveys = () => {

    useEffect(() => {
        document.title = 'Mis Respuestas - Campus Survey';
    }, []);

    return (
        <section className="main" id="responses">
            <h1>Mis Respuestas</h1>
        </section>
    );
};

export default Surveys;