import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getFavorites, addFavorite, removeFavorite } from '../api/favorite';
import { API_URL } from '../lib/api';   // 🔥 общий URL

export default function DiscountsPage({ user }) {
  const [discounts, setDiscounts] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [storeId, setStoreId] = useState('');
  const [onlyNearby, setOnlyNearby] = useState(false);
  const [coords, setCoords] = useState(null);

  const token = localStorage.getItem('token');

  useEffect(() => {
    if (token) {
      getFavorites(token)
        .then(favs => setFavorites(favs.map(f => f.discount_id)))
        .catch(() => setFavorites([]));
    }
  }, [token]);

  useEffect(() => {
    if (onlyNearby && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setCoords(pos.coords),
        () => {
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
    fetch(`${API_URL}/discounts/`)
      .then(res => res.json())
      .then(data => setDiscounts(data))
      .catch(() => setDiscounts([]))
      .finally(() => setLoading(false));
  }, []);

  const handleFilter = (e) => {
    e.preventDefault();
    setLoading(true);

    let url = `${API_URL}/discounts/?`;
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

  const toggleFavorite = async (discountId) => {
    if (!token) return;
    if (favorites.includes(discountId)) {
      await removeFavorite(token, discountId);
      setFavorites(favorites.filter(id => id !== discountId));
    } else {
      await addFavorite(token, discountId);
      setFavorites([...favorites, discountId]);
    }
  };

  const handleShowMap = () => {
    window.open('https://yandex.ru/maps/', '_blank');
  };

  return (
    <div style={{ padding: 12 }}>
      <h2 style={{ fontSize: 22, margin: '16px 0' }}>Скидки рядом</h2>
      <form onSubmit={handleFilter} style={{ marginBottom: 16 }}>
        {/* поля фильтров */}
        <input type="text" placeholder="Поиск"
          value={query} onChange={e => setQuery(e.target.value)} />
        <button type="submit">Применить фильтры</button>
      </form>

      <button onClick={handleShowMap}
        style={{ width: '100%', marginBottom: 16, background: '#ffdb4d', padding: 10, fontWeight: 600 }}>
        Показать на карте
      </button>

      {loading ? (
        <div>Загрузка...</div>
      ) : (
        <ul style={{ padding: 0, listStyle: 'none' }}>
          {discounts.length === 0 && <li>Нет скидок</li>}
          {discounts.map(discount => (
            <li key={discount.id} style={{ display: 'flex', alignItems: 'center' }}>
              <Link to={`/discounts/${discount.id}`} style={{ flex: 1 }}>
                <strong>{discount.title}</strong>
              </Link>
              <button
                onClick={() => toggleFavorite(discount.id)}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: 22,
                  color: favorites.includes(discount.id) ? '#f90' : '#bbb',
                  cursor: 'pointer'
                }}
              >
                ★
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
