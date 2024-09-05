import axios from "axios";

const API_CREATE_CHAPTER_URL = 'http://localhost:6969/chapters/create';

const getToken = () => localStorage.getItem('token');

export const createChapter = async (surveyId, newChapter) => {
    const token = getToken();
    
    try {
        const chapterData = {
            ...newChapter,
            survey: { id: surveyId }
        };

        const response = await axios.post(API_CREATE_CHAPTER_URL, chapterData, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        

        console.log('Chapter created successfully:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error creating chapter:', error.response ? error.response.data : error.message);
        throw error;
    }
}
