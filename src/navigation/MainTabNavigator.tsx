import React from 'react';
import { View } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/Home/HomeScreen';
import ReelsScreen from '../screens/Reels/ReelsScreen';
import Icon from '../components/common/Icon';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { TabParamList } from '../types';

const Tab = createBottomTabNavigator<TabParamList>();

export default function MainTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }: BottomTabScreenProps<TabParamList>) => ({
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: '#ffffff',
          borderTopColor: '#dbdbdb',
          borderTopWidth: 0.5,
          height: 56,
          paddingBottom: 8,
        },
        tabBarActiveTintColor: '#262626',
        tabBarInactiveTintColor: '#8e8e8e',
        tabBarIcon: ({ color, focused }: { color: string; focused: boolean; size: number }) => {
          if (route.name === 'Feed') {
            return (
              <View className="items-center justify-center">
                <Icon
                  name={focused ? 'home' : 'home-outline'}
                  size={26}
                  color={color}
                />
              </View>
            );
          } else if (route.name === 'Reels') {
            return (
              <View className="items-center justify-center">
                <Icon
                  name={focused ? 'play-circle' : 'play-circle-outline'}
                  size={26}
                  color={color}
                />
              </View>
            );
          }
          return null;
        },
      })}
    >
      <Tab.Screen name="Feed" component={HomeScreen} />
      <Tab.Screen name="Reels" component={ReelsScreen} />
    </Tab.Navigator>
  );
}