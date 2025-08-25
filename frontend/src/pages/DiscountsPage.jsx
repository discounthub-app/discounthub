import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getFavorites, addFavorite, removeFavorite } from '../api/favorite';
import { API_URL } from '../lib/api'; // единый базовый URL

export default function DiscountsPage({ user }) {
  const [discounts, setDiscounts] = useState([]);
  const [favorites, setFavorites] = useState([]); // массив discount_id
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [query, setQuery] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [storeId, setStoreId] = useState('');
  const [onlyNearby, setOnlyNearby] = useState(false);
  const [coords, setCoords] = useState(null);

  // токен: новый ключ dh_token, фолбэк на старый token
  const token = localStorage.getItem('dh_token') || localStorage.getItem('token');

  // ---- Favorites helpers ----
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

  useEffect(() => {
    refreshFavorites();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  // ---- Geolocation ----
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

  // ---- Initial load ----
  useEffect(() => {
    let abort = false;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`${API_URL}/discounts/`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        if (!res.ok) throw new Error(await res.text().catch(() => `HTTP ${res.status}`));
        const data = await res.json();
        if (!abort) setDiscounts(Array.isArray(data) ? data : data?.items || []);
      } catch (e) {
        if (!abort) {
          setError(e?.message || 'Ошибка загрузки');
          setDiscounts([]);
        }
      } finally {
        if (!abort) setLoading(false);
      }
    })();
    return () => {
      abort = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ---- Filter/search ----
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
      if (!res.ok) throw new Error(await res.text().catch(() => `HTTP ${res.status}`));
      const data = await res.json();
      setDiscounts(Array.isArray(data) ? data : data?.items || []);
    } catch (e) {
      setError(e?.message || 'Ошибка загрузки');
      setDiscounts([]);
    } finally {
      setLoading(false);
    }
  };

  // ---- Favorites toggle ----
  const toggleFavorite = async (discountId) => {
    if (!token) return;
    try {
      if (favorites.includes(discountId)) {
        await removeFavorite(token, discountId);
      } else {
        await addFavorite(token, discountId);
      }
    } catch (e) {
      console.warn('favorites toggle failed:', e);
    } finally {
      await refreshFavorites();
    }
  };

  const handleShowMap = () => window.open('https://yandex.ru/maps/', '_blank');

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
        <div>Загрузка…</div>
      ) : error ? (
        <div style={{ color: '#a00', marginBottom: 10 }}>{error}</div>
      ) : (
        <ul style={{ padding: 0, listStyle: 'none' }}>
          {discounts.length === 0 && <li>Нет скидок</li>}
          {discounts.map((d) => (
            <li
              key={d.id}
              style={{
                border: '1px solid #eee',
                borderRadius: 10,
                padding: 12,
                marginBottom: 10,
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <Link to={`/discounts/${d.id}`} style={{ flex: 1 }}>
                <strong>{d.title || d.name || `Скидка #${d.id}`}</strong>
              </Link>

              {/* ⭐ важно остановить переход по Link */}
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  toggleFavorite(d.id);
                }}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: 22,
                  color: favorites.includes(d.id) ? '#f90' : '#bbb',
                  cursor: 'pointer',
                  marginLeft: 10,
                }}
                aria-label="В избранное"
                title={favorites.includes(d.id) ? 'Убрать из избранного' : 'В избранное'}
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