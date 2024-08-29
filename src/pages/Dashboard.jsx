import React from 'react';
import { useNavigate } from 'react-router-dom';
import { getRole } from '../services/AuthService';
import AdminDashboard from '../components/AdminDashboard/AdminDashboard.jsx';
import UserDashboard from '../components/UserDashboard/UserDashboard.jsx';

const Dashboard = () => {
  const navigate = useNavigate();

  // PROVISIONAL PARA DESARROLLO -VAR
  var role = getRole();
  // -SOBREESCRIBE EL VALOR DE ROLE PARA ENTRAR A DASHBOARD
  role = 'ROLE_ADMIN'

  if (!role) {
    navigate('/auth');
    return null;
  }

  if (role === 'ROLE_ADMIN') {
    return <AdminDashboard />;
  } else if (role === 'ROLE_USER') {
    return <UserDashboard />;
  }

};

export default Dashboard;
