import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

export default function DiscountsPage() {
  const [discounts, setDiscounts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [storeId, setStoreId] = useState('');
  const [onlyNearby, setOnlyNearby] = useState(false);
  const [coords, setCoords] = useState(null);

  // Запросить геолокацию пользователя при включении onlyNearby
  useEffect(() => {
    if (onlyNearby && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setCoords(pos.coords),
        (err) => {
          setCoords(null);
          alert("Не удалось получить геолокацию.");
          setOnlyNearby(false);
        }
      );
    }
  }, [onlyNearby]);

  // Первичная загрузка
  useEffect(() => {
    setLoading(true);
    fetch('http://62.84.102.222:8000/discounts/')
      .then(res => res.json())
      .then(data => setDiscounts(data))
      .catch(() => setDiscounts([]))
      .finally(() => setLoading(false));
  }, []);

  // Фильтрация и поиск
  const handleFilter = (e) => {
    e.preventDefault();
    setLoading(true);
    let url = 'http://62.84.102.222:8000/discounts/?';
    if (query) url += `query=${encodeURIComponent(query)}&`;
    if (categoryId) url += `category_id=${categoryId}&`;
    if (storeId) url += `store_id=${storeId}&`;
    if (onlyNearby && coords) {
      url += `lat=${coords.latitude}&lon=${coords.longitude}&`;
    }

    fetch(url)
      .then(res => res.json())
      .then(data => setDiscounts(data))
      .catch(() => setDiscounts([]))
      .finally(() => setLoading(false));
  };

  // Открыть Яндекс.Карты (пока без передачи меток)
  const handleShowMap = () => {
    window.open('https://yandex.ru/maps/', '_blank');
  };

  return (
    <div style={{ padding: 12 }}>
      <h2 style={{ fontSize: 22, margin: '16px 0' }}>Скидки рядом</h2>
      <form onSubmit={handleFilter} style={{ marginBottom: 16 }}>
        <input
          type="text"
          placeholder="Поиск"
          value={query}
          onChange={e => setQuery(e.target.value)}
          style={{ marginBottom: 8, width: '100%' }}
        />
        <div style={{ marginBottom: 8 }}>
          <input
            type="number"
            placeholder="ID категории"
            value={categoryId}
            onChange={e => setCategoryId(e.target.value)}
            style={{ marginRight: 8, width: 120 }}
          />
          <input
            type="number"
            placeholder="ID магазина"
            value={storeId}
            onChange={e => setStoreId(e.target.value)}
            style={{ marginRight: 8, width: 120 }}
          />
        </div>
        <label style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
          <input
            type="checkbox"
            checked={onlyNearby}
            onChange={e => setOnlyNearby(e.target.checked)}
            style={{ marginRight: 6 }}
          />
          Только рядом (по геолокации)
        </label>
        <button type="submit" style={{ width: '100%', padding: 10 }}>
          Применить фильтры
        </button>
      </form>
      <button
        onClick={handleShowMap}
        style={{ width: '100%', marginBottom: 16, background: '#ffdb4d', padding: 10, fontWeight: 600 }}>
        Показать на карте
      </button>
      {loading ? (
        <div>Загрузка...</div>
      ) : (
        <ul style={{ padding: 0, listStyle: 'none' }}>
          {discounts.length === 0 && <li>Нет скидок</li>}
          {discounts.map(discount => (
            <li key={discount.id} style={{ border: '1px solid #eee', borderRadius: 10, padding: 12, marginBottom: 10 }}>
              <Link to={`/discounts/${discount.id}`}>
                <strong>{discount.title}</strong>
              </Link>
              <span> — {discount.description}</span>
              {/* Кнопка избранного (будет позже) */}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
