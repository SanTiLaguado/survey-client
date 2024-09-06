import React, { useState, useEffect } from 'react';
import { Modal, List, Card, Dropdown, Button, Menu, Popconfirm, Input, InputNumber, Form } from 'antd';
import { viewAll, viewChapters, updateSurvey, postSurvey, updateChapter, viewQuestions, deleteSurvey, deleteChapter } from '../../services/SurveyService.js';
import CreateQuestionModal from '../CreateQuestion/CreateQuestion.jsx';

import { createChapter } from '../../services/ChapterService.js';
import { MoreOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import { message } from 'antd';
import { viewQuestOptions, updateQuestion, deleteQuestion } from '../../services/QuestionService.js';

const SurveyList = () => {
    const [surveys, setSurveys] = useState([]);
    const [chapters, setChapters] = useState([]);
    const [questions, setQuestions] = useState([]);
    const [options, setOptions] = useState([]);
    const [visible, setVisible] = useState(false);
    const [questionsVisible, setQuestionsVisible] = useState(false);
    const [editSurveyVisible, setEditSurveyVisible] = useState(false); // Separate state for editing survey
    const [editQuestionVisible, setEditQuestionVisible] = useState(false); // Separate state for editing survey
    const [editChapterVisible, setEditChapterVisible] = useState(false); // State for editing chapter
    const [currentSurvey, setCurrentSurvey] = useState(null);
    const [currentChapter, setCurrentChapter] = useState(null); // For editing chapter
    const [selectedChapter, setSelectedChapter] = useState(null);
    const [dropdownVisible, setDropdownVisible] = useState({});
    const [createChapterVisible, setCreateChapterVisible] = useState(false);
    const [createQuestionVisible, setCreateQuestionVisible] = useState(false);
    const [chapterDropdownVisible, setChapterDropdownVisible] = useState({}); // Dropdown for chapters
    const [optionsVisible, setOptionsVisible] = useState(false);
    const [selectedQuestion, setSelectedQuestion] = useState(null);
    const [QuestionDropdownVisible, setQuestionDropdownVisible] = useState({});


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

    const fetchOptions = async (questionId) => {
        try {
            console.log(questionId)
            const response = await viewQuestOptions(questionId);
            return response.data && Array.isArray(response.data) ? response.data : [];
        } catch (error) {
            console.error('Error fetching options:', error);
            return [];
        }
    }

    const handleSurveyClick = async (survey) => {
        setCurrentSurvey(survey);
        const fetchedChapters = await fetchChapters(survey.id);
        setChapters(fetchedChapters);
        setVisible(true);
    };

    const handleChapterClick = async (chapter) => {
        setSelectedChapter(chapter);
        setCurrentChapter(chapter);
        await fetchQuestions(chapter.id);
        setQuestionsVisible(true);
    };


    const handleDeleteSurvey = async (surveyId) => {
        console.log(`Eliminar encuesta ${surveyId}`);
        try {
            await deleteSurvey(surveyId)
            setDropdownVisible(prev => ({ ...prev, [surveyId]: false }));
            message.success('Encuesta correctamente eliminada');
        } catch (error) {
            console.error('Error al eliminar la encuesta:', error);
        }
        
    };

    const handleDeleteChapter = async (chapterId) => {
        console.log(`Eliminar chapter ${chapterId}`);
        try {
            await deleteChapter(chapterId)
            setDropdownVisible(prev => ({ ...prev, [chapterId]: false }));
            message.success('Capítulo correctamente eliminado');
        } catch (error) {
            console.error('Error al eliminar el capítulo:', error);
        }
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

    const handleEditQuestionSubmit = async (values) => {
        try {
            if (selectedQuestion) {

                await updateQuestion(selectedQuestion.id, values);
                console.log(values)

                const updatedQuestions = questions.map(question =>
                    question.id === selectedQuestion.id ? { ...question, ...values } : question
                );
                setQuestions(updatedQuestions);
                console.log(updatedQuestions)

                // Close the modal and reset form
                setEditQuestionVisible(false);
                form.resetFields();
                message.success('Pregunta editada exitosamente');
            } else {
                message.error('No se puede editar la pregunta. No hay una pregunta seleccionada.');
            }
        } catch (error) {
            console.error('Error updating question:', error);
            message.error('Error editando pregunta.');
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

    const handleViewOptions = async (questionId) => {
        const optionsData = await fetchOptions(questionId);
        setOptions(optionsData); // Guarda las opciones en el estado
        setSelectedQuestion(questions.find(q => q.id === questionId)); // Encuentra y guarda la pregunta seleccionada
        setOptionsVisible(true);
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
                        onConfirm={async (e) => {
                            e.stopPropagation();
                            try {
                                await handleDeleteChapter(chapterId);
                            } catch (error) {
                                message.error('Error al eliminar el capítulo');
                            }
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

    const handleEditQuestion = (questionId) => {
        // Encuentra la pregunta seleccionada
        const question = questions.find(q => q.id === questionId);
        if (question) {
            setSelectedQuestion(question);
            // Rellena el formulario con los valores actuales
            form.setFieldsValue({
                questionNumber: question.questionNumber,
                questionText: question.questionText,
                commentQuestion: question.commentQuestion
            });
            setEditQuestionVisible(true);
        }
    };

    const handleDeleteQuestion = async (questionId) => {
        try {
            console.log('Eliminar pregunta con ID:', questionId);
            const result = await deleteQuestion(questionId);
            console.log('Pregunta eliminada con éxito:', result);
            message.success('Pregunta correctamente eliminada');
        } catch (error) {
            console.error('Error al eliminar la pregunta:', error);
        }
    };

    const renderQuestionMenu = (questionId) => {
        const menuItems = [
            { key: 'edit', label: 'Editar pregunta' },
            {
                key: 'delete',
                label: (
                    <Popconfirm
                        title="¿Estás seguro? Esta acción es irreversible."
                        onConfirm={async () => {
                            try {
                                await handleDeleteQuestion(questionId);
                                message.success('Pregunta correctamente eliminada');
                            } catch (error) {
                                message.error('Error al eliminar la pregunta');
                            }
                        }}
                        okText="Sí"
                        cancelText="No"
                        icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
                    >
                        <span>Eliminar pregunta</span>
                    </Popconfirm>
                ),
            },
        ];
    
        return <Menu items={menuItems} onClick={(e) => handleQuestionMenuClick(e, questionId)} />;
    };
    

    const handleQuestionMenuClick = async (e, questionId) => {
        e.domEvent.stopPropagation();
        const question = questions.find(q => q.id === questionId);
        switch (e.key) {
            case 'edit':
                if (question) {
                    setSelectedQuestion(question);
                    handleEditQuestion(question.id)
                }
                break;
            case 'delete':
                await handleDeleteQuestion(questionId);
                break;
            default:
                break;
        }
    };

    const handleQuestionDropdownVisibleChange = (questionId, flag) => {
        setQuestionDropdownVisible(prev => ({ ...prev, [questionId]: flag }));
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
                                <div style={{ display: 'flex', padding: '2px 9px 2px 10px', boxShadow: '0 0 0.8px', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                                    <div>
                                        <h4 className="font-medium">
                                            {`${question.questionNumber}. ${question.questionText}`}
                                        </h4>
                                        <span style={{ display: 'block', color: 'gray', marginTop: '4px' }}>
                                            {question.commentQuestion}
                                        </span>
                                    </div>
                                    {question.responsetype === 'multipleChoice' && (
                                        <Button
                                            onClick={() => handleViewOptions(question.id)}
                                        >
                                            Ver Opciones
                                        </Button>
                                    )}
                                    <Dropdown
                                        overlay={renderQuestionMenu(question.id)}
                                        trigger={['click']}
                                        visible={QuestionDropdownVisible[question.id] || false}
                                        onVisibleChange={(flag) => handleQuestionDropdownVisibleChange(question.id, flag)}
                                    >
                                        <Button icon={<MoreOutlined />} onClick={(e) => e.stopPropagation()} />
                                    </Dropdown>
                                </div>
                            </List.Item>
                        )}
                    />
                ) : (
                    <p>No hay preguntas disponibles.</p>
                )}
                <div style={{ marginTop: '8px' }}>
                    <Button type="primary" style={{ marginLeft: '8px' }} onClick={() => setCreateQuestionVisible(true)}>
                        Crear Pregunta
                    </Button>
                </div>
            </Modal>

            <Modal
                title="Editar Pregunta"
                open={editQuestionVisible}
                onCancel={() => {
                    setEditQuestionVisible(false);
                    form.resetFields();
                }}
                footer={null}
                width={600}
            >
                <Form form={form} layout="vertical" onFinish={handleEditQuestionSubmit}>
                    <Form.Item
                        name="questionNumber"
                        label="Número de la Pregunta"
                        rules={[{ required: true, message: 'Por favor ingresa el número de la pregunta.' }]}
                    >
                        <Input type="number" />
                    </Form.Item>
                    <Form.Item
                        name="questionText"
                        label="Texto de la Pregunta"
                        rules={[{ required: true, message: 'Por favor ingresa el texto de la pregunta.' }]}
                    >
                        <Input.TextArea rows={4} />
                    </Form.Item>
                    <Form.Item
                        name="commentQuestion"
                        label="Comentario"
                    >
                        <Input.TextArea rows={2} />
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit">Guardar</Button>
                        <Button style={{ marginLeft: 8 }} onClick={() => {
                            setEditQuestionVisible(false);
                            form.resetFields();
                        }}>Cancelar</Button>
                    </Form.Item>
                </Form>
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
                title={`Opciones de la Pregunta - ${selectedQuestion?.questionNumber}`}
                open={optionsVisible}
                onCancel={() => {
                    setOptionsVisible(false);
                    setSelectedQuestion(null);
                }}
                footer={null}
                width={800}
            >
                {selectedQuestion && (
                    <>
                        <h4 className="font-medium">{`${selectedQuestion.questionNumber}. ${selectedQuestion.questionText}`}</h4>
                        <p style={{ color: 'gray' }}>{selectedQuestion.commentQuestion}</p>
                        <List
                            dataSource={options} // Usa el estado de opciones
                            renderItem={(option) => (
                                <List.Item>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                                        <div>
                                            <strong>{option.key}:</strong> {option.optionText}
                                        </div>
                                    </div>
                                </List.Item>
                            )}
                        />
                    </>
                )}
            </Modal>

            <CreateQuestionModal
                createQuestionVisible={createQuestionVisible}
                setCreateQuestionVisible={setCreateQuestionVisible}
                chapterId={currentChapter?.id || null}
            />

        </section>
    );
};

export default SurveyList;
