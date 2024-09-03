import React, { useEffect } from 'react';
import SurveyList from '../components/SurveyList/SurveyList';

const SurveyManage = () => {

    useEffect(() => {
        document.title = 'Gestion de encuestas - Admin Campus Survey';
    }, []);

    return (
        <section className="main" id="survmanage">
            <div className='main-card'></div>
            <SurveyList />
        </section>
    );
};

export default SurveyManage;
