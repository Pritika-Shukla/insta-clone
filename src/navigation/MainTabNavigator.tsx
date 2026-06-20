import React from 'react';
import { Platform, Text, View } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/Home/HomeScreen';
import ReelsScreen from '../screens/Reels/ReelsScreen';
import ProfileScreen from '../screens/Profile/ProfileScreen';
import Icon from '../components/common/Icon';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { IconName, TabParamList } from '../types';

const Tab = createBottomTabNavigator<TabParamList>();

const TABS: Record<keyof TabParamList, { icon: IconName; iconFocused: IconName; label: string }> = {
  Feed:    { icon: 'home-outline',   iconFocused: 'home',   label: 'Home' },
  Reels:   { icon: 'film-outline',   iconFocused: 'film',   label: 'Reels' },
  Profile: { icon: 'person-outline', iconFocused: 'person', label: 'Me' },
};

const ACTIVE_COLOR   = '#4f46e5';
const INACTIVE_COLOR = '#A1A1AA';
const PILL_BG        = '#EEF2FF';

const TAB_BAR_STYLE = {
  backgroundColor: '#ffffff',
  borderTopWidth: 1,
  borderTopColor: '#F4F4F5',
  height: Platform.OS === 'ios' ? 88 : 68,
  paddingBottom: Platform.OS === 'ios' ? 28 : 10,
  paddingTop: 6,
  shadowColor: '#000',
  shadowOffset: { width: 0, height: -3 },
  shadowOpacity: 0.07,
  shadowRadius: 14,
  elevation: 14,
};

export default function MainTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }: BottomTabScreenProps<TabParamList>) => ({
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: TAB_BAR_STYLE,
        tabBarActiveTintColor: ACTIVE_COLOR,
        tabBarInactiveTintColor: INACTIVE_COLOR,
        tabBarIcon: ({ color, focused }) => {
          const tab = TABS[route.name as keyof TabParamList];
          return (
            <View className="items-center justify-center">
              <View
                className="w-[52px] h-[30px] items-center justify-center rounded-[15px]"
                style={focused ? { backgroundColor: PILL_BG } : undefined}
              >
                <Icon
                  name={focused ? tab.iconFocused : tab.icon}
                  size={22}
                  color={color}
                />
              </View>
              <Text
                className="text-[10px] mt-[3px]"
                style={{ color, fontWeight: focused ? '600' : '400', letterSpacing: 0.2 }}
              >
                {tab.label}
              </Text>
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
