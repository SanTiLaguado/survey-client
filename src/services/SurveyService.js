import axios from "axios";

const API_VIEW_ALL_URL = 'http://localhost:6969/surveys/all';
const API_VIEW_ALL_PUBLIC_URL = 'http://localhost:6969/surveys/all/public';

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
        // Puedes retornar un objeto vacío o lanzar un error aquí
        return { data: [] };
    }
}

export const viewAll = async () => {
    return await fetchWithToken(API_VIEW_ALL_URL);
}

export const viewAllPublic = async () => {
    return await fetchWithToken(API_VIEW_ALL_PUBLIC_URL);
}
