// app/(tabs)/discount/edit.tsx
import { useToast } from '@/components/Toast';
import api from '@/lib/api';
import { tokenStorage } from '@/lib/tokenStorage';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Text, TextInput, TouchableOpacity, View } from 'react-native';

type Discount = {
  id: number;
  title: string;
  description?: string | null;
  price: number;
};

export default function EditDiscountScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { show } = useToast();

  const numericId = Number(id);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');

  useEffect(() => {
    let cancelled = false;

    const fetchDiscount = async () => {
      try {
        setLoading(true);
        const token = await tokenStorage.get();
        const res = await api.get<Discount>(`/discounts/${numericId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (cancelled) return;

        setTitle(res.data.title ?? '');
        setDescription(res.data.description ?? '');
        setPrice(res.data.price != null ? String(res.data.price) : '');
      } catch (e: any) {
        console.error('[EDIT] load error:', e?.response?.data || e?.message);
        show('Не удалось загрузить скидку', { type: 'error' });
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    if (Number.isFinite(numericId)) {
      fetchDiscount();
    } else {
      setLoading(false);
      show('Некорректный ID', { type: 'error' });
    }

    return () => {
      cancelled = true;
    };
  }, [numericId, show]);

  const handleSave = async () => {
    if (!title.trim() || !price.trim() || isNaN(Number(price))) {
      show('Введите название и корректную цену', { type: 'error' });
      return;
    }
  
    try {
      setSaving(true);
      const token = await tokenStorage.get();
  
      // соберём payload и залогируем на всякий
      const payload = {
        title: title.trim(),
        description: description.trim() || null,
        price: Number(price),
        // 👇 бекенд этого ожидает — без этого приходит 422
        seller_id: 1,
      };
      console.log('[EDIT] PUT payload:', payload);
  
      const res = await api.put(`/discounts/${numericId}`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
  
      console.log('[EDIT] success:', res.status);
      show('Скидка обновлена', { type: 'success' });
  
      // обратно на список скидок
      router.replace('/(tabs)/discount');
    } catch (e: any) {
      const details = e?.response?.data ?? e?.message;
      console.error('[EDIT] save error:', details);
  
      // если сервер прислал массив ошибок вида [{loc, msg, ...}]
      const msg =
        Array.isArray(details) && details[0]?.msg
          ? details.map((d: any) => d.msg).join('\n')
          : typeof details === 'object'
            ? JSON.stringify(details)
            : String(details);
  
      show('Не удалось сохранить\n' + msg, { type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white p-4">
      <Text className="text-2xl font-bold mb-4 text-red-600">Редактирование скидки</Text>

      <TextInput
        placeholder="Название"
        value={title}
        onChangeText={setTitle}
        className="border border-gray-300 rounded-lg p-3 mb-4"
      />

      <TextInput
        placeholder="Описание"
        value={description}
        onChangeText={setDescription}
        className="border border-gray-300 rounded-lg p-3 mb-4"
        multiline
      />

      <TextInput
        placeholder="Цена"
        value={price}
        onChangeText={setPrice}
        keyboardType="numeric"
        className="border border-gray-300 rounded-lg p-3 mb-6"
      />

      <TouchableOpacity
        onPress={handleSave}
        disabled={saving}
        className={`py-3 rounded-xl ${saving ? 'bg-yellow-300' : 'bg-yellow-400'}`}
      >
        {saving ? (
          <Text className="text-white text-center font-bold text-lg">Сохранение…</Text>
        ) : (
          <Text className="text-white text-center font-bold text-lg">Сохранить</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}