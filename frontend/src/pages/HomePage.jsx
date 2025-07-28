import React from 'react';
import { Link } from 'react-router-dom';

export default function HomePage({ user, onLogout }) {
  return (
    <div>
      <h2>Добро пожаловать, {user.username || user.email}</h2>
      <nav style={{ marginBottom: 20 }}>
        <Link to="/discounts" style={{ marginRight: 20 }}>Скидки</Link>
        <Link to="/profile" style={{ marginRight: 20 }}>Профиль</Link>
        {user.is_admin && (
          <Link to="/admin" style={{ marginRight: 20, fontWeight: 'bold', color: 'crimson' }}>
            Админка
          </Link>
        )}
        <button onClick={onLogout}>Выйти</button>
      </nav>
      <div>
        {/* Можно добавить что-то ещё, например, приветствие */}
        <p>Выберите раздел в меню</p>
      </div>
    </div>
  );
}
