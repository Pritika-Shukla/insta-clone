import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import Icon from '../../components/common/Icon';

interface CommentsHeaderProps {
  onBack: () => void;
}

export const CommentsHeader = ({ onBack }: CommentsHeaderProps) => (
  <View className="flex-row items-center justify-between px-4 py-3 border-b border-[#dbdbdb]">
    <TouchableOpacity onPress={onBack} activeOpacity={0.6}>
      <Icon name="arrow-back" size={24} color="#262626" />
    </TouchableOpacity>
    <Text className="text-[15px] font-semibold text-[#262626]">Comments</Text>
    <TouchableOpacity activeOpacity={0.6}>
      <Icon name="paper-plane-outline" size={22} color="#262626" />
    </TouchableOpacity>
  </View>
);
