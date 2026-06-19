import React from 'react';
import { Platform, View } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/Home/HomeScreen';
import ReelsScreen from '../screens/Reels/ReelsScreen';
import ProfileScreen from '../screens/Profile/ProfileScreen';
import Icon from '../components/common/Icon';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { IconName, TabParamList } from '../types';

const Tab = createBottomTabNavigator<TabParamList>();

const TABS: Record<keyof TabParamList, { icon: IconName; iconFocused: IconName }> = {
  Feed:    { icon: 'home-outline',        iconFocused: 'home' },
  Reels:   { icon: 'play-circle-outline', iconFocused: 'play-circle' },
  Profile: { icon: 'person-outline',      iconFocused: 'person' },
};

export default function MainTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }: BottomTabScreenProps<TabParamList>) => ({
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: '#ffffff',
          borderTopWidth: 1,
          borderTopColor: '#f0f0f0',
          height: Platform.OS === 'ios' ? 82 : 60,
          paddingBottom: Platform.OS === 'ios' ? 28 : 8,
          paddingTop: 8,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.06,
          shadowRadius: 8,
          elevation: 10,
        },
        tabBarActiveTintColor: '#4f46e5',
        tabBarInactiveTintColor: '#c0c0c0',
        tabBarIcon: ({ color, focused }) => {
          const tab = TABS[route.name as keyof TabParamList];
          return (
            <View className="items-center justify-center">
              <Icon
                name={focused ? tab.iconFocused : tab.icon}
                size={26}
                color={color}
              />
              {focused && (
                <View className="w-1 h-1 rounded-full bg-[#4f46e5] mt-1" />
              )}
            </View>
          );
        },
      })}
    >
      <Tab.Screen name="Feed"    component={HomeScreen} />
      <Tab.Screen name="Reels"   component={ReelsScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}
