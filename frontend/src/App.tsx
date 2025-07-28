import React, { useEffect, useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import DiscountsPage from './pages/DiscountsPage';
import DiscountDetailPage from './pages/DiscountDetailPage';
import ProfilePage from './pages/ProfilePage';
import AdminPage from './pages/AdminPage';         // <--- новый импорт!
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
        path="/discounts/:id"
        element={
          user ? (
            <DiscountDetailPage user={user} />
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
      <Route
        path="/admin"
        element={
          user ? (
            <AdminPage user={user} />
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
