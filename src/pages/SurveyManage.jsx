import React, { useEffect } from 'react';

const SurveyManage = () => {

    useEffect(() => {
        document.title = 'Gestion de encuestas - Admin Campus Survey';
    }, []);

    return (
        <section className="main" id="responses">
            <h1>Gestion de encuestas</h1>
        </section>
    );
};

export default SurveyManage;
