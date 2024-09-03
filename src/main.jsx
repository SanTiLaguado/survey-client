import React, { StrictMode, Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import AppRouter from './routes/Router.jsx';
import './components/Navbar/Navbar.css'
import './components/SurveyList/SurveyList.css'
import './pages/styles/Profile.css'
import './pages/styles/Home.css'
import './index.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Suspense fallback={<div>Loading...</div>}>
      <RouterProvider router={AppRouter} />
    </Suspense>
  </StrictMode>
);
