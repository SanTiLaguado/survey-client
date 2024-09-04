import React, { useState, useEffect } from 'react';
import { Modal, List, Card, Dropdown, Button, Menu, Popconfirm, Input, Form } from 'antd';
import { viewAll, viewChapters, updateSurvey } from '../../services/SurveyService.js';
import { MoreOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import { message } from 'antd';

const SurveyList = () => {
    const [surveys, setSurveys] = useState([]);
    const [chapters, setChapters] = useState([]);
    const [visible, setVisible] = useState(false);
    const [editVisible, setEditVisible] = useState(false); // Estado para el modal de edición
    const [currentSurvey, setCurrentSurvey] = useState(null);
    const [dropdownVisible, setDropdownVisible] = useState({});
    const [form] = Form.useForm(); // Formulario de Ant Design

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
        setCurrentSurvey(survey);
        const fetchedChapters = await fetchChapters(survey.id);
        setChapters(fetchedChapters);
        setVisible(true);
    };

    const handleDeleteSurvey = async (surveyId) => {
        console.log(`Eliminar encuesta ${surveyId}`);
        // Aquí podrías llamar a una función que elimine la encuesta por ID
        setDropdownVisible(prev => ({ ...prev, [surveyId]: false }));
    };

    const handleMenuClick = async (e, surveyId) => {
        e.domEvent.stopPropagation();
        switch (e.key) {
            case 'edit':
                const survey = surveys.find(s => s.id === surveyId);
                if (survey) {
                    setCurrentSurvey(survey);
                    form.setFieldsValue({ name: survey.name, description: survey.description });
                    setEditVisible(true);
                }
                break;
            case 'delete':
                await handleDeleteSurvey(surveyId);
                break;
            case 'viewChapters':
                const surveyForChapters = surveys.find(s => s.id === surveyId);
                if (surveyForChapters) {
                    await handleSurveyClick(surveyForChapters);
                }
                break;
            default:
                break;
        }
    };

    const handleEditSubmit = async (values) => {
        try {
            await updateSurvey(currentSurvey.id, values);
            const updatedSurveys = surveys.map(survey =>
                survey.id === currentSurvey.id ? { ...survey, ...values } : survey
            );
            setSurveys(updatedSurveys);
            setEditVisible(false);
            message.success('Encuesta editada exitosamente');
        } catch (error) {
            console.error('Error updating survey:', error);
        }
    };

    const handleDropdownVisibleChange = (surveyId, flag) => {
        setDropdownVisible(prev => ({ ...prev, [surveyId]: flag }));
    };

    const renderMenu = (surveyId) => {
        const menuItems = [
            {
                key: 'edit',
                label: 'Editar encuesta',
            },
            {
                key: 'delete',
                label: (
                    <Popconfirm
                        title="¿Estás seguro? Esta acción es irreversible."
                        onConfirm={(e) => {
                            e.stopPropagation();
                            handleDeleteSurvey(surveyId);
                            message.success('Encuesta correctamente eliminada');
                        }}
                        okText="Sí"
                        cancelText="No"
                        icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
                        onCancel={() => setDropdownVisible(prev => ({ ...prev, [surveyId]: false }))}
                    >
                        <span>Eliminar encuesta</span>
                    </Popconfirm>
                ),
            },
            {
                key: 'viewChapters',
                label: 'Ver capítulos',
            },
        ];

        return <Menu items={menuItems} onClick={(e) => handleMenuClick(e, surveyId)} />;
    };

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
                    </div>
                    <div className='s-options'>
                        <div className='statusinfo'>
                            <h3>Estado:</h3>
                            <p>{survey.status ? "PÚBLICO" : "PRIVADO"}</p>
                        </div>
                        <Dropdown
                            overlay={renderMenu(survey.id)}
                            trigger={['click']}
                            visible={dropdownVisible[survey.id] || false}
                            onVisibleChange={(flag) => handleDropdownVisibleChange(survey.id, flag)}
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

            <Modal
                title="Editar Encuesta"
                open={editVisible}
                onCancel={() => setEditVisible(false)}
                footer={null}
                width={600}
            >
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleEditSubmit}
                >
                    <Form.Item
                        name="name"
                        label="Nombre"
                        rules={[{ required: true, message: 'Por favor ingresa el nombre de la encuesta.' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="description"
                        label="Descripción"
                        rules={[{ required: true, message: 'Por favor ingresa la descripción de la encuesta.' }]}
                    >
                        <Input.TextArea rows={4} />
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit">Guardar</Button>
                        <Button style={{ marginLeft: 8 }} onClick={() => setEditVisible(false)}>Cancelar</Button>
                    </Form.Item>
                </Form>
            </Modal>
        </section>
    );
};

export default SurveyList;
