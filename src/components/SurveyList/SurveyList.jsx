import React, { useState, useEffect } from 'react';
import { Modal, List, Card, Dropdown, Button, Menu, Popconfirm, Input, InputNumber, Form } from 'antd';
import { viewAll, viewChapters, updateSurvey, postSurvey, updateChapter, viewQuestions } from '../../services/SurveyService.js';
import CreateQuestionModal from '../CreateQuestion/CreateQuestion.jsx';

import { createChapter } from '../../services/ChapterService.js';
import { MoreOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import { message } from 'antd';

const SurveyList = () => {
    const [surveys, setSurveys] = useState([]);
    const [chapters, setChapters] = useState([]);
    const [questions, setQuestions] = useState([]);
    const [visible, setVisible] = useState(false);
    const [questionsVisible, setQuestionsVisible] = useState(false);
    const [editSurveyVisible, setEditSurveyVisible] = useState(false); // Separate state for editing survey
    const [editChapterVisible, setEditChapterVisible] = useState(false); // State for editing chapter
    const [currentSurvey, setCurrentSurvey] = useState(null);
    const [currentChapter, setCurrentChapter] = useState(null); // For editing chapter
    const [selectedChapter, setSelectedChapter] = useState(null);
    const [dropdownVisible, setDropdownVisible] = useState({});
    const [createChapterVisible, setCreateChapterVisible] = useState(false);
    const [createQuestionVisible, setCreateQuestionVisible] = useState(false);
    const [chapterDropdownVisible, setChapterDropdownVisible] = useState({}); // Dropdown for chapters
    const [form] = Form.useForm();

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

    const fetchQuestions = async (chapterId) => {
        try {
            const response = await viewQuestions(chapterId);
            console.log(response.data); // Verifica la respuesta del servicio
            setQuestions(response.data && Array.isArray(response.data) ? response.data : []);
        } catch (error) {
            console.error('Error fetching questions:', error);
        }
    };


    const handleSurveyClick = async (survey) => {
        setCurrentSurvey(survey);
        const fetchedChapters = await fetchChapters(survey.id);
        setChapters(fetchedChapters);
        setVisible(true);
    };

    const handleChapterClick = async (chapter) => {
        setSelectedChapter(chapter);
        await fetchQuestions(chapter.id); // Espera a que se carguen las preguntas
        setQuestionsVisible(true); // Luego abre el modal
        console.log(questions, chapter.id); // Verifica si las preguntas están siendo recibidas
    };

    const handleDeleteSurvey = async (surveyId) => {
        console.log(`Eliminar encuesta ${surveyId}`);
        // Call your deletion service here
        setDropdownVisible(prev => ({ ...prev, [surveyId]: false }));
    };

    const handleMenuClick = async (e, surveyId) => {
        e.domEvent.stopPropagation();
        const survey = surveys.find(s => s.id === surveyId);
        switch (e.key) {
            case 'edit':
                if (survey) {
                    setCurrentSurvey(survey);
                    form.setFieldsValue({ name: survey.name, description: survey.description });
                    setEditSurveyVisible(true);
                }
                break;
            case 'delete':
                await handleDeleteSurvey(surveyId);
                break;
            case 'viewChapters':
                await handleSurveyClick(survey);
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
            setEditSurveyVisible(false);
            form.resetFields();
            message.success('Encuesta editada exitosamente');
        } catch (error) {
            console.error('Error updating survey:', error);
        }
    };

    const handleEditChapterSubmit = async (values) => {
        try {
            await updateChapter(currentChapter.id, values);
            const updatedChapters = chapters.map(chapter =>
                chapter.id === currentChapter.id ? { ...chapter, ...values } : chapter
            );
            setChapters(updatedChapters);
            setEditChapterVisible(false);
            form.resetFields();
            message.success('Capítulo editado exitosamente');
        } catch (error) {
            console.error('Error updating chapter:', error);
        }
    };

    const handlePublishSurvey = async (surveyId) => {
        const pstatus = true;
        try {
            await postSurvey(surveyId, pstatus);
            message.success('Encuesta publicada exitosamente');
        } catch (error) {
            console.error('Error publicando encuesta:', error);
            message.error('Error publicando encuesta.');
        }
    };

    const handleDropdownVisibleChange = (surveyId, flag) => {
        setDropdownVisible(prev => ({ ...prev, [surveyId]: flag }));
    };

    const handleChapterDropdownVisibleChange = (chapterId, flag) => {
        setChapterDropdownVisible(prev => ({ ...prev, [chapterId]: flag }));
    };

    const renderSurveyMenu = (surveyId) => {
        const menuItems = [
            { key: 'edit', label: 'Editar encuesta' },
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
                    >
                        <span>Eliminar encuesta</span>
                    </Popconfirm>
                ),
            },
            { key: 'viewChapters', label: 'Ver capítulos' },
        ];

        return <Menu items={menuItems} onClick={(e) => handleMenuClick(e, surveyId)} />;
    };

    const handleChapterMenuClick = async (e, chapterId) => {
        e.domEvent.stopPropagation();
        const chapter = chapters.find(c => c.id === chapterId);
        switch (e.key) {
            case 'edit':
                if (chapter) {
                    setCurrentChapter(chapter);
                    form.setFieldsValue({
                        number: chapter.number,
                        title: chapter.title
                    });
                    setEditChapterVisible(true);
                }
                break;
            case 'delete':
                // Implement chapter deletion logic
                break;
            default:
                break;
        }
    };

    const renderChapterMenu = (chapterId) => {
        const menuItems = [
            { key: 'edit', label: 'Editar capítulo' },
            {
                key: 'delete',
                label: (
                    <Popconfirm
                        title="¿Estás seguro? Esta acción es irreversible."
                        onConfirm={(e) => {
                            e.stopPropagation();
                            // Implement chapter deletion logic
                            message.success('Capítulo correctamente eliminado');
                        }}
                        okText="Sí"
                        cancelText="No"
                        icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
                    >
                        <span>Eliminar capítulo</span>
                    </Popconfirm>
                ),
            },
        ];

        return <Menu items={menuItems} onClick={(e) => handleChapterMenuClick(e, chapterId)} />;
    };

    const handleCreateChapterSubmit = async (values) => {
        try {
            if (currentSurvey) {
                const createdChapter = await createChapter(currentSurvey.id, values);

                setChapters(prevChapters => [...prevChapters, createdChapter]);

                message.success('Capítulo creado exitosamente');
                setCreateChapterVisible(false);
                form.resetFields();
            } else {
                message.error('No se puede crear el capítulo. No hay una encuesta seleccionada.');
            }
        } catch (error) {
            console.error('Error creando capítulo:', error);
            message.error('Error creando capítulo.');
        }
    };

    const handleCreateQuestionSubmit = async (values) => {
        try {
            // Implementa el servicio para crear preguntas aquí
            message.success('Pregunta creada exitosamente');
            setCreateQuestionVisible(false);
            form.resetFields();
            // Actualiza la lista de preguntas si es necesario
        } catch (error) {
            console.error('Error creando pregunta:', error);
            message.error('Error creando pregunta.');
        }
    };
    

    return (
        <section className="survey-list">
            {surveys.map(survey => (
                <div key={survey.id} className="survey-card" onClick={() => handleSurveyClick(survey)}>
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
                            overlay={renderSurveyMenu(survey.id)}
                            trigger={['click']}
                            visible={dropdownVisible[survey.id] || false}
                            onVisibleChange={(flag) => handleDropdownVisibleChange(survey.id, flag)}
                        >
                            <Button icon={<MoreOutlined />} onClick={(e) => e.stopPropagation()} />
                        </Dropdown>
                    </div>
                    <div className="post_but">
                        {!survey.status && (
                            <Button type="primary" onClick={(e) => {
                                e.stopPropagation();
                                handlePublishSurvey(survey.id);
                            }}>
                                Publicar
                            </Button>
                        )}
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
                                onClick={() => handleChapterClick(chapter)}
                            >
                                <h4 className="font-medium">{chapter.number + ". " + chapter.title}</h4>
                                <Dropdown
                                    overlay={renderChapterMenu(chapter.id)}
                                    trigger={['click']}
                                    visible={chapterDropdownVisible[chapter.id] || false}
                                    onVisibleChange={(flag) => handleChapterDropdownVisibleChange(chapter.id, flag)}
                                >
                                    <Button icon={<MoreOutlined />} onClick={(e) => e.stopPropagation()} />
                                </Dropdown>
                            </Card>
                        </List.Item>
                    )}
                />
                <div style={{ marginTop: '5px' }}>
                    <Button type="primary" onClick={() => setCreateChapterVisible(true)}>
                        Crear Capítulo
                    </Button>
                </div>
            </Modal>


            <Modal
                title={`Preguntas - ${selectedChapter?.title}`}
                open={questionsVisible}
                onCancel={() => setQuestionsVisible(false)}
                footer={null}
                width={800}
            >
                {questions.length > 0 ? (
                    <List
                        dataSource={questions}
                        renderItem={(question) => (
                            <List.Item>
                                <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                                    <div>
                                        <h4 className="font-medium">
                                            {`${question.questionNumber}. ${question.questionText}`}
                                        </h4>
                                        <span style={{ display: 'block', color: 'gray', marginTop: '4px' }}>
                                            {question.commentQuestion}
                                        </span>
                                    </div>
                                    <Button type="link">Ver</Button>
                                </div>
                            </List.Item>

                        )}
                    />

                ) : (
                    <p>No hay preguntas disponibles.</p>
                )}
                <div style={{ marginTop: '5px' }}>
                    <Button type="primary" style={{ marginLeft: '8px' }} onClick={() => setCreateQuestionVisible(true)}>
                        Crear Pregunta
                    </Button>
                </div>
            </Modal>



            <Modal
                title="Editar Encuesta"
                open={editSurveyVisible}
                onCancel={() => {
                    setEditSurveyVisible(false);
                    form.resetFields();
                }}
                footer={null}
                width={600}
            >
                <Form form={form} layout="vertical" onFinish={handleEditSubmit}>
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
                        <Button style={{ marginLeft: 8 }} onClick={() => {
                            setEditSurveyVisible(false);
                            form.resetFields();
                        }}>Cancelar</Button>
                    </Form.Item>
                </Form>
            </Modal>

            <Modal
                title="Editar Capítulo"
                open={editChapterVisible}
                onCancel={() => {
                    setEditChapterVisible(false);
                    form.resetFields();
                }}
                footer={null}
                width={600}
            >
                <Form form={form} layout="vertical" onFinish={handleEditChapterSubmit}>
                    <Form.Item
                        name="number"
                        label="Número"
                        rules={[
                            { required: true, message: 'Por favor ingresa el número del capítulo.' },
                            { type: 'number', min: 1, message: 'El número debe ser mayor que 0.' }
                        ]}
                    >
                        <InputNumber style={{ width: '100%' }} />
                    </Form.Item>
                    <Form.Item
                        name="title"
                        label="Nombre"
                        rules={[{ required: true, message: 'Por favor ingresa el nombre del capítulo.' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit">Guardar</Button>
                        <Button style={{ marginLeft: 8 }} onClick={() => {
                            setEditChapterVisible(false);
                            form.resetFields();
                        }}>Cancelar</Button>
                    </Form.Item>
                </Form>
            </Modal>

            <Modal
                title="Crear Capítulo"
                open={createChapterVisible}
                onCancel={() => {
                    setCreateChapterVisible(false);
                    form.resetFields();
                }}
                footer={null}
                width={600}
            >
                <Form form={form} layout="vertical" onFinish={handleCreateChapterSubmit}>
                    <Form.Item
                        name="number"
                        label="Número"
                        rules={[
                            { required: true, message: 'Por favor ingresa el número del capítulo.' },
                            { type: 'number', min: 1, message: 'El número debe ser mayor que 0.' }
                        ]}
                    >
                        <InputNumber style={{ width: '100%' }} />
                    </Form.Item>
                    <Form.Item
                        name="title"
                        label="Nombre"
                        rules={[{ required: true, message: 'Por favor ingresa el nombre del capítulo.' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit">Guardar</Button>
                        <Button style={{ marginLeft: 8 }} onClick={() => {
                            setCreateChapterVisible(false);
                            form.resetFields();
                        }}>Cancelar</Button>
                    </Form.Item>
                </Form>
            </Modal>

            <Modal
                title="Crear Pregunta"
                open={createQuestionVisible}
                onCancel={() => {
                    setCreateQuestionVisible(false);
                    form.resetFields();
                }}
                footer={null}
                width={600}
            >
                <Form form={form} layout="vertical" onFinish={handleCreateQuestionSubmit}>
                    { }
                    <Form.Item
                        name="questionText"
                        label="Texto de la Pregunta"
                        rules={[{ required: true, message: 'Por favor ingresa el texto de la pregunta.' }]}
                    >
                        <Input.TextArea rows={4} />
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit">Guardar</Button>
                        <Button style={{ marginLeft: 8 }} onClick={() => {
                            setCreateQuestionVisible(false);
                            form.resetFields();
                        }}>Cancelar</Button>
                    </Form.Item>
                </Form>
            </Modal>

            <CreateQuestionModal
                createQuestionVisible={createQuestionVisible}
                setCreateQuestionVisible={setCreateQuestionVisible}
                handleCreateQuestionSubmit={handleCreateQuestionSubmit}
            />

        </section>
    );
};

export default SurveyList;
