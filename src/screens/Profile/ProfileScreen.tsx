import React, { useCallback, useState } from 'react';
import { Alert, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuthStore } from '../../store/authStore';
import Icon from '../../components/common/Icon';

const AVATAR_COLORS = [
  '#4f46e5', '#7c3aed', '#db2777', '#d97706',
  '#059669', '#0284c7', '#dc2626', '#65a30d',
];

function avatarColor(name: string) {
  const code = name.charCodeAt(0) + (name.charCodeAt(name.length - 1) || 0);
  return AVATAR_COLORS[code % AVATAR_COLORS.length];
}

function initials(name: string) {
  return name
    .split(' ')
    .map(w => w[0]?.toUpperCase() ?? '')
    .slice(0, 2)
    .join('');
}

export default function ProfileScreen() {
  const name   = useAuthStore(state => state.name);
  const email  = useAuthStore(state => state.email);
  const logout = useAuthStore(state => state.logout);
  const [loggingOut, setLoggingOut] = useState(false);

  const color      = avatarColor(name || 'U');
  const headerTint = color + '22';

  const handleLogout = useCallback(() => {
    Alert.alert('Log out', 'Are you sure you want to log out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Log out',
        style: 'destructive',
        onPress: async () => {
          setLoggingOut(true);
          await logout();
        },
      },
    ]);
  }, [logout]);

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top']}>

      {/* Tinted header band */}
      <View style={{ height: 160, backgroundColor: headerTint }} />

      {/* Avatar overlapping the fold */}
      <View className="items-center" style={{ marginTop: -60 }}>
        <View
          className="items-center justify-center rounded-full"
          style={{
            width: 120,
            height: 120,
            backgroundColor: color,
            borderWidth: 5,
            borderColor: '#ffffff',
            shadowColor: color,
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity: 0.4,
            shadowRadius: 16,
            elevation: 10,
          }}>
          <Text className="font-extrabold text-white" style={{ fontSize: 42, letterSpacing: -1 }}>
            {initials(name || 'U')}
          </Text>
        </View>
      </View>

      {/* Name + logout icon */}
      <View className="flex-row items-center justify-center mt-5 px-8" style={{ gap: 10 }}>
        <Text className="text-2xl font-bold text-[#1a1a1a]" style={{ letterSpacing: -0.5 }}>
          {name}
        </Text>
        <TouchableOpacity
          onPress={handleLogout}
          disabled={loggingOut}
          activeOpacity={0.7}
          className="w-9 h-9 rounded-full bg-[#fff0f1] items-center justify-center">
          <Icon name="log-out-outline" size={17} color="#ed4956" />
        </TouchableOpacity>
      </View>

      {/* Email */}
      <View className="flex-row items-center justify-center mt-1" style={{ gap: 5 }}>
        <Icon name="paper-plane-outline" size={13} color="#9e9e9e" />
        <Text className="text-[13px] text-[#9e9e9e]">{email}</Text>
      </View>

      {/* Member pill */}
      <View className="items-center mt-4">
        <View className="px-3 py-1 rounded-full" style={{ backgroundColor: headerTint }}>
          <Text className="text-xs font-semibold" style={{ color }}>
            Member
          </Text>
        </View>
      </View>

      {/* Divider */}
      <View className="h-px mx-6 mt-8 bg-[#f2f2f2]" />

      {/* Info card */}
      <View
        className="flex-row items-center mx-6 mt-5 px-5 py-4 rounded-2xl bg-[#fafafa] border border-[#f0f0f0]"
        style={{ gap: 16 }}>
        <View
          className="w-10 h-10 rounded-full items-center justify-center"
          style={{ backgroundColor: headerTint }}>
          <Icon name="person-outline" size={18} color={color} />
        </View>
        <View className="flex-1">
          <Text className="text-[11px] text-[#b0b0b0] font-semibold mb-0.5" style={{ letterSpacing: 0.8 }}>
            SIGNED IN AS
          </Text>
          <Text className="text-sm font-semibold text-[#1a1a1a]" numberOfLines={1}>
            {email}
          </Text>
        </View>
      </View>

    </SafeAreaView>
  );
}
