import React, { useState, useEffect } from 'react';
import { Modal, List, Card, Dropdown, Button, Menu } from 'antd';
import { viewAll, viewChapters } from '../../services/SurveyService.js';
import { MoreOutlined } from '@ant-design/icons';

const SurveyList = () => {
    const [surveys, setSurveys] = useState([]);
    const [chapters, setChapters] = useState([]);
    const [visible, setVisible] = useState(false);
    const [currentSurvey, setCurrentSurvey] = useState(null);

    useEffect(() => {
        const fetchSurveys = async () => {
            try {
                let response = await viewAll();
                if (Array.isArray(response.data)) {
                    setSurveys(response.data);
                } else {
                    console.error('Expected an array but got:', response.data);
                    setSurveys([]);
                }
            } catch (error) {
                console.error('Error fetching surveys:', error);
                setSurveys([]);
            }
        };

        fetchSurveys();
    }, []);

    const fetchChapters = async (surveyId) => {
        try {
            const response = await viewChapters(surveyId);
            return response.data && Array.isArray(response.data) ? response.data : [];
        } catch (error) {
            console.error('Error fetching chapters:', error);
            return [];
        }
    };

    const handleSurveyClick = async (survey) => {
        console.log("Click en encuesta");
        setCurrentSurvey(survey);
        const fetchedChapters = await fetchChapters(survey.id);
        setChapters(fetchedChapters);
        setVisible(true);
    };

    const handleMenuClick = async ({ key }, surveyId) => {
        console.log("Survey ID:", surveyId); // Debugging line
        switch (key) {
            case 'edit':
                console.log(`Editar encuesta ${surveyId}`);
                break;
            case 'delete':
                console.log(`Eliminar encuesta ${surveyId}`);
                break;
            case 'viewChapters':
                const survey = surveys.find(s => s.id === surveyId);
                if (survey) {
                    await handleSurveyClick(survey);
                }
                break;
            default:
                break;
        }
    };

    const renderMenu = (surveyId) => [
        { key: 'edit', label: 'Editar encuesta' },
        { key: 'delete', label: 'Eliminar encuesta' },
        { key: 'viewChapters', label: 'Ver capítulos' }
    ];

    return (
        <section className="survey-list">
            {surveys.map(survey => (
                <div
                    key={survey.id}
                    className="survey-card"
                    onClick={() => handleSurveyClick(survey)}
                >
                    <div className="survey-info">
                        <h2>{survey.name}</h2>
                        <p>{survey.description}</p>
                        <div className='statusinfo'>
                            <h3>Estado:</h3>
                            <p>{survey.status}</p>
                        </div>
                    </div>
                    <div className='s-options'>
                        <Dropdown
                            overlay={<Menu items={renderMenu(survey.id)} onClick={(e) => handleMenuClick(e, survey.id)} />}
                            trigger={['click']}
                        >
                            <Button 
                                icon={<MoreOutlined />} 
                                onClick={(e) => e.stopPropagation()}
                            />
                        </Dropdown>
                    </div>
                </div>
            ))}

            <Modal
                title={currentSurvey?.title}
                open={visible}
                onCancel={() => setVisible(false)}
                footer={null}
                width={800}
            >
                <h3 className="text-lg font-semibold mb-4">Capítulos</h3>
                <List
                    grid={{ gutter: 16, column: 3 }}
                    dataSource={chapters}
                    renderItem={(chapter) => (
                        <List.Item>
                            <Card
                                hoverable
                                onClick={() => console.log(`Capítulo seleccionado: ${chapter.title}`)}
                            >
                                <h4 className="font-medium">{chapter.title}</h4>
                            </Card>
                        </List.Item>
                    )}
                />
            </Modal>
        </section>
    );
};

export default SurveyList;
