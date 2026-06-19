import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

export default function FeedHeader() {
  return (
    <View className="flex-row items-center justify-between px-[14px] py-[10px] bg-white border-b border-[#dbdbdb]">
      <Text className="text-[26px] font-bold italic text-black tracking-[-0.5px]">
        Instagram
      </Text>
      <View className="flex-row items-center">
        <TouchableOpacity className="ml-[18px]" activeOpacity={0.6}>
          <Ionicons name="add-circle-outline" size={27} color="#000" />
        </TouchableOpacity>
        <TouchableOpacity className="ml-[18px]" activeOpacity={0.6}>
          <Ionicons name="heart-outline" size={27} color="#000" />
        </TouchableOpacity>
        <TouchableOpacity className="ml-[18px]" activeOpacity={0.6}>
          <Ionicons name="paper-plane-outline" size={26} color="#000" />
        </TouchableOpacity>
      </View>
    </View>
  );
}
