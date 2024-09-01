import axios from 'axios';

const API_LOGIN_URL = 'http://localhost:6969/auth/login';
const API_REGISTER_URL = 'http://localhost:6969/auth/register';

export const login = async (email, password) => {
  try {
    const response = await axios.post(API_LOGIN_URL, { email, password });
    const { token, role } = response.data;

    localStorage.setItem('token', token);
    localStorage.setItem('role', role);

    return { token, role };
  } catch (error) {
    console.error('Error logging in', error);
    throw error;
  }
};

export const register = async (username, email, password) => {
  try {
    const response = await axios.post(API_REGISTER_URL, { username, email, password });
    const { token, role } = response.data;

    localStorage.setItem('token', token);
    localStorage.setItem('role', role);

    return { token, role };
  } catch (error) {
    console.error('Error registering', error);
    throw error;
  }
};

export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('role');
  window.location.href = '/login';
};

export const getToken = () => localStorage.getItem('token');
export const getRole = () => localStorage.getItem('role');
