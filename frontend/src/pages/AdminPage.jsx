import React, { useEffect, useState } from 'react';

export default function AdminPage({ user }) {
  const [discounts, setDiscounts] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Фильтры
  const [discountQuery, setDiscountQuery] = useState('');
  const [userQuery, setUserQuery] = useState('');

  useEffect(() => {
    fetch('http://62.84.102.222:8000/discounts/')
      .then(res => res.json())
      .then(data => setDiscounts(data))
      .catch(() => setDiscounts([]));

    fetch('http://62.84.102.222:8000/users/')
      .then(res => res.json())
      .then(data => setUsers(data))
      .catch(() => setUsers([]))
      .finally(() => setLoading(false));
  }, []);

  // Фильтрация скидок по названию
  const filteredDiscounts = discounts.filter(discount =>
    discount.title.toLowerCase().includes(discountQuery.toLowerCase())
  );

  // Фильтрация пользователей по email или username
  const filteredUsers = users.filter(u =>
    u.email.toLowerCase().includes(userQuery.toLowerCase()) ||
    (u.username && u.username.toLowerCase().includes(userQuery.toLowerCase()))
  );

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
      <input
        type="text"
        placeholder="Поиск по названию скидки"
        value={discountQuery}
        onChange={e => setDiscountQuery(e.target.value)}
        style={{marginBottom: 10, width: 260}}
      />
      <ul>
        {filteredDiscounts.map(discount => (
          <li key={discount.id}>
            <strong>{discount.title}</strong>
            <button style={{marginLeft: 16}} onClick={() => handleDeleteDiscount(discount.id)}>
              Удалить
            </button>
          </li>
        ))}
        {filteredDiscounts.length === 0 && <li>Нет подходящих скидок</li>}
      </ul>

      <h2>Пользователи</h2>
      <input
        type="text"
        placeholder="Поиск по email или username"
        value={userQuery}
        onChange={e => setUserQuery(e.target.value)}
        style={{marginBottom: 10, width: 260}}
      />
      <ul>
        {filteredUsers.map(u => (
          <li key={u.id}>
            {u.email} ({u.username})
            <button style={{marginLeft: 16}} onClick={() => handleDeleteUser(u.id)}>
              Удалить
            </button>
          </li>
        ))}
        {filteredUsers.length === 0 && <li>Нет подходящих пользователей</li>}
      </ul>
    </div>
  );
}
