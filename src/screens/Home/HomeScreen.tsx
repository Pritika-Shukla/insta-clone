import React, { useCallback } from 'react';
import { FlatList, View, ListRenderItem } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { POSTS } from '../../data/feedData';
import type { Post } from '../../types';
import FeedHeader from '../../components/feed/FeedHeader';
import StoriesBar from '../../components/feed/StoriesBar';
import PostCard from '../../components/feed/PostCard';

const Divider = () => <View className="h-2 bg-[#f0f0f0]" />;

const ListHeader = () => (
  <>
    <FeedHeader />
    <StoriesBar />
  </>
);

export default function HomeScreen() {
  const renderItem: ListRenderItem<Post> = useCallback(
    ({ item }) => <PostCard post={item} />,
    [],
  );

  const keyExtractor = useCallback((item: Post) => item.id, []);

  return (
    <SafeAreaView className="flex-1 bg-[#fafafa]" edges={['top']}>
      <FlatList
        data={POSTS}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        ListHeaderComponent={ListHeader}
        ItemSeparatorComponent={Divider}
        showsVerticalScrollIndicator={false}
        removeClippedSubviews
        initialNumToRender={4}
        maxToRenderPerBatch={4}
        windowSize={8}
        contentContainerStyle={{ paddingBottom: 16 }}
      />
    </SafeAreaView>
  );
}
