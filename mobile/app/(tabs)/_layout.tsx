// app/(tabs)/_layout.tsx
import { ToastProvider } from '@/components/Toast';
import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';

export default function TabsLayout() {
  return (
    <ToastProvider>
      <Tabs
        screenOptions={{
          headerTitleAlign: 'center',
          tabBarActiveTintColor: '#ff3b30',
          tabBarInactiveTintColor: '#8e8e93',
          tabBarStyle: {
            backgroundColor: '#fff',
            borderTopColor: '#e0e0e0',
            height: 60,
          },
          headerStyle: { backgroundColor: '#fff' },
          headerTitleStyle: { fontWeight: 'bold' },
        }}
      >
        <Tabs.Screen
          name="discount/index"
          options={{
            title: 'Скидки',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="pricetags-outline" color={color} size={size} />
            ),
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: 'Профиль',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="person-circle-outline" color={color} size={size} />
            ),
          }}
        />
        {/* скрытые служебные маршруты */}
        <Tabs.Screen name="discount/[id]" options={{ href: null }} />
        <Tabs.Screen name="discount/create" options={{ href: null }} />
        <Tabs.Screen name="discount/edit" options={{ href: null }} />
      </Tabs>
    </ToastProvider>
  );
}