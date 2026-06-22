import React, { memo, useCallback, useState } from 'react';
import { Share, View, Text, Image, TouchableOpacity } from 'react-native';
import Video from 'react-native-video';
import Icon from '../common/Icon';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { PostCardProps, RootStackParamList } from '../../types';
import { formatCount } from '../../utils/format';

type Nav = NativeStackNavigationProp<RootStackParamList>;


const PostCard = memo(({ post, isActive = false }: PostCardProps) => {
  const navigation = useNavigation<Nav>();
  const openDetail = useCallback(
    () => navigation.navigate('PostDetail', { post }),
    [navigation, post],
  );

  const [liked, setLiked] = useState(post.isLiked);
  const [bookmarked, setBookmarked] = useState(post.isBookmarked);
  const [following, setFollowing] = useState(post.isFollowing);
  const [likesCount, setLikesCount] = useState(post.likesCount);
  const [muted, setMuted] = useState(true);

  const toggleMuted = useCallback(() => setMuted(p => !p), []);

  const toggleLike = useCallback(() => {
    setLiked(prev => {
      setLikesCount(c => (prev ? c - 1 : c + 1));
      return !prev;
    });
  }, []);

  const toggleBookmark = useCallback(() => setBookmarked(prev => !prev), []);
  const toggleFollow = useCallback(() => setFollowing(prev => !prev), []);

  const handleShare = useCallback(async () => {
    const url = `https://myapp.com/posts/${post.id}`;
    await Share.share({ message: url, url });
  }, [post.id]);

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
          <TouchableOpacity
            className="px-3 py-[5px] rounded-md border border-[#dbdbdb]"
            onPress={toggleFollow}
            activeOpacity={0.7}
          >
            <Text className={`text-[13px] font-semibold ${following ? 'text-[#262626]' : 'text-[#0095f6]'}`}>
              {following ? 'Following' : 'Follow'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Media */}
      <TouchableOpacity onPress={openDetail} activeOpacity={0.95}>
        {post.type === 'video' && post.videoUrl ? (
          <View className="w-full aspect-square bg-black">
            <Video
              source={{ uri: post.videoUrl }}
              style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
              resizeMode="cover"
              paused={!isActive}
              repeat
              muted={muted}
              poster={post.imageUrl}
              posterResizeMode="cover"
            />
            <TouchableOpacity
              className="absolute bottom-[10px] right-[10px] w-8 h-8 rounded-full bg-black/50 items-center justify-center"
              onPress={toggleMuted}
              activeOpacity={0.7}
            >
              <Icon name={muted ? 'volume-mute' : 'volume-high'} size={16} color="#fff" />
            </TouchableOpacity>
          </View>
        ) : (
          <Image
            source={{ uri: post.imageUrl }}
            className="w-full aspect-square"
            resizeMode="cover"
          />
        )}
      </TouchableOpacity>

      {/* Actions */}
      <View className="flex-row items-center justify-between px-3 pt-[10px] pb-[6px]">
        <View className="flex-row items-center">
          <TouchableOpacity onPress={toggleLike} activeOpacity={0.7} className="mr-4">
            <Icon
              name={liked ? 'heart' : 'heart-outline'}
              size={28}
              color={liked ? '#ed4956' : '#262626'}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleShare} activeOpacity={0.7} className="mr-4">
            <Icon name="paper-plane-outline" size={26} color="#262626" />
          </TouchableOpacity>
        </View>
        <TouchableOpacity onPress={toggleBookmark} activeOpacity={0.7}>
          <Icon
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
        <TouchableOpacity onPress={openDetail} activeOpacity={0.7}>
          <Text className="text-[13px] text-[#8e8e8e]">View details</Text>
        </TouchableOpacity>
        <Text className="text-[10px] text-[#afafaf] uppercase tracking-[0.4px] mt-[2px]">
          {post.timestamp}
        </Text>
      </View>
    </View>
  );
});


export default PostCard;
