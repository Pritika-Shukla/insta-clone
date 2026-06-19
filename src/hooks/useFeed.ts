import { useCallback, useEffect, useRef, useState } from 'react';
import { feedApi } from '../services/api/feedApi';
import type { PexelsPhoto, Post } from '../types';

const mapPhotoToPost = (photo: PexelsPhoto): Post => ({
  id: String(photo.id),
  username: photo.photographer.toLowerCase().replace(/\s+/g, '.'),
  avatar: photo.src.tiny,
  imageUrl: photo.src.large,
  likesCount: (photo.id * 7) % 15000 + 100,
  caption: photo.alt || 'Beautiful capture.',
  commentsCount: (photo.id * 3) % 800 + 10,
  timestamp: '2 hours ago',
  isLiked: false,
  isBookmarked: false,
  isFollowing: false,
});

export function useFeed() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(false);

  const nextPageUrl = useRef<string | null>(null);
  const isFetching = useRef(false);

  useEffect(() => {
    feedApi
      .fetch()
      .then(data => {
        setPosts(data.photos.map(mapPhotoToPost));
        nextPageUrl.current = data.next_page ?? null;
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, []);

  const loadMore = useCallback(() => {
    if (isFetching.current || !nextPageUrl.current) return;

    isFetching.current = true;
    setLoadingMore(true);

    feedApi
      .fetch(nextPageUrl.current)
      .then(data => {
        setPosts(prev => [...prev, ...data.photos.map(mapPhotoToPost)]);
        nextPageUrl.current = data.next_page ?? null;
      })
      .catch(() => {})
      .finally(() => {
        setLoadingMore(false);
        isFetching.current = false;
      });
  }, []);

  return { posts, loading, loadingMore, error, loadMore };
}
