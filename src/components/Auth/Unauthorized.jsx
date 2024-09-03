import React from 'react';
import { Link } from 'react-router-dom';
import './Auth.css';

const Unauthorized = () => {
  return (
    <div className='unauth-main' style={{ textAlign: 'center', padding: '30vh', fontSize: '20px'}} >
      <h1>Error 403 Forbidden</h1>
      <h1 className='development'>Feature on Development</h1>
      <p>You do not have permission to view this page.</p>
      <Link to="/">Return to Home</Link>
    </div>
  );
};

export default Unauthorized;
