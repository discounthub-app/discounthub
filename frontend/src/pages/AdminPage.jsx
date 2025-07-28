import React, { useEffect, useState } from 'react';

export default function AdminPage({ user }) {
  const [discounts, setDiscounts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://62.84.102.222:8000/discounts/')
      .then(res => res.json())
      .then(data => setDiscounts(data))
      .catch(() => setDiscounts([]))
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = (id) => {
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

  if (loading) return <div>Загрузка...</div>;

  return (
    <div>
      <h2>Админ-панель: Скидки</h2>
      <ul>
        {discounts.map(discount => (
          <li key={discount.id}>
            <strong>{discount.title}</strong>
            <button style={{marginLeft: 16}} onClick={() => handleDelete(discount.id)}>
              Удалить
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
