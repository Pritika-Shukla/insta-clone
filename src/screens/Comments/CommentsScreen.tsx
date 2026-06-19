import React, { useCallback, useMemo, useRef, useState } from 'react';
import { ActivityIndicator, FlatList, ListRenderItem, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Icon from '../../components/common/Icon';
import { useComments } from '../../hooks/useComments';
import { useCommentInteractions } from '../../hooks/useCommentInteractions';
import type { Comment, RootStackParamList } from '../../types';
import { CommentsHeader } from './CommentsHeader';
import { CommentItem } from './CommentItem';
import { CommentSkeleton } from './CommentSkeleton';
import { CommentInput } from './CommentInput';

const Divider = () => <View className="h-px bg-[#f0f0f0] ml-16" />;
const listContentStyle = { paddingBottom: 12 };

const Footer = ({ loadingMore }: { loadingMore: boolean }) =>
  loadingMore ? (
    <ActivityIndicator size="small" color="#c7c7c7" style={{ paddingVertical: 16 }} />
  ) : null;

type Nav = NativeStackNavigationProp<RootStackParamList>;
type Route = RouteProp<RootStackParamList, 'Comments'>;

export default function CommentsScreen() {
  const navigation = useNavigation<Nav>();
  const route = useRoute<Route>();
  const postId = route.params?.postId ?? '1';

  const inputRef = useRef<TextInput>(null);
  const { comments, loading, loadingMore, hasMore, error, loadMore } = useComments();
  const { likedIds, toggleLike, userComments, addUserComment } = useCommentInteractions();
  const [text, setText] = useState('');

  const allComments = useMemo(
    () => [...userComments, ...comments],
    [userComments, comments],
  );

  const renderItem: ListRenderItem<Comment> = useCallback(
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
  const goBack = useCallback(() => navigation.goBack(), [navigation]);

  const handlePost = useCallback(() => {
    if (!text.trim()) return;
    addUserComment({
      id: Date.now(),
      postId: Number(postId),
      name: 'You',
      email: 'you@example.com',
      body: text.trim(),
    });
    setText('');
  }, [text, postId, addUserComment]);

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top']}>
      <CommentsHeader onBack={goBack} />

      {loading && <CommentSkeleton />}

      {error && !loading && (
        <View className="flex-1 items-center justify-center px-8">
          <Icon name="alert-circle-outline" size={52} color="#c7c7c7" />
          <Text className="text-sm text-[#8e8e8e] mt-3 text-center">
            Couldn't load comments. Check your connection.
          </Text>
        </View>
      )}

      {!loading && !error && (
        <FlatList
          data={allComments}
          keyExtractor={keyExtractor}
          renderItem={renderItem}
          ItemSeparatorComponent={Divider}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={listContentStyle}
          onEndReached={hasMore ? loadMore : undefined}
          onEndReachedThreshold={0.3}
          ListFooterComponent={<Footer loadingMore={loadingMore} />}
        />
      )}

      <CommentInput
        inputRef={inputRef}
        text={text}
        onChangeText={setText}
        onPost={handlePost}
      />
    </SafeAreaView>
  );
}
