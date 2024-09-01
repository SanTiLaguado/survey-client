import React, { useState } from 'react';
import { Card, Col, Row, Modal, Button, List } from 'antd';

const surveys = [
  {
    id: 1,
    title: 'Encuesta 1',
    description: 'Descripción de la Encuesta 1',
    chapters: [
      {
        id: 1,
        title: 'Capítulo 1',
        questions: [
          { id: 1, text: 'Pregunta 1 del Capítulo 1' },
          { id: 2, text: 'Pregunta 2 del Capítulo 1' }
        ]
      },
      {
        id: 2,
        title: 'Capítulo 2',
        questions: [
          { id: 3, text: 'Pregunta 1 del Capítulo 2' },
          { id: 4, text: 'Pregunta 2 del Capítulo 2' }
        ]
      }
    ]
  },
  // Agrega más encuestas aquí
];

const SurveyGrid = () => {
  const [visible, setVisible] = useState(false);
  const [currentSurvey, setCurrentSurvey] = useState(null);
  const [selectedChapter, setSelectedChapter] = useState(null);

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
              title={survey.title}
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
          title={currentSurvey.title}
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
