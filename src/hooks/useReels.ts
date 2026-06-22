import { useCallback, useEffect, useRef, useState } from 'react';
import NetInfo from '@react-native-community/netinfo';
import { reelsApi } from '../services/api/reelsApi';
import { cacheReels, getCachedReels, isCacheStale } from '../services/reelsCache';
import type { PexelsVideo } from '../types';

const CHUNK_SIZE = 5;

export function useReels() {
  const [videos, setVideos] = useState<PexelsVideo[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(false);
  const [loadMoreError, setLoadMoreError] = useState(false);
  const [isOffline, setIsOffline] = useState(false);

  const buffer = useRef<PexelsVideo[]>([]);
  const nextPageUrl = useRef<string | null>(null);
  const isFetching = useRef(false);

  const flushChunk = useCallback(() => {
    const chunk = buffer.current.splice(0, CHUNK_SIZE);
    if (chunk.length > 0) {
      setVideos(prev => [...prev, ...chunk]);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function init() {
      const netState = await NetInfo.fetch();
      const online = netState.isConnected && netState.isInternetReachable !== false;

      if (!online) {
        setIsOffline(true);
        const stale = await isCacheStale();
        const cached = stale ? [] : await getCachedReels();
        if (!cancelled) {
          cached.length > 0 ? setVideos(cached) : setError(true);
          setLoading(false);
        }
        return;
      }

      // Seed UI instantly from cache if fresh, then replace with live data
      let seededFromCache = false;
      const stale = await isCacheStale();
      if (!stale) {
        const cached = await getCachedReels();
        if (!cancelled && cached.length > 0) {
          setVideos(cached);
          setLoading(false);
          seededFromCache = true;
        }
      }

      try {
        const data = await reelsApi.fetch();
        if (!cancelled) {
          buffer.current = data.videos;
          nextPageUrl.current = data.next_page ?? null;
          setVideos([]);
          flushChunk();
          cacheReels(data.videos.slice(0, 4)).catch(() => {});
        }
      } catch {
        if (!cancelled && !seededFromCache) {
          const cached = await getCachedReels();
          if (cached.length > 0) {
            setVideos(cached);
            setIsOffline(true);
          } else {
            setError(true);
          }
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    init();
    return () => {
      cancelled = true;
    };
  }, [flushChunk]);

  const loadMore = useCallback(() => {
    if (isOffline || isFetching.current || loadMoreError) return;

    if (buffer.current.length > 0) {
      flushChunk();
      return;
    }

    if (!nextPageUrl.current) return;

    isFetching.current = true;
    setLoadingMore(true);

    reelsApi
      .fetch(nextPageUrl.current)
      .then(data => {
        buffer.current = data.videos;
        nextPageUrl.current = data.next_page ?? null;
        setLoadMoreError(false);
        flushChunk();
      })
      .catch(() => setLoadMoreError(true))
      .finally(() => {
        setLoadingMore(false);
        isFetching.current = false;
      });
  }, [isOffline, loadMoreError, flushChunk]);

  return { videos, loading, loadingMore, error, loadMoreError, loadMore, isOffline };
}
