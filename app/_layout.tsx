import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { seedIfEmpty } from '../lib/repo';
import { initDb } from '../lib/sqlite';

export default function RootLayout() {
  useEffect(() => { initDb(); seedIfEmpty(); }, []);
  return (
    <SafeAreaProvider>
      <StatusBar style="auto" />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="(main)" />
      </Stack>
    </SafeAreaProvider>
  );
}