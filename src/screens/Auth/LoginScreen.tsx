import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useAuthStore } from '../../store/authStore';
import { EMAIL_REGEX } from '../../constants';

export default function LoginScreen() {
  const login = useAuthStore(state => state.login);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!name.trim() || !email.trim() || !password.trim()) {
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }
    if (!EMAIL_REGEX.test(email.trim())) {
      Alert.alert('Error', 'Please enter a valid email address.');
      return;
    }
    setLoading(true);
    try {
      await login(name.trim(), email.trim());
    } catch {
      Alert.alert('Error', 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      className="flex-1"
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <View className="flex-1 justify-center px-6 bg-slate-100">

        <Text className="text-3xl font-bold text-center text-slate-800 mb-1">
          Welcome Back
        </Text>
        <Text className="text-sm text-center text-slate-500 mb-8">
          Sign in to continue
        </Text>

        <View className="bg-white rounded-2xl p-6 shadow-md">

          <Text className="text-xs font-semibold text-slate-600 mb-1 mt-3">
            Name
          </Text>
          <TextInput
            className="border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 bg-slate-50"
            placeholder="Enter your name"
            placeholderTextColor="#94a3b8"
            value={name}
            onChangeText={setName}
            autoCapitalize="words"
            autoCorrect={false}
            textContentType="name"
          />

          <Text className="text-xs font-semibold text-slate-600 mb-1 mt-4">
            Email
          </Text>
          <TextInput
            className="border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 bg-slate-50"
            placeholder="Enter your email"
            placeholderTextColor="#94a3b8"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="email-address"
            textContentType="emailAddress"
            autoComplete="email"
          />

          <Text className="text-xs font-semibold text-slate-600 mb-1 mt-4">
            Password
          </Text>
          <TextInput
            className="border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 bg-slate-50"
            placeholder="Enter your password"
            placeholderTextColor="#94a3b8"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            textContentType="password"
            autoComplete="password"
          />

          <TouchableOpacity
            className={`rounded-xl py-4 items-center mt-6 ${loading ? 'bg-indigo-300' : 'bg-indigo-600'}`}
            onPress={handleLogin}
            disabled={loading}>
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text className="text-white text-base font-semibold">Login</Text>
            )}
          </TouchableOpacity>

        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
