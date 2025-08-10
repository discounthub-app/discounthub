// app/(tabs)/discount/[id].tsx
import { useToast } from '@/components/Toast';
import api from '@/lib/api';
import { tokenStorage } from '@/lib/tokenStorage';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

type Discount = {
  id: number;
  title: string;
  description?: string | null;
  price: number;
  old_price?: number | null;
  seller_id?: number | null;
};

export default function DiscountDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const numericId = Number(id);
  const router = useRouter();
  const { show } = useToast();

  const [discount, setDiscount] = useState<Discount | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        setLoading(true);
        const token = await tokenStorage.get();
        const res = await api.get(`/discounts/${numericId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!cancelled) setDiscount(res.data);
      } catch (e) {
        console.error('[DETAIL] load error:', e);
        Alert.alert('Ошибка', 'Не удалось загрузить скидку');
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    if (Number.isFinite(numericId)) load();
    return () => {
      cancelled = true;
    };
  }, [numericId]);

  const handleEdit = () => {
    router.push(`/(tabs)/discount/edit?id=${numericId}`);
  };

  const confirmDelete = () => {
    Alert.alert('Удаление', 'Удалить эту скидку?', [
      { text: 'Отмена', style: 'cancel' },
      { text: 'Удалить', style: 'destructive', onPress: handleDelete },
    ]);
  };

  const handleDelete = async () => {
    if (!numericId || deleting) return;
    try {
      setDeleting(true);
      const token = await tokenStorage.get();
      const res = await api.delete(`/discounts/${numericId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log('[DELETE] done', res.status);
      show('Скидка удалена', { type: 'success' });

      // Возвращаемся к списку скидок (надежный двойной переход)
      router.replace('/(tabs)/discount/index');
      setTimeout(() => router.navigate('/(tabs)/discount/index'), 0);
    } catch (e: any) {
      console.error('[DELETE] error:', e?.response?.data || e?.message);
      show('Не удалось удалить', { type: 'error' });
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator />
      </View>
    );
  }

  if (!discount) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <Text className="text-lg">Скидка не найдена</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white p-4">
      <Text className="text-2xl font-bold mb-1">{discount.title}</Text>
      {!!discount.description && (
        <Text className="text-gray-700 mb-1">{discount.description}</Text>
      )}
      <Text className="text-lg font-semibold mb-6">Цена: {discount.price} ₽</Text>

      {/* Редактировать */}
      <TouchableOpacity
        onPress={handleEdit}
        className="flex-row items-center gap-2 bg-yellow-500 py-3 px-4 rounded-xl mb-3"
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        disabled={deleting}
      >
        <Ionicons name="create-outline" size={22} color="#fff" />
        <Text className="text-white font-bold">Редактировать</Text>
      </TouchableOpacity>

      {/* Удалить */}
      <TouchableOpacity
        onPress={confirmDelete}
        className={`flex-row items-center gap-2 py-3 px-4 rounded-xl ${
          deleting ? 'bg-gray-400' : 'bg-red-600'
        }`}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        disabled={deleting}
      >
        <Ionicons name="trash-outline" size={22} color="#fff" />
        <Text className="text-white font-bold">
          {deleting ? 'Удаление…' : 'Удалить'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}