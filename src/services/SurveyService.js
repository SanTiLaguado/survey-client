import axios from "axios";

const API_VIEW_ALL_URL = 'http://localhost:6969/survey/all';
const API_VIEW_ALL_PUBLIC_URL = 'http://localhost:6969/survey/all/public';

const API_UPDATE_SURVEY_URL = (surveyId) => `http://localhost:6969/survey/update/${surveyId}`;

const API_SURVEY_CHAPTERS_URL = (surveyId) => `http://localhost:6969/chapters/survey/${surveyId}`;
const API_CHAPTER_QUESTIONS_URL = (chapterId) => `http://localhost:6969/questions/chapter/${chapterId}`;

// Función para obtener el token desde el almacenamiento local
const getToken = () => localStorage.getItem('token');

// Función para hacer la solicitud GET con el token JWT
const fetchWithToken = async (url) => {
    try {
        const token = getToken();
        const response = await axios.get(url, {
            headers: {
                'Authorization': `Bearer ${token}` // Incluye el token JWT en el encabezado
            }
        });
        return response;
    } catch (error) {
        console.error('Error fetching data:', error);
        return { data: [] };
    }
}

export const viewAll = async () => {
    return await fetchWithToken(API_VIEW_ALL_URL);
}

export const viewAllPublic = async () => {
    return await fetchWithToken(API_VIEW_ALL_PUBLIC_URL);
}

export const viewChapters = async (surveyId) => {
    return await fetchWithToken(API_SURVEY_CHAPTERS_URL(surveyId));
}

export const viewQuestions = async (chapterId) => {
    return await fetchWithToken(API_CHAPTER_QUESTIONS_URL(chapterId));
}

// Implementación correcta de updateSurvey
export const updateSurvey = async (surveyId, updatedSurvey) => {
    try {
        const token = getToken();
        const response = await axios.put(API_UPDATE_SURVEY_URL(surveyId), updatedSurvey, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json' // Asegura que el contenido es JSON
            }
        });
        return response.data; // Retorna los datos actualizados de la encuesta
    } catch (error) {
        console.error('Error updating survey:', error);
        throw error; // Re-lanza el error para que pueda ser manejado por la función llamante
    }
};
