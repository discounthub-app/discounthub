import { View, Text, Button } from 'react-native';
import { Link } from 'expo-router';

export default function Home() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', gap: 12 }}>
      <Text style={{ fontSize: 18, marginBottom: 20 }}>
        Добро пожаловать в DiscountHub 👋
      </Text>

      {/* ✅ Link + Button = ОДИН дочерний элемент */}
      <Link href="/discounts" asChild><Button title="Перейти к скидкам" /></Link>
      <Link href="/login" asChild><Button title="Войти" /></Link>
      <Link href="/profile" asChild><Button title="Профиль" /></Link>
    </View>
  );
}