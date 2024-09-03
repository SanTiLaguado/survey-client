import React, { lazy, Suspense } from 'react';
import { createBrowserRouter, Outlet } from 'react-router-dom';
import { getRole } from '../services/AuthService';
import ProtectedRoute from './ProtectedRoute.jsx';
import AdminNavbar from '../components/Navbar/AdminNavbar.jsx';
import UserNavbar from '../components/Navbar/UserNavbar.jsx';

const Auth = lazy(() => import('../components/Auth/Auth.jsx'));
const Unauthorized = lazy(() => import('../components/Auth/Unauthorized.jsx'));
const Home = lazy(() => import('../pages/Home.jsx'));
const Surveys = lazy(() => import('../pages/Surveys.jsx'));
const Responses = lazy(() => import('../pages/Responses.jsx'));
const Profile = lazy(() => import('../pages/Profile.jsx'));
const PostSurvey = lazy(() => import('../pages/PostSurvey.jsx'));
const SurveyManage = lazy(() => import('../pages/SurveyManage.jsx'));
const CreateSurvey = lazy(() => import('../pages/CreateSurvey.jsx'));

// Componente Layout que incluye el Navbar y Outlet para renderizar las rutas
const Layout = () => {
  const role = getRole();

  return (
    <>
      {role === 'ADMIN' ? <AdminNavbar /> : <UserNavbar />}
      <Outlet />
    </>
  );
};

const Router = createBrowserRouter([
  {
    path: '/',
    element: (
      <Suspense fallback={<div>Loading...</div>}>
        <Auth />
      </Suspense>
    ),
  },
  {
    path: '/login',
    element: (
      <Suspense fallback={<div>Loading...</div>}>
        <Auth />
      </Suspense>
    ),
  },
  {
    path: '/unauthorized',
    element: (
      <Suspense fallback={<div>Loading...</div>}>
        <Unauthorized />
      </Suspense>
    ),
  },
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        path: 'home',
        element: (
          <ProtectedRoute allowedRoles={['ADMIN', 'USER']}>
            <Suspense fallback={<div>Loading...</div>}>
              <Home />
            </Suspense>
          </ProtectedRoute>
        ),
      },
      {
        path: 'surveys',
        element: (
          <ProtectedRoute allowedRoles={['ADMIN', 'USER']}>
            <Suspense fallback={<div>Loading...</div>}>
              <Surveys />
            </Suspense>
          </ProtectedRoute>
        ),
      },
      {
        path: 'user/responses',
        element: (
          <ProtectedRoute allowedRoles={['USER']}>
            <Suspense fallback={<div>Loading...</div>}>
              <Responses />
            </Suspense>
          </ProtectedRoute>
        ),
      },
      {
        path: 'profile',
        element: (
          <ProtectedRoute allowedRoles={['ADMIN', 'USER']}>
            <Suspense fallback={<div>Loading...</div>}>
              <Profile />
            </Suspense>
          </ProtectedRoute>
        ),
      },
      {
        path: 'admin/post',
        element: (
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <Suspense fallback={<div>Loading...</div>}>
              <PostSurvey />
            </Suspense>
          </ProtectedRoute>
        ),
      },
      {
        path: 'admin/manage',
        element: (
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <Suspense fallback={<div>Loading...</div>}>
              <SurveyManage />
            </Suspense>
          </ProtectedRoute>
        ),
      },
      {
        path: 'admin/create',
        element: (
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <Suspense fallback={<div>Loading...</div>}>
              <CreateSurvey />
            </Suspense>
          </ProtectedRoute>
        ),
      }
    ],
  },
]);

export default Router;
