import { useCallback, useEffect, useRef, useState } from 'react';
import NetInfo from '@react-native-community/netinfo';
import { commentsApi } from '../services/api/commentsApi';
import { cacheComments, getCachedComments } from '../services/commentsCache';
import type { Comment } from '../types';

const PAGE_SIZE = 10;

export function useComments() {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState(false);
  const [isOffline, setIsOffline] = useState(false);
  const start = useRef(0);
  const fetching = useRef(false);

  const fetchPage = useCallback(async (pageStart: number, replace: boolean) => {
    if (fetching.current) return;
    fetching.current = true;
    try {
      const data = await commentsApi.getPaginated(pageStart, PAGE_SIZE);
      setComments(prev => (replace ? data : [...prev, ...data]));
      if (replace && data.length > 0) cacheComments(data).catch(() => {});
      start.current = pageStart + data.length;
      setHasMore(data.length === PAGE_SIZE);
    } catch {
      setError(true);
    } finally {
      fetching.current = false;
    }
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function init() {
      start.current = 0;
      setComments([]);
      setHasMore(true);
      setError(false);

      const netState = await NetInfo.fetch();
      const online = netState.isConnected && netState.isInternetReachable !== false;

      if (!online) {
        setIsOffline(true);
        const cached = await getCachedComments();
        if (!cancelled) {
          if (cached.length > 0) {
            setComments(cached);
            setHasMore(false);
          } else {
            setError(true);
          }
          setLoading(false);
        }
        return;
      }

      await fetchPage(0, true);
      if (!cancelled) setLoading(false);
    }

    init();
    return () => {
      cancelled = true;
    };
  }, [fetchPage]);

  const loadMore = useCallback(async () => {
    if (isOffline || loadingMore || !hasMore) return;
    setLoadingMore(true);
    await fetchPage(start.current, false);
    setLoadingMore(false);
  }, [isOffline, loadingMore, hasMore, fetchPage]);

  const addComment = useCallback((comment: Comment) => {
    setComments(prev => [comment, ...prev]);
  }, []);

  return { comments, loading, loadingMore, hasMore, error, isOffline, addComment, loadMore };
}
