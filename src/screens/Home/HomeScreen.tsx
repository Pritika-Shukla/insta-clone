import React from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { useAuthStore } from '../../store/authStore';

export default function HomeScreen() {
  const email = useAuthStore(state => state.email);
  const logout = useAuthStore(state => state.logout);

  const avatarChar = email ? email.charAt(0).toUpperCase() : '?';

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: async () => {
          try {
            await logout();
          } catch {
            Alert.alert('Error', 'Failed to logout. Please try again.');
          }
        },
      },
    ]);
  };

  return (
    <View className="flex-1 justify-center items-center px-6 bg-slate-100">

      <View className="w-20 h-20 rounded-full bg-indigo-600 justify-center items-center mb-4">
        <Text className="text-4xl text-white font-bold">{avatarChar}</Text>
      </View>

      <Text className="text-2xl font-bold text-slate-800">Hello!</Text>
      <Text className="text-sm text-slate-500 mt-1 mb-5">{email}</Text>

      <Text className="text-xs text-slate-400 text-center mb-10 leading-5">
        You are logged in. Your session is stored in AsyncStorage.
      </Text>

      <TouchableOpacity
        className="bg-red-500 rounded-xl py-4 px-12"
        onPress={handleLogout}>
        <Text className="text-white text-base font-semibold">Logout</Text>
      </TouchableOpacity>

    </View>
  );
}
