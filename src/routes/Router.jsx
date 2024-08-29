import React, { lazy } from 'react';
import { createBrowserRouter } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute.jsx';

const Auth = lazy(() => import('../components/Auth/Auth.jsx'));
const Unauthorized = lazy(() => import('../components/Auth/Unauthorized.jsx'));
const Dashboard = lazy(() => import('../pages/Dashboard.jsx'));

const Router = createBrowserRouter([
  {
    path: "/",
    element: <Auth />,
  },
  {
    path: "/login",
    element: <Auth />,
  },
  {
    path: "/unauthorized",
    element: <Unauthorized />,
  },
  {
    path: "/",
    element: <ProtectedRoute />,
    children: [
      {
        path: "dashboard",
        element: <Dashboard />
      }
    ]
  }
]);

export default Router;
