import { useEffect, useState } from 'react';
import { apiGetAuth } from '../lib/api';
import { getToken } from '../hooks/useAuth';

type Me = { id?: number; email?: string; username?: string; role?: string } & Record<string, any>;

export default function MePage() {
  const [data, setData] = useState<Me | null>(null);
  const [error, setError] = useState<string | null>(null);
  const token = getToken();

  useEffect(() => {
    (async () => {
      try {
        if (!token) {
          setError('Токен не найден. Войдите на /login');
          return;
        }
        const me = await apiGetAuth<Me>('/auth/me', token);
        setData(me);
      } catch (e: any) {
        setError(e?.message || 'Ошибка получения профиля');
      }
    })();
  }, [token]);

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-semibold">Профиль (/auth/me)</h1>
      {!token && <div className="text-sm">Нет токена. Перейдите на /login и авторизуйтесь.</div>}
      {error && <div className="text-sm border rounded p-2 border-red-300 bg-red-50">{error}</div>}
      {data && (
        <pre className="text-sm border rounded p-3 overflow-auto bg-gray-50">
{JSON.stringify(data, null, 2)}
        </pre>
      )}
    </div>
  );
}
