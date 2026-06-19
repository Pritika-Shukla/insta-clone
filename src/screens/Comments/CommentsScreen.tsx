import React, { useCallback, useRef, useState } from 'react';
import { FlatList, ListRenderItem, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import Icon from '../../components/common/Icon';
import { useComments } from '../../hooks/useComments';
import type { Comment } from '../../types';
import { CommentsHeader } from './CommentsHeader';
import { CommentItem } from './CommentItem';
import { CommentSkeleton } from './CommentSkeleton';
import { CommentInput } from './CommentInput';

const Divider = () => <View className="h-px bg-[#f0f0f0] ml-16" />;

const listContentStyle = { paddingBottom: 12 };

export default function CommentsScreen() {
  const navigation = useNavigation();
  const inputRef = useRef<TextInput>(null);
  const { comments, loading, error, addComment } = useComments(1);
  const [text, setText] = useState('');

  const renderItem: ListRenderItem<Comment> = useCallback(
    ({ item }) => <CommentItem item={item} />,
    [],
  );

  const keyExtractor = useCallback((item: Comment) => String(item.id), []);
  const goBack = useCallback(() => navigation.goBack(), [navigation]);

  const handlePost = useCallback(() => {
    if (!text.trim()) return;
    addComment({
      id: Date.now(),
      postId: 1,
      name: 'You',
      email: 'you@example.com',
      body: text.trim(),
    });
    setText('');
  }, [text, addComment]);

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
          data={comments}
          keyExtractor={keyExtractor}
          renderItem={renderItem}
          ItemSeparatorComponent={Divider}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={listContentStyle}
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
