import React, { useCallback, useState } from 'react';
import {
  FlatList,
  Image,
  ListRenderItem,
  Share,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Video from 'react-native-video';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Icon from '../../components/common/Icon';
import { CommentItem } from '../Comments/CommentItem';
import { CommentSkeleton } from '../Comments/CommentSkeleton';
import { useComments } from '../../hooks/useComments';
import { useCommentInteractions } from '../../hooks/useCommentInteractions';
import { formatCount } from '../../utils/format';
import type { Comment, RootStackParamList } from '../../types';

type Nav   = NativeStackNavigationProp<RootStackParamList>;
type Route = RouteProp<RootStackParamList, 'PostDetail'>;

const Divider = () => <View className="h-px bg-[#f0f0f0] ml-[60px]" />;

export default function PostDetailScreen() {
  const navigation = useNavigation<Nav>();
  const { post } = useRoute<Route>().params;

  const [liked,      setLiked]      = useState(post.isLiked);
  const [bookmarked, setBookmarked] = useState(post.isBookmarked);
  const [following,  setFollowing]  = useState(post.isFollowing);
  const [likesCount, setLikesCount] = useState(post.likesCount);
  const [muted,      setMuted]      = useState(true);

  const { width: screenWidth } = useWindowDimensions();
  const { comments, loading, loadingMore, hasMore, loadMore } = useComments();
  const { likedIds, toggleLike } = useCommentInteractions();

  const toggleLikePost = useCallback(() => {
    setLiked(prev => {
      setLikesCount(c => (prev ? c - 1 : c + 1));
      return !prev;
    });
  }, []);

  const handleShare = useCallback(async () => {
    const url = `https://myapp.com/posts/${post.id}`;
    await Share.share({ message: url, url });
  }, [post.id]);

  const renderComment: ListRenderItem<Comment> = useCallback(
    ({ item }) => (
      <CommentItem
        item={item}
        isLiked={likedIds.has(String(item.id))}
        onToggleLike={() => toggleLike(String(item.id))}
      />
    ),
    [likedIds, toggleLike],
  );

  const keyExtractor = useCallback((item: Comment) => String(item.id), []);

  const ListHeader = (
    <View>
      {/* Header bar */}
      <View className="flex-row items-center justify-between px-1 py-[6px] border-b border-[#dbdbdb]">
        <TouchableOpacity onPress={() => navigation.goBack()} activeOpacity={0.7} className="w-11 h-11 items-center justify-center">
          <Icon name="arrow-back" size={24} color="#262626" />
        </TouchableOpacity>
        <Text className="text-base font-semibold text-[#262626]">Post</Text>
        <View className="w-11 h-11" />
      </View>

      {/* Post header */}
      <View className="flex-row items-center px-3 py-[10px]">
        <Image source={{ uri: post.avatar }} className="w-[38px] h-[38px] rounded-full border border-[#dbdbdb]" />
        <View className="flex-1 ml-[10px]">
          <Text className="text-[13.5px] font-semibold text-[#262626]">{post.username}</Text>
          {post.location ? <Text className="text-[11px] text-[#737373] mt-px">{post.location}</Text> : null}
        </View>
        {!following && (
          <TouchableOpacity className="px-3 py-[5px] rounded-md border border-[#dbdbdb]" onPress={() => setFollowing(true)} activeOpacity={0.7}>
            <Text className="text-[13px] font-semibold text-[#0095f6]">Follow</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Media */}
      {post.type === 'video' && post.videoUrl ? (
        <View style={{ width: screenWidth, height: screenWidth, backgroundColor: '#000' }}>
          <Video
            source={{ uri: post.videoUrl }}
            style={{ width: screenWidth, height: screenWidth }}
            resizeMode="cover"
            paused={false}
            repeat
            muted={muted}
          />
          <TouchableOpacity className="absolute bottom-[10px] right-[10px] w-8 h-8 rounded-full bg-black/50 items-center justify-center" onPress={() => setMuted(p => !p)} activeOpacity={0.7}>
            <Icon name={muted ? 'volume-mute' : 'volume-high'} size={16} color="#fff" />
          </TouchableOpacity>
        </View>
      ) : (
        <Image source={{ uri: post.imageUrl }} className="w-full aspect-square bg-black" resizeMode="cover" />
      )}

      {/* Actions */}
      <View className="flex-row items-center justify-between px-3 pt-[10px] pb-[6px]">
        <View className="flex-row items-center">
          <TouchableOpacity onPress={toggleLikePost} activeOpacity={0.7} className="mr-4">
            <Icon name={liked ? 'heart' : 'heart-outline'} size={28} color={liked ? '#ed4956' : '#262626'} />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleShare} activeOpacity={0.7} className="mr-4">
            <Icon name="paper-plane-outline" size={26} color="#262626" />
          </TouchableOpacity>
        </View>
        <TouchableOpacity onPress={() => setBookmarked(p => !p)} activeOpacity={0.7}>
          <Icon name={bookmarked ? 'bookmark' : 'bookmark-outline'} size={26} color="#262626" />
        </TouchableOpacity>
      </View>

      {/* Footer info */}
      <View className="px-3 pb-3 gap-1">
        <Text className="text-[13.5px] font-semibold text-[#262626]">{formatCount(likesCount)} likes</Text>
        <Text className="text-[13.5px] text-[#262626] leading-[19px]" numberOfLines={0}>
          <Text className="font-semibold">{post.username} </Text>
          {post.caption}
        </Text>
        <Text className="text-[10px] text-[#afafaf] uppercase mt-[2px]" style={{ letterSpacing: 0.4 }}>{post.timestamp}</Text>
      </View>

      {/* Comments heading */}
      <View className="px-3 py-[10px] border-t border-[#efefef]">
        <Text className="text-[13px] font-semibold text-[#262626]">Comments</Text>
      </View>

      {loading && <CommentSkeleton />}
    </View>
  );

  const ListFooter = loadingMore ? <CommentSkeleton /> : null;

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top']}>
      <FlatList
        data={loading ? [] : comments}
        keyExtractor={keyExtractor}
        renderItem={renderComment}
        ListHeaderComponent={ListHeader}
        ListFooterComponent={ListFooter}
        ItemSeparatorComponent={Divider}
        onEndReached={hasMore ? loadMore : undefined}
        onEndReachedThreshold={0.4}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 32 }}
      />
    </SafeAreaView>
  );
}
