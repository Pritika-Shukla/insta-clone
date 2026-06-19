import React, { memo } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import Icon from '../../components/common/Icon';
import type { Comment } from '../../types';

const AVATAR_COLORS = [
  '#f28b82', '#fbbc04', '#34a853', '#4285f4',
  '#a142f4', '#ff6d00', '#00bcd4', '#e91e63',
];

const avatarColor = (name: string) =>
  AVATAR_COLORS[name.charCodeAt(0) % AVATAR_COLORS.length];

interface CommentItemProps {
  item: Comment;
  isLiked: boolean;
  onToggleLike: () => void;
}

export const CommentItem = memo(({ item, isLiked, onToggleLike }: CommentItemProps) => {
  const username = item.email.split('@')[0] ?? 'anonymous';
  const color = avatarColor(item.name);

  return (
    <View className="flex-row px-4 py-3">
      <View
        className="w-9 h-9 rounded-full items-center justify-center mr-3 mt-0.5"
        style={{ backgroundColor: color }}>
        <Text className="text-[13px] font-bold text-white">
          {item.name.charAt(0).toUpperCase()}
        </Text>
      </View>

      <View className="flex-1">
        <Text className="text-[13.5px] text-[#262626] leading-[19px]" numberOfLines={4}>
          <Text className="font-semibold">{username} </Text>
          {item.body.replace(/\n/g, ' ')}
        </Text>
        <Text className="text-[11.5px] text-[#8e8e8e] mt-1.5">2h</Text>
      </View>

      <TouchableOpacity onPress={onToggleLike} activeOpacity={0.6} className="pl-3 pt-0.5">
        <Icon
          name={isLiked ? 'heart' : 'heart-outline'}
          size={13}
          color={isLiked ? '#ed4956' : '#8e8e8e'}
        />
      </TouchableOpacity>
    </View>
  );
});
