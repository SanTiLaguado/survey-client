import React, { useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import { getRole } from '../services/AuthService.js';
import AdminHome from '../components/AdminDashboard/AdminHome.jsx';
import UserHome from '../components/UserDashBoard/UserHome.jsx';

const Home = () => {
  const navigate = useNavigate();
  const role = getRole();

  useEffect(() => {
    document.title = 'Inicio - Campus Survey';
  }, []);

  if (!role) {
    navigate('/login');
    return null;
  }

  if (role === 'ADMIN') {
    return <AdminHome />;
  } else if (role === 'USER') {
    return <UserHome />;
  }

};

export default Home;
