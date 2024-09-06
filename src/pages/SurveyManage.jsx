import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import { Modal, Button, Input, Form, message } from 'antd';
import SurveyList from '../components/SurveyList/SurveyList';
import { createSurvey } from '../services/SurveyService';

const SurveyManage = () => {
    const [createSurveyVisible, setCreateSurveyVisible] = useState(false);
    const [form] = Form.useForm();
    const navigate = useNavigate();
    const [surveys, setSurveys] = useState([]); // Assuming you'll manage surveys list

    useEffect(() => {
        document.title = 'Gestión de Encuestas - Admin Campus Survey';
    }, []);

    const handleButton = () => {
        setCreateSurveyVisible(true);
    };

    const handleCreateSurveySubmit = async (values) => {
        try {
            const createdSurvey = await createSurvey(values)

            setSurveys(prevSurveys => [...prevSurveys, createdSurvey]);

            message.success('Encuesta creada exitosamente');
            setCreateSurveyVisible(false);
            form.resetFields();
        } catch (error) {
            console.error('Error creando encuesta:', error);
            message.error('Error creando encuesta.');
        }
    };

    return (
        <section className="main" id="survmanage">
            <h1>Gestión de Encuestas</h1>
            <div className='upper-card'>
                <button className="primary-button" onClick={handleButton}>
                    Crear nueva encuesta
                </button>
            </div>
            <div className='main-card'></div>
            <SurveyList surveys={surveys} /> {/* Pass the surveys data to SurveyList */}
            <Modal
                title="Crear Encuesta"
                open={createSurveyVisible}
                onCancel={() => {
                    setCreateSurveyVisible(false);
                    form.resetFields();
                }}
                footer={null}
                width={600}
            >
                <Form form={form} layout="vertical" onFinish={handleCreateSurveySubmit}>
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
                            setCreateSurveyVisible(false);
                            form.resetFields();
                        }}>Cancelar</Button>
                    </Form.Item>
                </Form>
            </Modal>
        </section>
    );
};

export default SurveyManage;
