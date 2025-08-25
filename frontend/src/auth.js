export const API_URL = (import.meta?.env?.VITE_API_URL || 'http://62.84.102.222:8000').replace(/\/+$/, '');
export async function login(email, password) {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ username: email, password })
  });
  if (!res.ok) throw new Error(await res.text().catch(()=>`HTTP ${res.status}`));
  return res.json();
}
export async function me(token) {
  const res = await fetch(`${API_URL}/auth/me`, { headers: { Authorization: `Bearer ${token}` }});
  if (!res.ok) throw new Error(await res.text().catch(()=>`HTTP ${res.status}`));
  return res.json();
}
