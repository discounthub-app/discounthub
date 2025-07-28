const API_URL = 'http://62.84.102.222:8000';

export async function login(email: string, password: string) {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      email: email,     // ✅ ключ должен быть "email", а не "username"
      password: password
    })
  });

  if (!response.ok) {
    throw new Error('Ошибка входа');
  }

  return await response.json();
}
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
