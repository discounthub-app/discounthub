import React from 'react';

export default function ProfilePage({ user }) {
  if (!user) return <div>Нет данных пользователя</div>;
  return (
    <div>
      <h2>Профиль</h2>
      <p><b>Email:</b> {user.email}</p>
      <p><b>Имя:</b> {user.full_name || '—'}</p>
      <p><b>ID:</b> {user.id}</p>
      {/* Добавь другие поля, если нужно */}
    </div>
  );
}
