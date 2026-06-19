import React, { memo, useCallback, useEffect, useRef, useState } from 'react';
import {
  Animated,
  ActivityIndicator,
  FlatList,
  ListRenderItem,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
  ViewToken,
} from 'react-native';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import Video from 'react-native-video';
import Icon from '../../components/common/Icon';
import { useReels } from '../../hooks/useReels';
import { useReelInteractions } from '../../hooks/useReelInteractions';
import ReelCommentsSheet from './ReelCommentsSheet';
import type { PexelsVideo, PexelsVideoFile, ReelItemProps } from '../../types';

function getBestVideoUrl(files: PexelsVideoFile[]): string {
  const mp4 = files.filter(f => f.file_type === 'video/mp4');
  return (
    mp4.find(f => f.quality === 'hd')?.link ??
    mp4.find(f => f.quality === 'sd')?.link ??
    mp4[0]?.link ??
    ''
  );
}

const useShimmer = () => {
  const anim = useRef(new Animated.Value(0.2)).current;
  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(anim, { toValue: 0.55, duration: 800, useNativeDriver: true }),
        Animated.timing(anim, { toValue: 0.2, duration: 800, useNativeDriver: true }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [anim]);
  return anim;
};

const ReelSkeleton = ({ height }: { height: number }) => {
  const opacity = useShimmer();
  const box = (w: number | string, h: number, extra?: object) => (
    <Animated.View className="bg-[#3a3a3a]" style={[{ width: w, height: h, opacity }, extra]} />
  );
  return (
    <View className="w-full bg-[#1a1a1a]" style={{ height }}>
      <View className="absolute right-3 bottom-20 items-center gap-5">
        {box(32, 32, { borderRadius: 16 })}
        {box(32, 32, { borderRadius: 16 })}
        {box(32, 32, { borderRadius: 16 })}
        {box(28, 28, { borderRadius: 14 })}
      </View>
      <View className="absolute bottom-6 left-4 right-20">
        {box(120, 14, { borderRadius: 7, marginBottom: 8 })}
        {box('80%', 12, { borderRadius: 6, marginBottom: 5 })}
        {box('55%', 12, { borderRadius: 6 })}
      </View>
    </View>
  );
};

// ─── Reel item ────────────────────────────────────────────────────────────────

const ReelItem = memo(({
  item, isActive, height, isLast, loadingMore,
  isLiked, onToggleLike, onOpenComments,
}: ReelItemProps) => {
  const [muted, setMuted] = useState(true);
  const videoUrl = getBestVideoUrl(item.video_files);
  const toggleMuted = useCallback(() => setMuted(p => !p), []);

  return (
    <View className="w-full bg-[#111]" style={{ height }}>
      <Video
        source={{ uri: videoUrl }}
        style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
        resizeMode="cover"
        paused={!isActive}
        repeat
        muted={muted}
      />

      {isLast && loadingMore && (
        <View className="absolute top-4 right-4 w-8 h-8 rounded-full bg-black/40 items-center justify-center">
          <ActivityIndicator size="small" color="rgba(255,255,255,0.7)" />
        </View>
      )}

      {/* Action buttons */}
      <View className="absolute right-3 bottom-24 items-center gap-5">
        <TouchableOpacity className="items-center" onPress={onToggleLike} activeOpacity={0.7}>
          <Icon
            name={isLiked ? 'heart' : 'heart-outline'}
            size={30}
            color={isLiked ? '#ed4956' : '#fff'}
          />
        </TouchableOpacity>

        <TouchableOpacity className="items-center" onPress={onOpenComments} activeOpacity={0.7}>
          <Icon name="chatbubble-outline" size={28} color="#fff" />
        </TouchableOpacity>

        <TouchableOpacity className="items-center" activeOpacity={0.7}>
          <Icon name="paper-plane-outline" size={28} color="#fff" />
        </TouchableOpacity>

        <TouchableOpacity className="items-center" onPress={toggleMuted} activeOpacity={0.7}>
          <Icon name={muted ? 'volume-mute' : 'volume-high'} size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Info */}
      <View className="absolute bottom-6 left-4 right-20">
        <Text className="text-white text-[15px] font-bold mb-1">
          @{item.user.name.toLowerCase().replace(/\s+/g, '_')}
        </Text>
        <Text className="text-white/85 text-[13px] leading-[18px]" numberOfLines={2}>
          🎬 {item.duration}s · Shot on Pexels
        </Text>
      </View>
    </View>
  );
});

// ─── Screen ───────────────────────────────────────────────────────────────────

export default function ReelsScreen() {
  const { height: screenHeight } = useWindowDimensions();
  const tabBarHeight = useBottomTabBarHeight();
  const reelHeight = screenHeight - tabBarHeight;

  const { videos, loading, loadingMore, error, loadMoreError, loadMore } = useReels();
  const { likedIds, toggleLike } = useReelInteractions();

  const [activeIndex, setActiveIndex] = useState(0);
  const [commentsOpen, setCommentsOpen] = useState(false);

  const openComments  = useCallback(() => setCommentsOpen(true), []);
  const closeComments = useCallback(() => setCommentsOpen(false), []);

  const onViewableItemsChanged = useRef(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      if (viewableItems[0]?.index !== null && viewableItems[0]?.index !== undefined) setActiveIndex(viewableItems[0].index);
    },
  ).current;

  const viewabilityConfig = useRef({ itemVisiblePercentThreshold: 80 }).current;

  const getItemLayout = useCallback(
    (_: unknown, index: number) => ({ length: reelHeight, offset: reelHeight * index, index }),
    [reelHeight],
  );

  const renderItem: ListRenderItem<PexelsVideo> = useCallback(
    ({ item, index }) => (
      <ReelItem
        item={item}
        isActive={index === activeIndex}
        height={reelHeight}
        isLast={index === videos.length - 1}
        loadingMore={loadingMore}
        isLiked={likedIds.has(String(item.id))}
        onToggleLike={() => toggleLike(String(item.id))}
        onOpenComments={openComments}
      />
    ),
    [activeIndex, reelHeight, videos.length, loadingMore, likedIds, toggleLike, openComments],
  );

  const keyExtractor = useCallback((item: PexelsVideo) => String(item.id), []);

  if (loading) {
    return (
      <View className="flex-1 bg-black">
        <ReelSkeleton height={reelHeight} />
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 bg-black items-center justify-center p-8">
        <Icon name="alert-circle-outline" size={52} color="#8e8e8e" />
        <Text className="text-[#8e8e8e] text-sm text-center mt-3 leading-[22px]">
          Couldn't load reels.{'\n'}Check your Pexels API key in constants/index.ts
        </Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-black">
      <FlatList
        data={videos}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        getItemLayout={getItemLayout}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        onEndReached={loadMoreError ? undefined : loadMore}
        onEndReachedThreshold={0.5}
        pagingEnabled
        showsVerticalScrollIndicator={false}
        snapToInterval={reelHeight}
        snapToAlignment="start"
        decelerationRate="fast"
      />

      <ReelCommentsSheet visible={commentsOpen} onClose={closeComments} />
    </View>
  );
}
