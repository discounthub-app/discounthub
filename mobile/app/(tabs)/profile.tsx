import { tokenStorage } from '@/lib/tokenStorage';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

export default function ProfileScreen() {
  const [token, setToken] = useState<string | null>(null);
  const [loggingOut, setLoggingOut] = useState(false);
  const router = useRouter();

  useEffect(() => {
    (async () => {
      const stored = await tokenStorage.get();
      setToken(stored);
    })();
  }, []);

  const handleLogout = async () => {
    if (loggingOut) return;
    setLoggingOut(true);
    try {
      await tokenStorage.remove();         // важно: метод remove()
      router.replace('/(auth)/login');     // путь к экрану логина в группе (auth)
    } catch (err) {
      console.error('Ошибка при выходе:', err);
      setLoggingOut(false);
    }
  };

  return (
    <View className="flex-1 justify-center items-center bg-white p-6">
      <Text className="text-2xl font-bold text-gray-800 mb-6">Профиль</Text>

      <Text className="text-gray-500 mb-2">Текущий токен:</Text>
      <Text className="text-sm text-gray-700 mb-6 text-center">
        {token ?? 'Не найден'}
      </Text>

      <TouchableOpacity
        className="bg-red-600 py-3 px-6 rounded-xl opacity-100"
        onPress={handleLogout}
        disabled={loggingOut}
      >
        <Text className="text-white text-lg font-bold text-center">
          {loggingOut ? 'Выходим…' : 'Выйти'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}