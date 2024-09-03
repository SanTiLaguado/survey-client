import React, { lazy, useEffect } from "react";
const SurveyGrid = lazy(() => import('../components/SurveyGrid/SurveyGrid'));



const Surveys = () => {

    useEffect(() => {
        document.title = 'Encuestas - Campus Survey';
    }, []);

    return (
        <section className="main" id="surveys">
            <SurveyGrid />
        </section>
    );
};

export default Surveys;