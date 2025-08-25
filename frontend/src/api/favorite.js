// frontend/src/api/favorite.js
// Базовый URL из Vite ENV (фолбэк — IP сервера)
const RAW = import.meta?.env?.VITE_API_URL;
export const API_URL = (RAW && String(RAW).trim().replace(/\/+$/, '')) || 'http://62.84.102.222:8000';

function authHeaders(token) {
  return token ? { Authorization: `Bearer ${token}` } : {};
}

// Получить список избранного пользователя
export async function getFavorites(token) {
  const response = await fetch(`${API_URL}/favorites/`, {
    headers: {
      'Content-Type': 'application/json',
      ...authHeaders(token),
    },
  });
  if (!response.ok) throw new Error(await response.text().catch(() => `HTTP ${response.status}`));
  return response.json();
}

// Добавить скидку в избранное
export async function addFavorite(token, discountId) {
  const response = await fetch(`${API_URL}/favorites/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...authHeaders(token),
    },
    body: JSON.stringify({ discount_id: discountId }),
  });
  if (!response.ok) throw new Error(await response.text().catch(() => `HTTP ${response.status}`));
  return response.json();
}

// Удалить скидку из избранного
export async function removeFavorite(token, discountId) {
  const response = await fetch(`${API_URL}/favorites/`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      ...authHeaders(token),
    },
    body: JSON.stringify({ discount_id: discountId }),
  });
  if (!response.ok) throw new Error(await response.text().catch(() => `HTTP ${response.status}`));
  return response.json();
}
