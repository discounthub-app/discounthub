const API_URL = 'http://62.84.102.222:8000';

export async function login(email: string, password: string) {
  const params = new URLSearchParams();
  params.append('username', email); // ⚠️ username, не email!
  params.append('password', password);

  const response = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: params.toString(),
  });

  if (!response.ok) {
    throw new Error('Ошибка входа');
  }

  return await response.json();
}

export async function getCurrentUser(token: string) {
  const response = await fetch(`${API_URL}/auth/me`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  if (!response.ok) {
    throw new Error('Не удалось получить пользователя');
  }

  return await response.json();
}
