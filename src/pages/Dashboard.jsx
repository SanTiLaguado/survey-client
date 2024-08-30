import React from 'react';
import { useNavigate } from 'react-router-dom';
import { getRole } from '../services/AuthService';
import AdminDashboard from '../components/AdminDashboard/AdminDashboard.jsx';
import UserDashboard from '../components/UserDashBoard/UserDashboard.jsx';

const Dashboard = () => {
  const navigate = useNavigate();
  const role = getRole();

  if (!role) {
    navigate('/login');
    return null;
  }

  if (role === 'ADMIN') {
    return <AdminDashboard />;
  } else if (role === 'USER') {
    return <UserDashboard />;
  }

};

export default Dashboard;
