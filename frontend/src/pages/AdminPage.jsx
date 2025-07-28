import React, { useEffect, useState } from 'react';

export default function AdminPage({ user }) {
  const [discounts, setDiscounts] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Получаем скидки
    fetch('http://62.84.102.222:8000/discounts/')
      .then(res => res.json())
      .then(data => setDiscounts(data))
      .catch(() => setDiscounts([]));

    // Получаем пользователей
    fetch('http://62.84.102.222:8000/users/')
      .then(res => res.json())
      .then(data => setUsers(data))
      .catch(() => setUsers([]))
      .finally(() => setLoading(false));
  }, []);

  const handleDeleteDiscount = (id) => {
    if (!window.confirm('Удалить скидку?')) return;
    fetch(`http://62.84.102.222:8000/discounts/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': 'Bearer ' + localStorage.getItem('token')
      }
    })
      .then(res => {
        if (res.ok) {
          setDiscounts(discounts => discounts.filter(d => d.id !== id));
        } else {
          alert('Ошибка удаления');
        }
      });
  };

  const handleDeleteUser = (id) => {
    if (!window.confirm('Удалить пользователя?')) return;
    fetch(`http://62.84.102.222:8000/users/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': 'Bearer ' + localStorage.getItem('token')
      }
    })
      .then(res => {
        if (res.ok) {
          setUsers(users => users.filter(u => u.id !== id));
        } else {
          alert('Ошибка удаления');
        }
      });
  };

  if (loading) return <div>Загрузка...</div>;

  return (
    <div>
      <h2>Админ-панель: Скидки</h2>
      <ul>
        {discounts.map(discount => (
          <li key={discount.id}>
            <strong>{discount.title}</strong>
            <button style={{marginLeft: 16}} onClick={() => handleDeleteDiscount(discount.id)}>
              Удалить
            </button>
          </li>
        ))}
      </ul>
      <h2>Пользователи</h2>
      <ul>
        {users.map(u => (
          <li key={u.id}>
            {u.email} ({u.username})
            <button style={{marginLeft: 16}} onClick={() => handleDeleteUser(u.id)}>
              Удалить
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
