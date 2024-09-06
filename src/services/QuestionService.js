import axios from "axios";

const API_CREATE_QUESTION_URL = 'http://localhost:6969/questions/create';

const API_CREATE_OPTION_URL = 'http://localhost:6969/options/create'; // Assuming a different endpoint for options

const API_VIEW_QUEST_OPTIONS_URL = (questionId) => `http://localhost:6969/options/question/${questionId}`;

const API_DELETE_QUESTION_URL = (questionId) => `http://localhost:6969/questions/delete/${questionId}`;

const API_UPDATE_QUESTION_URL = (questionId) => `http://localhost:6969/questions/update/${questionId}`;

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

export const createQuestion = async (chapterId, questionData) => {
    const token = getToken();
    
    try {
        const data = {
            ...questionData,
            chapter: {id: chapterId}
        };

        const response = await axios.post(API_CREATE_QUESTION_URL, data, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        console.log('Question created successfully:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error creating question:', error.response ? error.response.data : error.message);
        throw error;
    }
}


export const createOption = async (questionId, option) => {
    const token = getToken();
    
    try {
        const optionData = {
            ...option,
            question: {id: questionId}

        };

        const response = await axios.post(API_CREATE_OPTION_URL, optionData, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        console.log('Option created successfully:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error creating option:', error.response ? error.response.data : error.message);
        throw error;
    }
}

export const viewQuestOptions = async (questionId) => {
    return await fetchWithToken(API_VIEW_QUEST_OPTIONS_URL(questionId));
}

export const deleteQuestion = async (questionId) => {
    try {
        const token = getToken();
        const response = await axios.delete(API_DELETE_QUESTION_URL(questionId), {
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

export const updateQuestion = async (questionId, values) => {
    console.log(values)
    try {
        const token = getToken();
        const response = await axios.put(API_UPDATE_QUESTION_URL(questionId), values, {
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