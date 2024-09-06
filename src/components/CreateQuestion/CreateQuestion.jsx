import React, { useState } from 'react';
import { Modal, Form, Input, Button, Select, message } from 'antd';
import { createQuestion, createOption } from '../../services/QuestionService';

const { Option } = Select;

const CreateQuestionModal = ({ createQuestionVisible, setCreateQuestionVisible, chapterId }) => {
    const [form] = Form.useForm();
    const [questionType, setQuestionType] = useState('text');
    const [options, setOptions] = useState([{ key: '', optionText: '' }]);

    const handleAddOption = () => {
        setOptions([...options, { key: '', optionText: '' }]);
    };

    const handleRemoveOption = (index) => {
        setOptions(options.filter((_, i) => i !== index));
    };

    const handleOptionChange = (index, field, value) => {
        const newOptions = [...options];
        newOptions[index][field] = value;
        setOptions(newOptions);
    };

    const onFinish = async (values) => {
        const questionData = {
            questionNumber: values.questionNumber || "", // Corrected
            responseType: values.responseType || "", // Corrected
            commentQuestion: values.commentQuestion || "", // Corrected
            questionText: values.questionText || "" // Corrected
        };
    
        console.log('Submitting:', questionData);
        console.log('Options:', options);
    
        try {
            console.log(chapterId)
            const createdQuestion = await createQuestion(chapterId, questionData);
    
            if (values.responseType === 'multipleChoice') {
                const optionPromises = options.map(option => {
                    return createOption(createdQuestion.id, {
                        key: option.key,
                        optionText: option.optionText
                    });
                });
    
                await Promise.all(optionPromises);
                questionData.options = options;
            }
    
            message.success("Pregunta creada exitosamente.")
            setCreateQuestionVisible(false);
            form.resetFields();
        } catch (error) {
            message.error('Error creating question');
            console.error('Error creating question:', error);
        }
    };
    
    

    return (
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
            <Form form={form} layout="vertical" onFinish={onFinish}>
                <Form.Item
                    name="questionNumber"
                    label="Número de la Pregunta"
                    rules={[{ required: true, message: 'Por favor ingresa el número de la pregunta.' }]}
                >
                    <Input type="number" />
                </Form.Item>

                <Form.Item
                    name="responseType"
                    label="Tipo de Pregunta"
                    rules={[{ required: true, message: 'Por favor selecciona el tipo de pregunta.' }]}
                >
                    <Select value={questionType} onChange={setQuestionType}>
                        <Option value="text">Texto</Option>
                        <Option value="multipleChoice">Opción Múltiple</Option>
                    </Select>
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

                {questionType === 'multipleChoice' && (
                    <Form.Item label="Opciones">
                        {options.map((option, index) => (
                            <div key={index} style={{ display: 'flex', marginBottom: 8 }}>
                                <Form.Item style={{ margin: 0, width: 'calc(30% - 8px)' }}>
                                    <Input
                                        value={option.key}
                                        onChange={(e) => handleOptionChange(index, 'key', e.target.value)}
                                        placeholder={`Clave ${index + 1}`}
                                        style={{ width: '100%' }}
                                    />
                                </Form.Item>
                                <Form.Item style={{ margin: 0, width: 'calc(60% - 8px)' }}>
                                    <Input
                                        value={option.optionText}
                                        onChange={(e) => handleOptionChange(index, 'optionText', e.target.value)}
                                        placeholder={`Opción ${index + 1}`}
                                        style={{ width: '100%' }}
                                    />
                                </Form.Item>
                                <Button
                                    type="link"
                                    danger
                                    onClick={() => handleRemoveOption(index)}
                                    style={{ marginLeft: 8 }}
                                >
                                    Eliminar
                                </Button>
                            </div>
                        ))}
                        <Button type="dashed" onClick={handleAddOption} style={{ width: '100%' }}>
                            Añadir Opción
                        </Button>
                    </Form.Item>
                )}

                <Form.Item>
                    <Button type="primary" htmlType="submit">Guardar</Button>
                    <Button style={{ marginLeft: 8 }} onClick={() => {
                        setCreateQuestionVisible(false);
                        form.resetFields();
                    }}>Cancelar</Button>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default CreateQuestionModal;
