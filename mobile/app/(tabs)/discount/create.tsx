// app/(tabs)/discount/create.tsx
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Button, StyleSheet, TextInput, View } from 'react-native';

import api from '@/lib/api';
import { tokenStorage } from '@/lib/tokenStorage';
import { decodeJwtPayload, getSellerIdFromToken } from '@/lib/jwt';

export default function CreateDiscountScreen() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');

  const handleCreate = async () => {
    if (!title.trim() || !price.trim() || isNaN(Number(price))) {
      Alert.alert('Ошибка', 'Введите название и корректную цену');
      return;
    }

    try {
      const token = await tokenStorage.get();

      // 🔹 Логируем всё содержимое payload токена
      const payloadDecoded = decodeJwtPayload(token);
      console.log('[JWT payload]:', payloadDecoded);

      const sellerId = getSellerIdFromToken(token) ?? 1; // fallback, если в токене нет seller_id

      const payload = {
        title: title.trim(),
        description: description.trim() || null,
        price: Number(price),
        seller_id: sellerId,
      };

      console.log('[CREATE] payload:', payload);

      await api.post('/discounts', payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      router.replace('/(tabs)/discount');
    } catch (e: any) {
      const msg = e?.response?.data ? JSON.stringify(e.response.data) : e?.message;
      console.error('[CREATE] error:', msg);
      Alert.alert('Ошибка', 'Не удалось создать скидку');
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Название"
        style={styles.input}
        value={title}
        onChangeText={setTitle}
      />
      <TextInput
        placeholder="Описание"
        style={styles.input}
        value={description}
        onChangeText={setDescription}
      />
      <TextInput
        placeholder="Цена"
        style={styles.input}
        value={price}
        onChangeText={setPrice}
        keyboardType="numeric"
      />
      <Button title="Создать" onPress={handleCreate} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  input: {
    borderWidth: 1, borderColor: '#e5e7eb',
    padding: 12, borderRadius: 8, marginBottom: 12,
  },
});