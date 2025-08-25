cd /app/frontend && cat > src/pages/DiscountsPage.jsx <<'JSX'
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getFavorites, addFavorite, removeFavorite } from '../api/favorite';

// Базовый URL из Vite ENV (фолбэк)
const RAW = import.meta?.env?.VITE_API_URL;
const API_URL = (RAW && String(RAW).trim().replace(/\/+$/, '')) || 'http://62.84.102.222:8000';

export default function DiscountsPage({ user }) {
  const [discounts, setDiscounts] = useState([]);
  const [favorites, setFavorites] = useState([]); // id избранных скидок
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [storeId, setStoreId] = useState('');
  const [onlyNearby, setOnlyNearby] = useState(false);
  const [coords, setCoords] = useState(null);
  const [error, setError] = useState(null);

  // Токен: новый ключ dh_token, фолбэк на старый token
  const token = localStorage.getItem('dh_token') || localStorage.getItem('token');

  async function refreshFavorites() {
    try {
      if (!token) {
        setFavorites([]);
        return;
      }
      const favs = await getFavorites(token);
      setFavorites(favs.map((f) => f.discount_id));
    } catch {
      setFavorites([]);
    }
  }

  // Подгрузить избранное при монтировании
  useEffect(() => {
    refreshFavorites();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  // Геолокация при включении onlyNearby
  useEffect(() => {
    if (onlyNearby && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setCoords(pos.coords),
        () => {
          setCoords(null);
          alert('Не удалось получить геолокацию.');
          setOnlyNearby(false);
        }
      );
    }
  }, [onlyNearby]);

  // Первичная загрузка скидок
  useEffect(() => {
    let abort = false;
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`${API_URL}/discounts/`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        if (!res.ok) {
          const msg = await res.text().catch(() => `HTTP ${res.status}`);
          throw new Error(msg || `HTTP ${res.status}`);
        }
        const data = await res.json();
        if (!abort) setDiscounts(Array.isArray(data) ? data : data?.items || []);
      } catch (e) {
        if (!abort) {
          setDiscounts([]);
          setError(e?.message || 'Ошибка загрузки');
        }
      } finally {
        if (!abort) setLoading(false);
      }
    }
    load();
    return () => { abort = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Применить фильтры и поиск
  const handleFilter = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const url = new URL(`${API_URL}/discounts/`);
      if (query) {
        url.searchParams.set('q', query);
        url.searchParams.set('query', query);
      }
      if (categoryId) url.searchParams.set('category_id', String(categoryId));
      if (storeId) url.searchParams.set('store_id', String(storeId));
      if (onlyNearby && coords) {
        url.searchParams.set('lat', String(coords.latitude));
        url.searchParams.set('lon', String(coords.longitude));
      }

      const res = await fetch(url.toString(), {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (!res.ok) {
        const msg = await res.text().catch(() => `HTTP ${res.status}`);
        throw new Error(msg || `HTTP ${res.status}`);
      }
      const data = await res.json();
      setDiscounts(Array.isArray(data) ? data : data?.items || []);
    } catch (e) {
      setDiscounts([]);
      setError(e?.message || 'Ошибка загрузки');
    } finally {
      setLoading(false);
    }
  };

  // Устойчивая обработка избранного
  const toggleFavorite = async (discountId) => {
    if (!token) return;
    const isFav = favorites.includes(discountId);

    try {
      if (!isFav) {
        // Пытаемся добавить
        const r = await addFavorite(token, discountId);
        // если сервер сказал "Already in favorites", попробуем удалить (на всякий случай)
        if (r?.detail === 'Already in favorites') {
          await removeFavorite(token, discountId);
        }
      } else {
        // Пытаемся удалить
        try {
          await removeFavorite(token, discountId);
        } catch (e) {
          // Если на сервере нет записи — добавим обратно (выравнивание состояния)
          const msg = (e && e.message) || '';
          if (msg.includes('Not in favorites') || msg.includes('404')) {
            await addFavorite(token, discountId);
          } else {
            throw e;
          }
        }
      }
    } catch (e) {
      // опционально: показать уведомление
      console.warn('favorites toggle failed:', e);
    } finally {
      // Всегда синхронизируем с сервером
      await refreshFavorites();
    }
  };

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
          onChange={(e) => setQuery(e.target.value)}
          style={{ marginBottom: 8, width: '100%' }}
        />
        <div style={{ marginBottom: 8 }}>
          <input
            type="number"
            placeholder="ID категории"
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            style={{ marginRight: 8, width: 120 }}
          />
          <input
            type="number"
            placeholder="ID магазина"
            value={storeId}
            onChange={(e) => setStoreId(e.target.value)}
            style={{ marginRight: 8, width: 120 }}
          />
        </div>

        <label style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
          <input
            type="checkbox"
            checked={onlyNearby}
            onChange={(e) => setOnlyNearby(e.target.checked)}
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
        style={{ width: '100%', marginBottom: 16, background: '#ffdb4d', padding: 10, fontWeight: 600 }}
      >
        Показать на карте
      </button>

      {loading ? (
        <div>Загрузка...</div>
      ) : error ? (
        <div style={{ color: '#a00', marginBottom: 10 }}>{error}</div>
      ) : (
        <ul style={{ padding: 0, listStyle: 'none' }}>
          {discounts.length === 0 && <li>Нет скидок</li>}
          {discounts.map((discount) => (
            <li
              key={discount.id}
              style={{ border: '1px solid #eee', borderRadius: 10, padding: 12, marginBottom: 10, display: 'flex', alignItems: 'center' }}
            >
              <Link to={`/discounts/${discount.id}`} style={{ flex: 1 }}>
                <strong>{discount.title || discount.name || `Скидка #${discount.id}`}</strong>
              </Link>
              <button
                onClick={() => toggleFavorite(discount.id)}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: 22,
                  color: favorites.includes(discount.id) ? '#f90' : '#bbb',
                  cursor: 'pointer',
                  marginLeft: 10
                }}
                aria-label="В избранное"
                title={favorites.includes(discount.id) ? 'Убрать из избранного' : 'В избранное'}
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
JSX
cd /app
