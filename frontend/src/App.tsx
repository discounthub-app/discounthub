import React, { useState, useEffect } from 'react';
import LoginForm from './components/LoginForm';
import { getMe } from './api/auth';

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

  return (
    <div>
      <h1>DiscountHub</h1>
      {user ? (
        <div>
          <p>Вы вошли как: <strong>{user.username}</strong></p>
          <button onClick={() => {
            setToken('');
            setUser(null);
            localStorage.removeItem('token');
          }}>
            Выйти
          </button>
        </div>
      ) : (
        <LoginForm onLogin={handleLogin} />
      )}
    </div>
  );
};

export default App;
