import React, { lazy, Suspense } from 'react';
import { createBrowserRouter } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute.jsx';

const Auth = lazy(() => import('../components/Auth/Auth.jsx'));
const Unauthorized = lazy(() => import('../components/Auth/Unauthorized.jsx'));
const Dashboard = lazy(() => import('../pages/Dashboard.jsx'));

const Router = createBrowserRouter([
  {
    path: "/",
    element: (
      <Suspense fallback={<div>Loading...</div>}>
        <Auth />
      </Suspense>
    ),
  },
  {
    path: "/login",
    element: (
      <Suspense fallback={<div>Loading...</div>}>
        <Auth />
      </Suspense>
    ),
  },
  {
    path: "/unauthorized",
    element: (
      <Suspense fallback={<div>Loading...</div>}>
        <Unauthorized />
      </Suspense>
    ),
  },
  {
    path: "/dashboard",
    element: (
      <ProtectedRoute allowedRoles={['ADMIN', 'USER']}>
        <Suspense fallback={<div>Loading...</div>}>
          <Dashboard />
        </Suspense>
      </ProtectedRoute>
    ),
  },
]);

export default Router;
