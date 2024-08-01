import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import Login from './Components/Login';
import Admin from './Components/Admin';
import GlobalStyle from './Components/GlobalStyle';
import Dashboard from './Components/Dashboard';
import Account from './Components/Account';
import Trainer from './Components/Trainer';
import Trainee from './Components/Trainee';
import Packages from './Components/Packages';
import Payments from './Components/Payments';

const App = () => {
  return (
    <>
      <GlobalStyle />
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/admin/*" element={<PrivateRoute><Admin /></PrivateRoute>} />
        <Route path="/dashboard/*" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        <Route path="/account/*" element={<PrivateRoute><Account /></PrivateRoute>} />
        <Route path="/trainer/*" element={<PrivateRoute><Trainer /></PrivateRoute>} />
        <Route path="/trainee/*" element={<PrivateRoute><Trainee /></PrivateRoute>} />
        <Route path="/packages/*" element={<PrivateRoute><Packages /></PrivateRoute>} />
        <Route path="/payments/*" element={<PrivateRoute><Payments /></PrivateRoute>} />
        <Route path="*" element={<Navigate to="/dashboard" />} />
      </Routes>
    </Router>
    </>
  );
};

const PrivateRoute = ({ children }) => {
  const isAuthenticated = !!localStorage.getItem('token');
  const navigate = useNavigate();

  useEffect(() => {
    let logoutTimer;

    const logoutAfterTimeout = () => {
      logoutTimer = setTimeout(() => {
        localStorage.removeItem('token');
        navigate('/login');
      }, 600000);

      return () => clearTimeout(logoutTimer);
    };

    if (isAuthenticated) {
      logoutAfterTimeout();
    }

    return () => clearTimeout(logoutTimer);
  }, [isAuthenticated, navigate]);

  return isAuthenticated ? children : <Navigate to="/login" />;
};

export default App;