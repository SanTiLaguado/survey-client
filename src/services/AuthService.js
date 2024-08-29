import axios from 'axios';

const API_URL = 'http://localhost:8080/auth/login';

export const login = async (username, password) => {
  try {
    const response = await axios.post(API_URL, { username, password });
    const { token, role } = response.data;

    localStorage.setItem('token', token);
    localStorage.setItem('role', role);

    return { token, role };
  } catch (error) {
    console.error('Error logging in', error);
    throw error;
  }
};

export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('role');
};

export const getToken = () => localStorage.getItem('token');
export const getRole = () => localStorage.getItem('role');


