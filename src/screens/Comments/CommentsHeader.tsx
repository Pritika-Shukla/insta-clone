import React, { memo } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import Icon from '../../components/common/Icon';

interface CommentsHeaderProps {
  onBack: () => void;
}

export const CommentsHeader = memo(({ onBack }: CommentsHeaderProps) => (
  <View className="flex-row items-center justify-between px-4 py-3 border-b border-[#dbdbdb]">
    <TouchableOpacity onPress={onBack} activeOpacity={0.6}>
      <Icon name="arrow-back" size={24} color="#262626" />
    </TouchableOpacity>
    <Text className="text-[15px] font-semibold text-[#262626]">Comments</Text>
    <View className="w-6" />
  </View>
));
