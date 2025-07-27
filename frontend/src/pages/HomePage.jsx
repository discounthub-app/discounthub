import React from 'react';

const HomePage = ({ user, onLogout }) => {
  return (
    <div>
      <h2>Главная</h2>
      {user ? (
        <>
          <p>Добро пожаловать, <strong>{user.username}</strong>!</p>
          <button onClick={onLogout}>Выйти</button>
        </>
      ) : (
        <p>Загрузка пользователя...</p>
      )}
    </div>
  );
};

export default HomePage;
