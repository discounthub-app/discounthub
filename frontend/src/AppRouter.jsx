import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';

const AppRouter = ({ token, onLogin, user, onLogout }) => {
  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={<HomePage user={user} onLogout={onLogout} />}
        />
        <Route
          path="/login"
          element={<LoginPage onLogin={onLogin} />}
        />
      </Routes>
    </Router>
  );
};

export default AppRouter;
