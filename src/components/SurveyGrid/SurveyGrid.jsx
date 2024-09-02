import React, { useState, useEffect } from 'react';
import { getRole } from '../../services/AuthService.js';
import { viewAll, viewAllPublic } from '../../services/SurveyService.js';
import { Card, Col, Row, Modal, Button, List } from 'antd';

const SurveyGrid = () => {
  const [surveys, setSurveys] = useState([]);
  const [visible, setVisible] = useState(false);
  const [currentSurvey, setCurrentSurvey] = useState(null);
  const [selectedChapter, setSelectedChapter] = useState(null);

  useEffect(() => {
    const fetchSurveys = async () => {
      const role = getRole();
      try {
        if (role === 'ADMIN') {
          const response = await viewAll();
          setSurveys(response.data); // Asume que `response.data` contiene las encuestas
        } else {
          const response = await viewAllPublic();
          setSurveys(response.data); // Asume que `response.data` contiene las encuestas
        }
      } catch (error) {
        console.error('Error fetching surveys:', error);
        // Manejo del error, puedes mostrar una notificación o mensaje al usuario
      }
    };

    fetchSurveys();
  }, []);

  const handleCardClick = (survey) => {
    setCurrentSurvey(survey);
    setVisible(true);
  };

  const handleCancel = () => {
    setVisible(false);
    setCurrentSurvey(null);
    setSelectedChapter(null);
  };

  const handleMenuClick = (e, survey) => {
    e.domEvent.stopPropagation(); // Evita que el clic en el menú propague al Card
    switch (e.key) {
      case 'edit':
        // Manejar edición
        console.log('Edit', survey);
        break;
      case 'delete':
        // Manejar eliminación
        console.log('Delete', survey);
        break;
      default:
        break;
    }
  };

  const handleChapterClick = (chapter) => {
    setSelectedChapter(chapter);
  };

  const handleResponseClick = (survey) => {
    // Manejar la lógica para responder la encuesta
    console.log('Responder encuesta', survey);
    // Redirigir al usuario a la página de respuesta de la encuesta, abrir un formulario, etc.
  };

  return (
    <>
      <Row gutter={16}>
        {surveys.map(survey => (
          <Col span={8} key={survey.id}>
            <Card
              title={survey.name} // Cambiado de title a name
              hoverable
              actions={[
                <Button key="respond" type="primary" onClick={() => handleResponseClick(survey)}>
                  Responder Encuesta
                </Button>
              ]}
              onClick={() => handleCardClick(survey)}
            >
              {survey.description}
            </Card>
          </Col>
        ))}
      </Row>

      {currentSurvey && (
        <Modal
          title={currentSurvey.name} // Cambiado de title a name
          visible={visible}
          onCancel={handleCancel}
          footer={null}
          width={800}
        >
          <h3>Capítulos</h3>
          <Row gutter={16}>
            {currentSurvey.chapters.map(chapter => (
              <Col span={12} key={chapter.id}>
                <Card
                  title={chapter.title}
                  hoverable
                  onClick={() => handleChapterClick(chapter)}
                >
                  {chapter.questions.length} Preguntas
                </Card>
              </Col>
            ))}
          </Row>

          {selectedChapter && (
            <Modal
              title={selectedChapter.title}
              visible={!!selectedChapter}
              onCancel={() => setSelectedChapter(null)}
              footer={null}
            >
              <h4>Preguntas</h4>
              <List
                dataSource={selectedChapter.questions}
                renderItem={item => (
                  <List.Item>
                    {item.text}
                  </List.Item>
                )}
              />
            </Modal>
          )}
        </Modal>
      )}
    </>
  );
};

export default SurveyGrid;
