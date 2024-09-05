import React, { useState } from 'react';
import { Modal, Form, Input, Button, Select } from 'antd';

const { Option } = Select;

const CreateQuestionModal = ({ createQuestionVisible, setCreateQuestionVisible, handleCreateQuestionSubmit }) => {
    const [form] = Form.useForm();
    const [questionType, setQuestionType] = useState('text'); // Default to 'text'
    const [options, setOptions] = useState([{ optionText: '' }]); // To store multiple choice options

    const handleAddOption = () => {
        setOptions([...options, { optionText: '' }]);
    };

    const handleRemoveOption = (index) => {
        const newOptions = options.filter((_, i) => i !== index);
        setOptions(newOptions);
    };

    const handleOptionChange = (index, value) => {
        const newOptions = [...options];
        newOptions[index].optionText = value;
        setOptions(newOptions);
    };

    const onFinish = (values) => {
        const questionData = {
            number: values.number,
            text: values.questionText,
            comment: values.comment,
            questionType: values.questionType,
        };
        console.log(questionData)
        console.log(options)

        if (questionType === 'multipleChoice') {
            questionData.options = options.map(option => ({
                text: option.optionText
                
            }));
        }

        handleCreateQuestionSubmit(questionData);
        setCreateQuestionVisible(false);
        form.resetFields();
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
                    name="number"
                    label="Número de la Pregunta"
                    rules={[{ required: true, message: 'Por favor ingresa el número de la pregunta.' }]}
                >
                    <Input type="number" />
                </Form.Item>

                <Form.Item
                    name="questionType"
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
                    name="comment"
                    label="Comentario"
                    rules={[{ required: false }]}
                >
                    <Input.TextArea rows={2} />
                </Form.Item>

                {questionType === 'multipleChoice' && (
                    <>
                        <Form.Item label="Opciones">
                            {options.map((option, index) => (
                                <div key={index} style={{ display: 'flex', marginBottom: 8 }}>
                                    <Input
                                        value={option.optionText}
                                        onChange={(e) => handleOptionChange(index, e.target.value)}
                                        placeholder={`Opción ${index + 1}`}
                                    />
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
                    </>
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
