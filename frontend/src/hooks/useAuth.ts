import { loginRequest } from '../lib/api';

const STORAGE_KEY = 'dh_token';

export function getToken(): string | null {
  return window.localStorage.getItem(STORAGE_KEY);
}
export function setToken(token: string) {
  window.localStorage.setItem(STORAGE_KEY, token);
}
export function clearToken() {
  window.localStorage.removeItem(STORAGE_KEY);
}
export async function login(email: string, password: string) {
  const { access_token } = await loginRequest(email, password);
  setToken(access_token);
  return access_token;
}
export function logout() {
  clearToken();
}
