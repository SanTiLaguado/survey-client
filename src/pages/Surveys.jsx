import React, { lazy, useEffect } from "react";
const SurveyGrid = lazy(() => import('../components/SurveyGrid/SurveyGrid'));



const Surveys = () => {

    useEffect(() => {
        document.title = 'Encuestas - Campus Survey';
    }, []);

    return (
        <section className="main" id="surveys">
            <h1>Surveyss</h1>
            <SurveyGrid />
        </section>
    );
};

export default Surveys;