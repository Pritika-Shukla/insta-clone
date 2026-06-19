import React, { useCallback, useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  ListRenderItem,
  Modal,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useComments } from '../../hooks/useComments';
import { useCommentInteractions } from '../../hooks/useCommentInteractions';
import { CommentItem } from '../Comments/CommentItem';
import { CommentInput } from '../Comments/CommentInput';
import type { Comment } from '../../types';

const Divider = () => <View className="h-px bg-[#f0f0f0] ml-16" />;

const Footer = ({ loadingMore }: { loadingMore: boolean }) =>
  loadingMore ? (
    <ActivityIndicator size="small" color="#c7c7c7" style={{ paddingVertical: 12 }} />
  ) : null;

interface Props {
  visible: boolean;
  onClose: () => void;
}

export default function ReelCommentsSheet({ visible, onClose }: Props) {
  const inputRef = useRef<TextInput>(null);
  const [text, setText] = useState('');

  const { comments, loading, loadingMore, hasMore, error, loadMore } = useComments();
  const { likedIds, toggleLike, userComments, addUserComment } = useCommentInteractions();

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

  const handlePost = useCallback(() => {
    if (!text.trim()) return;
    addUserComment({
      id: Date.now(),
      postId: 1,
      name: 'You',
      email: 'you@example.com',
      body: text.trim(),
    });
    setText('');
  }, [text, addUserComment]);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}>

      {/* Dim backdrop */}
      <TouchableOpacity
        className="flex-1 bg-black/40"
        activeOpacity={1}
        onPress={onClose}
      />

      {/* Sheet */}
      <View className="bg-white rounded-t-3xl" style={{ height: '70%' }}>

        {/* Handle + header */}
        <View className="items-center pt-3 pb-2">
          <View className="w-10 h-1 rounded-full bg-[#dbdbdb]" />
        </View>
        <View className="flex-row items-center justify-between px-4 pb-3 border-b border-[#f0f0f0]">
          <Text className="text-[15px] font-bold text-[#262626]">Comments</Text>
          <TouchableOpacity onPress={onClose} hitSlop={10}>
            <Text className="text-sm text-[#8e8e8e]">Close</Text>
          </TouchableOpacity>
        </View>

        {/* Comments list */}
        {loading ? (
          <ActivityIndicator size="small" color="#c7c7c7" style={{ marginTop: 32 }} />
        ) : error ? (
          <View className="flex-1 items-center justify-center">
            <Text className="text-sm text-[#8e8e8e]">Couldn't load comments.</Text>
          </View>
        ) : (
          <FlatList
            data={allComments}
            keyExtractor={keyExtractor}
            renderItem={renderItem}
            ItemSeparatorComponent={Divider}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 8 }}
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
      </View>
    </Modal>
  );
}
