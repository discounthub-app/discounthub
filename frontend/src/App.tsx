import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import DiscountsPage from './pages/DiscountsPage';
import ProfilePage from './pages/ProfilePage';
import { getCurrentUser } from './api/auth';

function App() {
  const [user, setUser] = useState(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setChecking(false);
      return;
    }
    getCurrentUser(token)
      .then((data) => setUser(data))
      .catch(() => localStorage.removeItem('token'))
      .finally(() => setChecking(false));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  if (checking) {
    return <p>Загрузка...</p>;
  }

  return (
    <Routes>
      <Route
        path="/"
        element={
          user ? (
            <HomePage user={user} onLogout={handleLogout} />
          ) : (
            <Navigate to="/login" />
          )
        }
      />
      <Route
        path="/login"
        element={
          user ? (
            <Navigate to="/" />
          ) : (
            <LoginPage onLogin={setUser} />
          )
        }
      />
      <Route
        path="/discounts"
        element={
          user ? (
            <DiscountsPage user={user} />
          ) : (
            <Navigate to="/login" />
          )
        }
      />
      <Route
        path="/profile"
        element={
          user ? (
            <ProfilePage user={user} />
          ) : (
            <Navigate to="/login" />
          )
        }
      />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default App;
