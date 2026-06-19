import { useCallback, useEffect, useRef, useState } from 'react';
import { commentsApi } from '../services/api/commentsApi';
import type { Comment } from '../types';

const PAGE_SIZE = 10;

export function useComments() {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState(false);
  const start = useRef(0);
  const fetching = useRef(false);

  const fetchPage = useCallback(async (pageStart: number, replace: boolean) => {
    if (fetching.current) return;
    fetching.current = true;
    try {
      const data = await commentsApi.getPaginated(pageStart, PAGE_SIZE);
      setComments(prev => replace ? data : [...prev, ...data]);
      start.current = pageStart + data.length;
      setHasMore(data.length === PAGE_SIZE);
    } catch {
      setError(true);
    } finally {
      fetching.current = false;
    }
  }, []);

  useEffect(() => {
    start.current = 0;
    setComments([]);
    setHasMore(true);
    setError(false);
    setLoading(true);
    fetchPage(0, true).finally(() => setLoading(false));
  }, [fetchPage]);

  const loadMore = useCallback(async () => {
    if (loadingMore || !hasMore) return;
    setLoadingMore(true);
    await fetchPage(start.current, false);
    setLoadingMore(false);
  }, [loadingMore, hasMore, fetchPage]);

  const addComment = useCallback((comment: Comment) => {
    setComments(prev => [comment, ...prev]);
  }, []);

  return { comments, loading, loadingMore, hasMore, error, addComment, loadMore };
}
