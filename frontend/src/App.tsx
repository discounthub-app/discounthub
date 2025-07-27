import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';
import { getMe } from './api/auth';

const HomePage = ({ user, onLogout }) => (
  <div>
    <h1>DiscountHub</h1>
    <p>Вы вошли как: <strong>{user.username}</strong></p>
    <button onClick={onLogout}>Выйти</button>
  </div>
);

const App = () => {
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      if (token) {
        try {
          const userData = await getMe(token);
          setUser(userData);
        } catch (err) {
          console.error('Ошибка получения пользователя', err);
          setToken('');
          localStorage.removeItem('token');
        }
      }
    };
    fetchUser();
  }, [token]);

  const handleLogin = (newToken) => {
    setToken(newToken);
    localStorage.setItem('token', newToken);
  };

  const handleLogout = () => {
    setToken('');
    setUser(null);
    localStorage.removeItem('token');
  };

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            user ? (
              <HomePage user={user} onLogout={handleLogout} />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="/login"
          element={<LoginForm onLogin={handleLogin} />}
        />
        <Route path="/register" element={<RegisterForm />} />
      </Routes>
    </Router>
  );
};

export default App;
