import { useCallback, useEffect, useRef, useState } from 'react';
import { feedApi } from '../services/api/feedApi';
import { feedCache } from '../services/feedCache';
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
  const [fromCache, setFromCache] = useState(false);

  const nextPageUrl = useRef<string | null>(null);
  const isFetching = useRef(false);

  useEffect(() => {
    let cancelled = false;

    const loadFeed = async () => {
      const cached = await feedCache.get();
      if (cached?.length && !cancelled) {
        setPosts(cached);
        setFromCache(true);
        setLoading(false);
      }

      try {
        const data = await feedApi.fetch();
        if (cancelled) return;

        const fresh = data.photos.map(mapPhotoToPost);
        setPosts(fresh);
        setFromCache(false);
        nextPageUrl.current = data.next_page ?? null;

        await feedCache.set(fresh);
      } catch {
        if (cancelled) return;
        if (!cached?.length) setError(true);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    loadFeed();
    return () => { cancelled = true; };
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

  return { posts, loading, loadingMore, error, fromCache, loadMore };
}
