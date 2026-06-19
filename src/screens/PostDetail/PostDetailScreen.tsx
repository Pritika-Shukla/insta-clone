import React, { useCallback, useState } from 'react';
import {
  FlatList,
  Image,
  ListRenderItem,
  StyleSheet,
  Text,
  TouchableOpacity,
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

const Divider = () => <View style={styles.divider} />;

export default function PostDetailScreen() {
  const navigation = useNavigation<Nav>();
  const { post } = useRoute<Route>().params;

  const [liked,      setLiked]      = useState(post.isLiked);
  const [bookmarked, setBookmarked] = useState(post.isBookmarked);
  const [following,  setFollowing]  = useState(post.isFollowing);
  const [likesCount, setLikesCount] = useState(post.likesCount);
  const [muted,      setMuted]      = useState(true);

  const { comments, loading, loadingMore, hasMore, loadMore } = useComments();
  const { likedIds, toggleLike } = useCommentInteractions();

  const toggleLikePost = useCallback(() => {
    setLiked(prev => {
      setLikesCount(c => (prev ? c - 1 : c + 1));
      return !prev;
    });
  }, []);

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
      <View style={styles.headerBar}>
        <TouchableOpacity onPress={() => navigation.goBack()} activeOpacity={0.7} style={styles.iconBtn}>
          <Icon name="arrow-back" size={24} color="#262626" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Post</Text>
        <View style={styles.iconBtn} />
      </View>

      {/* Post header */}
      <View style={styles.postHeader}>
        <Image source={{ uri: post.avatar }} style={styles.avatar} />
        <View style={styles.userInfo}>
          <Text style={styles.username}>{post.username}</Text>
          {post.location ? <Text style={styles.location}>{post.location}</Text> : null}
        </View>
        {!following && (
          <TouchableOpacity style={styles.followBtn} onPress={() => setFollowing(true)} activeOpacity={0.7}>
            <Text style={styles.followBtnText}>Follow</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Media */}
      {post.type === 'video' && post.videoUrl ? (
        <View style={styles.mediaBox}>
          <Video
            source={{ uri: post.videoUrl }}
            style={StyleSheet.absoluteFillObject}
            resizeMode="cover"
            paused={false}
            repeat
            muted={muted}
            poster={post.imageUrl}
            posterResizeMode="cover"
          />
          <TouchableOpacity style={styles.muteBtn} onPress={() => setMuted(p => !p)} activeOpacity={0.7}>
            <Icon name={muted ? 'volume-mute' : 'volume-high'} size={16} color="#fff" />
          </TouchableOpacity>
        </View>
      ) : (
        <Image source={{ uri: post.imageUrl }} style={styles.mediaBox} resizeMode="cover" />
      )}

      {/* Actions */}
      <View style={styles.actions}>
        <View style={styles.actionsLeft}>
          <TouchableOpacity onPress={toggleLikePost} activeOpacity={0.7} style={styles.actionBtn}>
            <Icon name={liked ? 'heart' : 'heart-outline'} size={28} color={liked ? '#ed4956' : '#262626'} />
          </TouchableOpacity>
          <TouchableOpacity activeOpacity={0.7} style={styles.actionBtn}>
            <Icon name="paper-plane-outline" size={26} color="#262626" />
          </TouchableOpacity>
        </View>
        <TouchableOpacity onPress={() => setBookmarked(p => !p)} activeOpacity={0.7}>
          <Icon name={bookmarked ? 'bookmark' : 'bookmark-outline'} size={26} color="#262626" />
        </TouchableOpacity>
      </View>

      {/* Footer info */}
      <View style={styles.footerInfo}>
        <Text style={styles.likes}>{formatCount(likesCount)} likes</Text>
        <Text style={styles.caption} numberOfLines={0}>
          <Text style={styles.captionUser}>{post.username} </Text>
          {post.caption}
        </Text>
        <Text style={styles.timestamp}>{post.timestamp}</Text>
      </View>

      {/* Comments heading */}
      <View style={styles.commentsHeading}>
        <Text style={styles.commentsHeadingText}>Comments</Text>
      </View>

      {loading && <CommentSkeleton />}
    </View>
  );

  const ListFooter = loadingMore ? <CommentSkeleton /> : null;

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
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
        contentContainerStyle={styles.listContent}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root:        { flex: 1, backgroundColor: '#fff' },
  listContent: { paddingBottom: 32 },
  divider:     { height: StyleSheet.hairlineWidth, backgroundColor: '#f0f0f0', marginLeft: 60 },

  headerBar:   { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 4, paddingVertical: 6, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: '#dbdbdb' },
  iconBtn:     { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: 16, fontWeight: '600', color: '#262626' },

  postHeader:    { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 10 },
  avatar:        { width: 38, height: 38, borderRadius: 19, borderWidth: 1, borderColor: '#dbdbdb' },
  userInfo:      { flex: 1, marginLeft: 10 },
  username:      { fontSize: 13.5, fontWeight: '600', color: '#262626' },
  location:      { fontSize: 11, color: '#737373', marginTop: 1 },
  followBtn:     { paddingHorizontal: 12, paddingVertical: 5, borderRadius: 6, borderWidth: 1, borderColor: '#dbdbdb' },
  followBtnText: { fontSize: 13, fontWeight: '600', color: '#0095f6' },

  mediaBox: { width: '100%', aspectRatio: 1, backgroundColor: '#000' },
  muteBtn:  { position: 'absolute', bottom: 10, right: 10, width: 32, height: 32, borderRadius: 16, backgroundColor: 'rgba(0,0,0,0.5)', alignItems: 'center', justifyContent: 'center' },

  actions:     { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 12, paddingTop: 10, paddingBottom: 6 },
  actionsLeft: { flexDirection: 'row', alignItems: 'center' },
  actionBtn:   { marginRight: 16 },

  footerInfo:  { paddingHorizontal: 12, paddingBottom: 12, gap: 4 },
  likes:       { fontSize: 13.5, fontWeight: '600', color: '#262626' },
  caption:     { fontSize: 13.5, color: '#262626', lineHeight: 19 },
  captionUser: { fontWeight: '600' },
  timestamp:   { fontSize: 10, color: '#afafaf', textTransform: 'uppercase', letterSpacing: 0.4, marginTop: 2 },

  commentsHeading:     { paddingHorizontal: 12, paddingVertical: 10, borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: '#efefef' },
  commentsHeadingText: { fontSize: 13, fontWeight: '600', color: '#262626' },
});
