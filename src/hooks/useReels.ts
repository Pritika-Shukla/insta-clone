import { useCallback, useEffect, useRef, useState } from 'react';
import { reelsApi } from '../services/api/reelsApi';
import type { PexelsVideo } from '../types';

export function useReels() {
  const [videos, setVideos] = useState<PexelsVideo[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(false);

  const nextPageUrl = useRef<string | null>(null);
  const isFetching = useRef(false);

  useEffect(() => {
    reelsApi
      .fetch()
      .then(data => {
        setVideos(data.videos);
        nextPageUrl.current = data.next_page ?? null;
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, []);

  const loadMore = useCallback(() => {
    if (isFetching.current || !nextPageUrl.current) return;

    isFetching.current = true;
    setLoadingMore(true);

    reelsApi
      .fetch(nextPageUrl.current)
      .then(data => {
        setVideos(prev => [...prev, ...data.videos]);
        nextPageUrl.current = data.next_page ?? null;
      })
      .catch(() => {})
      .finally(() => {
        setLoadingMore(false);
        isFetching.current = false;
      });
  }, []);

  return { videos, loading, loadingMore, error, loadMore };
}
