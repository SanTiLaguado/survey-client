import axios from "axios";

const API_VIEW_ALL_URL = 'http://localhost:6969/survey/all';
const API_VIEW_ALL_PUBLIC_URL = 'http://localhost:6969/survey/all/public';
const API_CREATE_SURVEY_URL = 'http://localhost:6969/survey/create';

const API_UPDATE_SURVEY_URL = (surveyId) => `http://localhost:6969/survey/update/${surveyId}`;
const API_POST_SURVEY_URL = (surveyId) => `http://localhost:6969/survey/post/${surveyId}`;

const API_SURVEY_CHAPTERS_URL = (surveyId) => `http://localhost:6969/chapters/survey/${surveyId}`;
const API_DELETE_SURVEY_URL = (surveyId) => `http://localhost:6969/surveys/survey/${surveyId}`;
const API_CHAPTER_QUESTIONS_URL = (chapterId) => `http://localhost:6969/questions/chapter/${chapterId}`;

const API_DELETE_CHAPTER_URL = (chapterId) => `http://localhost:6969/chapters/delete/${chapterId}`;
const API_UPDATE_CHAPTER_URL = (chapterId) => `http://localhost:6969/chapters/update/${chapterId}`;

const getToken = () => localStorage.getItem('token');

const fetchWithToken = async (url) => {
    try {
        const token = getToken();
        const response = await axios.get(url, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return response;
    } catch (error) {
        console.error('Error fetching data:', error);
        return { data: [] };
    }
}

export const createSurvey = async (newSurvey) => {
    const token = getToken();

    console.log(newSurvey)
    
    try {
        const response = await axios.post(API_CREATE_SURVEY_URL, newSurvey, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        

        console.log('Chapter created successfully:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error creating chapter:', error.response ? error.response.data : error.message);
        throw error;
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

export const updateSurvey = async (surveyId, updatedSurvey) => {
    try {
        const token = getToken();
        const response = await axios.put(API_UPDATE_SURVEY_URL(surveyId), updatedSurvey, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json' 
            }
        });
        return response.data; 
    } catch (error) {
        console.error('Error updating survey:', error);
        throw error; 
    }
}

export const postSurvey = async (surveyId, status) => {
    try {
        const token = getToken();
        const response = await axios.put(API_POST_SURVEY_URL(surveyId), status, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json' 
            }
        });
        return response.data; 
    } catch (error) {
        console.error('Error updating survey:', error);
        throw error; 
    }
}

export const deleteChapter = async (chapterId) => {
    try {
        const token = getToken();
        const response = await axios.delete(API_DELETE_CHAPTER_URL(chapterId), {
            headers: {
                'Authorization': `Bearer ${token}`,
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error deleting chapter:', error);
        throw error;
    }
};

export const deleteSurvey = async (surveyId) => {
    try {
        const token = getToken();
        const response = await axios.delete(API_DELETE_SURVEY_URL(surveyId), {
            headers: {
                'Authorization': `Bearer ${token}`,
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error deleting survey:', error);
        throw error;
    }
};


export const updateChapter = async (chapterId, updatedChapter) => {
    console.log(updatedChapter)
    try {
        const token = getToken();
        const response = await axios.put(API_UPDATE_CHAPTER_URL(chapterId), updatedChapter, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json' 
            }
        });
        return response.data; 
    } catch (error) {
        console.error('Error updating survey:', error);
        throw error; 
    }
}