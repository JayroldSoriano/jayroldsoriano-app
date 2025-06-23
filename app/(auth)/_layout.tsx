import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import useAuthStore from '../../stores/auth';

export default function AuthLayout() {
  const { user, loading } = useAuthStore();

  console.log('[RootLayout] Zustand user:', user, 'loading:', loading);

  return (
    <>
      <Stack screenOptions={{ headerShown: false }} />
      <StatusBar style="dark" />
    </>
  );
} 