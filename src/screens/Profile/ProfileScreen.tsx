import React, { useCallback, useState } from 'react';
import { Alert, ScrollView, Text, TouchableOpacity, View } from 'react-native';
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

  const color = avatarColor(name || 'U');

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
    <SafeAreaView className="flex-1 bg-[#F7F7F8]" edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false} bounces>

        {/* Cover banner */}
        <View className="h-[140px] overflow-hidden" style={{ backgroundColor: color }}>
          <View
            className="absolute w-[200px] h-[200px] rounded-full"
            style={{ backgroundColor: 'rgba(255,255,255,0.09)', top: -60, right: -40 }}
          />
          <View
            className="absolute w-[130px] h-[130px] rounded-full"
            style={{ backgroundColor: 'rgba(255,255,255,0.07)', bottom: -40, left: 24 }}
          />
        </View>

        {/* Avatar */}
        <View className="self-center" style={{ marginTop: -52 }}>
          <View
            className="w-[104px] h-[104px] rounded-full border-4 border-[#F7F7F8] items-center justify-center"
            style={{
              backgroundColor: color,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.18,
              shadowRadius: 10,
              elevation: 8,
            }}>
            <Text
              className="text-white font-semibold"
              style={{ fontSize: 32, letterSpacing: -1 }}>
              {initials(name || 'U')}
            </Text>
          </View>
          <View
            className="absolute w-[18px] h-[18px] rounded-full bg-green-500 border-[3px] border-[#F7F7F8]"
            style={{ bottom: 4, right: 4 }}
          />
        </View>

        {/* Name */}
        <Text
          className="text-center text-[22px] font-bold text-[#111827] mt-[14px]"
          style={{ letterSpacing: -0.4 }}>
          {name}
        </Text>

        {/* Member badge */}
        <View className="items-center mt-2">
          <View
            className="flex-row items-center px-[11px] py-1 rounded-full gap-[5px]"
            style={{ backgroundColor: color + '22' }}>
            <View
              className="w-[6px] h-[6px] rounded-full"
              style={{ backgroundColor: color }}
            />
            <Text
              className="text-xs font-semibold"
              style={{ color, letterSpacing: 0.2 }}>
              Member
            </Text>
          </View>
        </View>

        {/* Account section */}
        <View className="mx-5 mt-7">
          <Text
            className="text-[11px] font-semibold text-[#9CA3AF] mb-[10px] ml-1"
            style={{ letterSpacing: 0.8 }}>
            ACCOUNT
          </Text>

          <View
            className="bg-white rounded-[14px] px-[14px] py-[13px] flex-row items-center gap-3"
            style={{
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.04,
              shadowRadius: 4,
              elevation: 2,
            }}>
            <View
              className="w-[38px] h-[38px] rounded-[10px] items-center justify-center"
              style={{ backgroundColor: color + '18' }}>
              <Icon name="paper-plane-outline" size={17} color={color} />
            </View>
            <View className="flex-1">
              <Text
                className="text-[10px] font-medium text-[#9CA3AF] mb-0.5"
                style={{ letterSpacing: 0.4 }}>
                Email
              </Text>
              <Text className="text-sm font-medium text-[#111827]" numberOfLines={1}>
                {email}
              </Text>
            </View>
          </View>
        </View>

        {/* Log out */}
        <TouchableOpacity
          onPress={handleLogout}
          disabled={loggingOut}
          activeOpacity={0.75}
          className="mx-5 mt-6 py-[14px] rounded-[14px] bg-red-50 border border-red-200 flex-row items-center justify-center gap-2">
          <Icon name="log-out-outline" size={17} color="#ef4444" />
          <Text className="text-[15px] font-semibold text-red-500">
            {loggingOut ? 'Logging out…' : 'Log out'}
          </Text>
        </TouchableOpacity>

        <View className="h-9" />
      </ScrollView>
    </SafeAreaView>
  );
}