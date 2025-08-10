import { useState } from 'react';
import { router } from 'expo-router';
import api from '@/lib/api';
import { tokenStorage } from '@/lib/tokenStorage';

export function useLogin() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = async (email: string, password: string) => {
    setLoading(true);
    setError(null);

    try {
      console.log('➡️ Отправляем логин:', email);

      const formData = new URLSearchParams();
      formData.append('username', email);
      formData.append('password', password);

      const response = await api.post('/auth/login', formData, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });

      console.log('✅ Ответ от сервера:', response.data);

      const token = response.data.access_token;
      console.log('🔐 Сохраняем токен:', token);

      await tokenStorage.set(token);

      router.replace('/profile');
    } catch (err: any) {
      console.log('❌ Ошибка логина:', err?.response?.data || err.message);
      setError(err?.response?.data?.detail || 'Ошибка входа');
    } finally {
      setLoading(false);
    }
  };

  return { login, loading, error };
}