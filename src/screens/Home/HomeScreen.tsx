import React, { useCallback } from 'react';
import {
  ActivityIndicator,
  FlatList,
  ListRenderItem,
  Platform,
  Text,
  View,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { Post } from '../../types';
import FeedHeader from '../../components/feed/FeedHeader';
import PostCard from '../../components/feed/PostCard';
import Icon from '../../components/common/Icon';
import { useFeed } from '../../hooks/useFeed';
import { FeedSkeleton } from '../../components/feed/FeedSkeleton';

const Divider = () => <View className="h-2 bg-[#f0f0f0]" />;
const listContentStyle = { paddingBottom: 16 };

const OfflineBanner = () => (
  <View className="flex-row items-center justify-center gap-1.5 bg-[#fff3cd] py-2 px-4">
    <Icon name="alert-circle-outline" size={14} color="#856404" />
    <Text className="text-xs text-[#856404]">You're offline — showing cached posts</Text>
  </View>
);

const StaticHeader = () => (
  <>
    <FeedHeader />
  </>
);

export default function HomeScreen() {
  const { posts, loading, loadingMore, error, loadMoreError, fromCache, loadMore } = useFeed();

  const renderItem: ListRenderItem<Post> = useCallback(
    ({ item }) => <PostCard post={item} />,
    [],
  );

  const keyExtractor = useCallback((item: Post) => item.id, []);

  const renderHeader = useCallback(
    () => (
      <>
        <FeedHeader />
        {fromCache && <OfflineBanner />}
      </>
    ),
    [fromCache],
  );

  const renderFooter = useCallback(
    () =>
      loadingMore ? (
        <View className="py-4 items-center">
          <ActivityIndicator size="small" color="#8e8e8e" />
        </View>
      ) : loadMoreError ? (
        <View className="flex-row items-center justify-center gap-1.5 py-4">
          <Icon name="alert-circle-outline" size={14} color="#8e8e8e" />
          <Text className="text-xs text-[#8e8e8e]">No connection — can't load more</Text>
        </View>
      ) : null,
    [loadingMore, loadMoreError],
  );

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-[#fafafa]" edges={['top']}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <StaticHeader />
          <FeedSkeleton />
        </ScrollView>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView className="flex-1 bg-[#fafafa]" edges={['top']}>
        <StaticHeader />
        <View className="flex-1 items-center justify-center px-8">
          <Icon name="alert-circle-outline" size={52} color="#c7c7c7" />
          <Text className="text-sm text-[#8e8e8e] mt-3 text-center">
            Couldn't load posts. Check your connection.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-[#fafafa]" edges={['top']}>
      <FlatList
        className="flex-1"
        data={posts}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        ListHeaderComponent={renderHeader}
        ListFooterComponent={renderFooter}
        ItemSeparatorComponent={Divider}
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        showsVerticalScrollIndicator={false}
        removeClippedSubviews={Platform.OS === 'ios'}
        contentContainerStyle={listContentStyle}
      />
    </SafeAreaView>
  );
}
