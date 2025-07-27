import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import { getCurrentUser } from './api/auth';

function App() {
  const [user, setUser] = useState(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    console.log('🔄 useEffect запущен');

    const token = localStorage.getItem('token');
    console.log('📦 token из localStorage:', token);

    if (!token) {
      setChecking(false);
      return;
    }

    getCurrentUser(token)
      .then((data) => {
        console.log('✅ Пользователь получен:', data);
        setUser(data);
      })
      .catch((err) => {
        console.error('❌ Ошибка getCurrentUser:', err);
        localStorage.removeItem('token');
      })
      .finally(() => {
        setChecking(false);
      });
  }, []);

  const handleLogout = () => {
    console.log('🚪 Выход');
    localStorage.removeItem('token');
    setUser(null);
  };

  if (checking) {
    console.log('⏳ Проверка токена...');
    return <p>Загрузка...</p>;
  }

  console.log('🧠 user:', user);

  return (
    <>
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
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </>
  );
}

export default App;
