const RAW_API_URL =
  import.meta.env.VITE_API_URL && String(import.meta.env.VITE_API_URL).trim().replace(/\/+$/, '');
export const API_URL = RAW_API_URL || 'http://62.84.102.222:8000';

function assertOk(res: Response) {
  if (!res.ok) throw new Error(`HTTP ${res.status} ${res.statusText}`);
}

export async function apiPostForm<T>(path: string, data: Record<string, string>): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams(data),
  });
  if (!res.ok) {
    const msg = await res.text().catch(() => '');
    throw new Error(msg || `Request failed: ${res.status}`);
  }
  return res.json() as Promise<T>;
}

export async function apiGetAuth<T>(path: string, token: string): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, { headers: { Authorization: `Bearer ${token}` } });
  assertOk(res);
  return res.json() as Promise<T>;
}

/** FastAPI OAuth2PasswordRequestForm ждёт поля username/password (x-www-form-urlencoded) */
export async function loginRequest(email: string, password: string) {
  return apiPostForm<{ access_token: string; token_type: string }>('/auth/login', {
    username: email,
    password,
  });
}
