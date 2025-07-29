const API_URL = 'http://62.84.102.222:8000';

// Получить список избранного пользователя
export async function getFavorites(token) {
  const response = await fetch(`${API_URL}/favorites/`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    }
  });
  if (!response.ok) throw new Error('Ошибка получения избранного');
  return await response.json();
}

// Добавить скидку в избранное
export async function addFavorite(token, discountId) {
  const response = await fetch(`${API_URL}/favorites/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ discount_id: discountId }),
  });
  if (!response.ok) throw new Error('Ошибка добавления');
  return await response.json();
}

// Удалить скидку из избранного
export async function removeFavorite(token, discountId) {
  const response = await fetch(`${API_URL}/favorites/`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ discount_id: discountId }),
  });
  if (!response.ok) throw new Error('Ошибка удаления');
}
