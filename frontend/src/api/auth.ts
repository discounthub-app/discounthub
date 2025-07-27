const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

export async function login(email: string, password: string) {
  const response = await fetch(`${API_URL}/auth/token`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({ username: email, password }),
  });

  if (!response.ok) {
    throw new Error("Неверный email или пароль");
  }

  return response.json();
}

export async function getCurrentUser(token: string) {
  const response = await fetch(`${API_URL}/auth/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Не удалось получить данные пользователя");
  }

  return response.json();
}
