import React, { useEffect, useState } from 'react';

export default function DiscountsPage() {
  const [discounts, setDiscounts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [storeId, setStoreId] = useState('');

  // Первичная загрузка всех скидок
  useEffect(() => {
    setLoading(true);
    fetch('http://62.84.102.222:8000/discounts/')
      .then(res => res.json())
      .then(data => setDiscounts(data))
      .catch(() => setDiscounts([]))
      .finally(() => setLoading(false));
  }, []);

  // Функция для фильтрации
  const handleFilter = (e) => {
    e.preventDefault();
    setLoading(true);
    let url = 'http://62.84.102.222:8000/discounts/?';
    if (query) url += `query=${encodeURIComponent(query)}&`;
    if (categoryId) url += `category_id=${categoryId}&`;
    if (storeId) url += `store_id=${storeId}&`;

    fetch(url)
      .then(res => res.json())
      .then(data => setDiscounts(data))
      .catch(() => setDiscounts([]))
      .finally(() => setLoading(false));
  };

  return (
    <div>
      <h2>Скидки</h2>
      <form onSubmit={handleFilter} style={{marginBottom: 20}}>
        <input
          type="text"
          placeholder="Поиск"
          value={query}
          onChange={e => setQuery(e.target.value)}
          style={{marginRight: 10}}
        />
        <input
          type="number"
          placeholder="ID категории"
          value={categoryId}
          onChange={e => setCategoryId(e.target.value)}
          style={{marginRight: 10, width: 120}}
        />
        <input
          type="number"
          placeholder="ID магазина"
          value={storeId}
          onChange={e => setStoreId(e.target.value)}
          style={{marginRight: 10, width: 120}}
        />
        <button type="submit">Применить фильтры</button>
      </form>
      {loading ? (
        <div>Загрузка...</div>
      ) : (
        <ul>
          {discounts.length === 0 && <li>Нет скидок</li>}
          {discounts.map(discount => (
            <li key={discount.id}>
              <strong>{discount.title}</strong>
              <span> — {discount.description}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
