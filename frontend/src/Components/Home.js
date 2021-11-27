import React from 'react';

import Dashboard from './Dashboard';
import LandingPage from './LandingPage';

import auth from '../services/authService';

/***
 * The home page of the website.
 * 
 * If the user is authenticated, its the dashboard.
 * Else its the landing page
 */
function Home() {
  const isAuthenticated = auth.isAuthenticated();
  return isAuthenticated ? <Dashboard /> : <LandingPage />;
}

export default Home;
