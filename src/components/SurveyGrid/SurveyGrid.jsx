import React, { useState, useEffect } from 'react';
import { getRole } from '../../services/AuthService.js';
import { viewAll, viewAllPublic, viewChapters, viewQuestions } from '../../services/SurveyService.js';
import { Card, Col, Row, Modal, Button, List } from 'antd';

const SurveyGrid = () => {
  const [surveys, setSurveys] = useState([]);
  const [visible, setVisible] = useState(false);
  const [currentSurvey, setCurrentSurvey] = useState(null);
  const [chapters, setChapters] = useState([]);
  const [selectedChapter, setSelectedChapter] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [questionsVisible, setQuestionsVisible] = useState(false);

  useEffect(() => {
    const fetchSurveys = async () => {
      const role = getRole();
      try {
        let response;
        if (role === 'ADMIN') {
          response = await viewAll();
        } else {
          response = await viewAllPublic();
        }

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

  const handleSurveyClick = async (survey) => {
    setCurrentSurvey(survey);
    console.log(survey.id)
    const fetchedChapters = await fetchChapters(survey.id);
    setChapters(fetchedChapters);
    console.log(fetchedChapters)
    setVisible(true);
  };

  const handleChapterClick = async (chapter) => {
    setSelectedChapter(chapter);
    await fetchQuestions(chapter.id);
    setQuestionsVisible(true);
  };

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
      setQuestions(response.data && Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error('Error fetching questions:', error);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Encuestas Disponibles</h1>
      <Row gutter={[16, 16]}>
        {surveys.map((survey) => (
          <Col xs={24} sm={12} md={8} lg={6} key={survey.id}>
            <Card
              hoverable
              onClick={() => handleSurveyClick(survey)}
              className="h-full"
            >
              <h2 className="text-lg font-semibold mb-2">{survey.title}</h2>
              <p className="text-gray-600 mb-4">{survey.description}</p>
              <Button type="primary">
                Responder Encuesta
              </Button>
            </Card>
          </Col>
        ))}
      </Row>

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
                <h4 className="font-medium">{chapter.title}</h4>
              </Card>
            </List.Item>
          )}
        />
      </Modal>

      <Modal
        title={`Preguntas - ${selectedChapter?.title}`}
        open={questionsVisible}
        onCancel={() => setQuestionsVisible(false)}
        footer={null}
        width={800}
      >
        <List
          dataSource={questions}
          renderItem={(question) => (
            <List.Item>
              <div>
                <h4 className="font-medium">{question.text}</h4>
                <Button type="link">Ver</Button>
              </div>
            </List.Item>
          )}
        />
      </Modal>
    </div>
  );
};

export default SurveyGrid;
