const API_URL = 'http://62.84.102.222:8000';

export async function login(email: string, password: string) {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      username: email, // 👈 важно: ключ должен быть username
      password: password
    })
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
