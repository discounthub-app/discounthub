import api from '@/lib/api';
import { tokenStorage } from '@/lib/tokenStorage';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Text, TouchableOpacity, View } from 'react-native';

interface Discount {
  id: number;
  title: string;
  description?: string;
  price?: number;
}

export default function DiscountListScreen() {
  const router = useRouter();
  const [discounts, setDiscounts] = useState<Discount[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchDiscounts = async () => {
    try {
      setLoading(true);
      const token = await tokenStorage.get();
      const res = await api.get('/discounts/', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDiscounts(res.data);
    } catch (error) {
      console.error('[LIST] fetch error', error);
    } finally {
      setLoading(false);
    }
  };

  // Подгрузка при фокусе вкладки
  useFocusEffect(
    useCallback(() => {
      fetchDiscounts();
    }, [])
  );

  useEffect(() => {
    fetchDiscounts();
  }, []);

  const renderItem = ({ item }: { item: Discount }) => (
    <TouchableOpacity
      onPress={() => router.push(`/discount/${item.id}`)}
      style={{
        backgroundColor: '#fff',
        padding: 16,
        borderRadius: 12,
        marginBottom: 10,
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowRadius: 5,
      }}
    >
      <Text style={{ fontSize: 18, fontWeight: '600', marginBottom: 4 }}>{item.title}</Text>
      {item.description ? (
        <Text style={{ fontSize: 14, color: '#555', marginBottom: 6 }}>
          {item.description}
        </Text>
      ) : null}
      {item.price !== undefined && (
        <Text style={{ fontSize: 16, fontWeight: '500', color: '#d32f2f' }}>
          Цена: {item.price} ₽
        </Text>
      )}
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#f57c00" />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, padding: 16, backgroundColor: '#f5f5f5' }}>
      <FlatList
        data={discounts}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        ListEmptyComponent={
          <Text style={{ textAlign: 'center', marginTop: 20, color: '#777' }}>
            Скидок пока нет
          </Text>
        }
      />

      {/* Кнопка Добавить */}
      <TouchableOpacity
        onPress={() => router.push('/discount/create')}
        style={{
          position: 'absolute',
          bottom: 24,
          right: 24,
          backgroundColor: '#f57c00',
          borderRadius: 50,
          padding: 18,
          shadowColor: '#000',
          shadowOpacity: 0.2,
          shadowRadius: 5,
          shadowOffset: { width: 0, height: 2 },
          elevation: 5,
        }}
      >
        <Ionicons name="add" size={32} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}