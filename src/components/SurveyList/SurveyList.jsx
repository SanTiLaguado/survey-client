import React from 'react';
import { Dropdown, Button } from 'antd';
import { MoreOutlined } from '@ant-design/icons';

const surveys = [
    { id: 1, title: 'Encuesta 1', description: 'Descripción de la encuesta 1', status: 'PUBLICO' },
    { id: 2, title: 'Encuesta 2', description: 'Descripción de la encuesta 2', status: 'PUBLICO' },
    { id: 3, title: 'Encuesta 2', description: 'Descripción de la encuesta 2', status: 'PRIVADO' },
    // Añade más encuestas aquí
];

const SurveyList = () => {

    const handleMenuClick = (key, surveyId) => {
        switch (key) {
            case 'edit':
                console.log(`Editar encuesta ${surveyId}`);
                break;
            case 'delete':
                console.log(`Eliminar encuesta ${surveyId}`);
                break;
            case 'viewChapters':
                console.log(`Ver capítulos de la encuesta ${surveyId}`);
                break;
            default:
                break;
        }
    };

    const renderMenu = (surveyId) => ({
        items: [
            {
                key: 'edit',
                label: 'Editar encuesta',
                onClick: () => handleMenuClick('edit', surveyId),
            },
            {
                key: 'delete',
                label: 'Eliminar encuesta',
                onClick: () => handleMenuClick('delete', surveyId),
            },
            {
                key: 'viewChapters',
                label: 'Ver capítulos',
                onClick: () => handleMenuClick('viewChapters', surveyId),
            },
        ]
    });

    return (
        <section className="survey-list">
            {surveys.map(survey => (
                <div key={survey.id} className="survey-card">
                    <div className="survey-info">
                        <h2>{survey.title}</h2>
                        <p>{survey.description}</p>

                        <div className='statusinfo'>
                            <h3>Estado:</h3>
                            <p>{survey.status}</p>
                    </div>
                    </div>
                    
                    <div className='s-options'>

                        <Dropdown
                            menu={renderMenu(survey.id)}
                            trigger={['click']}
                        >
                            <Button icon={<MoreOutlined />} />
                        </Dropdown>
                    </div>
                </div>
            ))}
        </section>
    );
};

export default SurveyList;
