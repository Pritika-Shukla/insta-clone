import React, { useCallback } from 'react';
import {
  ActivityIndicator,
  FlatList,
  ListRenderItem,
  Platform,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { Post } from '../../types';
import FeedHeader from '../../components/feed/FeedHeader';
import StoriesBar from '../../components/feed/StoriesBar';
import PostCard from '../../components/feed/PostCard';
import Icon from '../../components/common/Icon';
import { useFeed } from '../../hooks/useFeed';

const Divider = () => <View className="h-2 bg-[#f0f0f0]" />;
const listContentStyle = { paddingBottom: 16 };

const ListHeader = () => (
  <>
    <FeedHeader />
    <StoriesBar />
  </>
);

export default function HomeScreen() {
  const { posts, loading, loadingMore, error, loadMore } = useFeed();

  const renderItem: ListRenderItem<Post> = useCallback(
    ({ item }) => <PostCard post={item} />,
    [],
  );

  const keyExtractor = useCallback((item: Post) => item.id, []);

  const renderFooter = useCallback(
    () =>
      loadingMore ? (
        <View className="py-4 items-center">
          <ActivityIndicator size="small" color="#8e8e8e" />
        </View>
      ) : null,
    [loadingMore],
  );

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-[#fafafa]" edges={['top']}>
        <ListHeader />
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#8e8e8e" />
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView className="flex-1 bg-[#fafafa]" edges={['top']}>
        <ListHeader />
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
        ListHeaderComponent={ListHeader}
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
