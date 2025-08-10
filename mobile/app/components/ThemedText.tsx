// app/components/ThemedText.tsx
import { Text } from 'react-native';

export function ThemedText({ children }: { children: React.ReactNode }) {
  return <Text>{children}</Text>;
}