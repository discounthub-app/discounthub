import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getFavorites, removeFavorite } from '../api/favorite';

export default function FavoritesPage({ user }) {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem('token');

  useEffect(() => {
    if (token) {
      setLoading(true);
      getFavorites(token)
        .then(favs => setFavorites(favs))
        .catch(() => setFavorites([]))
        .finally(() => setLoading(false));
    }
  }, [token]);

  const handleRemove = async (discountId) => {
    if (!token) return;
    await removeFavorite(token, discountId);
    setFavorites(favorites.filter(f => f.discount_id !== discountId));
  };

  return (
    <div style={{ padding: 12 }}>
      <h2 style={{ fontSize: 22, margin: '16px 0' }}>Мои избранные скидки</h2>
      {loading ? (
        <div>Загрузка...</div>
      ) : (
        <ul style={{ padding: 0, listStyle: 'none' }}>
          {favorites.length === 0 && <li>Нет избранных скидок</li>}
          {favorites.map(fav => (
            <li key={fav.id} style={{ border: '1px solid #eee', borderRadius: 10, padding: 12, marginBottom: 10, display: 'flex', alignItems: 'center' }}>
              <Link to={`/discounts/${fav.discount_id}`} style={{ flex: 1 }}>
                <strong>Скидка #{fav.discount_id}</strong>
                {/* Здесь можно добавить больше информации, если API возвращает discount.title/description */}
              </Link>
              <button
                onClick={() => handleRemove(fav.discount_id)}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: 22,
                  color: '#f90',
                  cursor: 'pointer',
                  marginLeft: 10
                }}
                aria-label="Удалить из избранного"
                title="Удалить из избранного"
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
