import React, { memo, useCallback, useState } from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import type { PostCardProps } from '../../types';
import { formatCount } from '../../utils/format';

const PostCard = memo(({ post }: PostCardProps) => {
  const [liked, setLiked] = useState(post.isLiked);
  const [bookmarked, setBookmarked] = useState(post.isBookmarked);
  const [following, setFollowing] = useState(post.isFollowing);
  const [likesCount, setLikesCount] = useState(post.likesCount);

  const toggleLike = useCallback(() => {
    setLiked(prev => {
      setLikesCount(c => (prev ? c - 1 : c + 1));
      return !prev;
    });
  }, []);

  const toggleBookmark = useCallback(() => setBookmarked(prev => !prev), []);
  const toggleFollow = useCallback(() => setFollowing(prev => !prev), []);

  return (
    <View className="bg-white">
      {/* Header */}
      <View className="flex-row items-center px-3 py-[10px]">
        <Image
          source={{ uri: post.avatar }}
          className="w-[38px] h-[38px] rounded-full border border-[#dbdbdb]"
        />
        <View className="flex-1 ml-[10px]">
          <Text className="text-[13.5px] font-semibold text-[#262626]">
            {post.username}
          </Text>
          {post.location ? (
            <Text className="text-[11px] text-[#737373] mt-px">{post.location}</Text>
          ) : null}
        </View>
        <View className="flex-row items-center gap-[6px]">
          {!following && (
            <TouchableOpacity
              className="px-3 py-[5px] rounded-md border border-[#dbdbdb]"
              onPress={toggleFollow}
              activeOpacity={0.7}
            >
              <Text className="text-[13px] font-semibold text-[#0095f6]">Follow</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity className="pl-1" activeOpacity={0.6}>
            <Ionicons name="ellipsis-horizontal" size={22} color="#262626" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Post Image */}
      <Image
        source={{ uri: post.imageUrl }}
        className="w-full aspect-square"
        resizeMode="cover"
      />

      {/* Actions */}
      <View className="flex-row items-center justify-between px-3 pt-[10px] pb-[6px]">
        <View className="flex-row items-center">
          <TouchableOpacity onPress={toggleLike} activeOpacity={0.7} className="mr-4">
            <Ionicons
              name={liked ? 'heart' : 'heart-outline'}
              size={28}
              color={liked ? '#ed4956' : '#262626'}
            />
          </TouchableOpacity>
          <TouchableOpacity activeOpacity={0.7} className="mr-4">
            <Ionicons name="chatbubble-outline" size={26} color="#262626" />
          </TouchableOpacity>
          <TouchableOpacity activeOpacity={0.7} className="mr-4">
            <Ionicons name="paper-plane-outline" size={26} color="#262626" />
          </TouchableOpacity>
        </View>
        <TouchableOpacity onPress={toggleBookmark} activeOpacity={0.7}>
          <Ionicons
            name={bookmarked ? 'bookmark' : 'bookmark-outline'}
            size={26}
            color="#262626"
          />
        </TouchableOpacity>
      </View>

      {/* Footer */}
      <View className="px-3 pb-[14px] gap-1">
        <Text className="text-[13.5px] font-semibold text-[#262626]">
          {formatCount(likesCount)} likes
        </Text>
        <Text className="text-[13.5px] text-[#262626] leading-[19px]" numberOfLines={2}>
          <Text className="font-semibold">{post.username} </Text>
          {post.caption}
        </Text>
        {post.commentsCount > 0 && (
          <TouchableOpacity activeOpacity={0.7}>
            <Text className="text-[13px] text-[#737373]">
              View all {formatCount(post.commentsCount)} comments
            </Text>
          </TouchableOpacity>
        )}
        <Text className="text-[10px] text-[#afafaf] uppercase tracking-[0.4px] mt-[2px]">
          {post.timestamp}
        </Text>
      </View>
    </View>
  );
});

export default PostCard;
