import { useCallback, useEffect, useRef, useState } from 'react';
import { reelsApi } from '../services/api/reelsApi';
import type { PexelsVideo } from '../types';

const CHUNK_SIZE = 5;

export function useReels() {
  const [videos, setVideos] = useState<PexelsVideo[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(false);
  const [loadMoreError, setLoadMoreError] = useState(false);

  const buffer = useRef<PexelsVideo[]>([]);
  const nextPageUrl = useRef<string | null>(null);
  const isFetching = useRef(false);

  const flushChunk = useCallback(() => {
    const chunk = buffer.current.splice(0, CHUNK_SIZE);
    if (chunk.length > 0) {
      console.log(`[useReels] flush: +${chunk.length} videos | buffer left: ${buffer.current.length}`);
      setVideos(prev => [...prev, ...chunk]);
    }
  }, []);

  useEffect(() => {
    console.log('[useReels] fetching initial page...');
    reelsApi
      .fetch()
      .then(data => {
        console.log(`[useReels] initial fetch done: ${data.videos.length} videos buffered`);
        buffer.current = data.videos;
        nextPageUrl.current = data.next_page ?? null;
        flushChunk();
      })
      .catch(() => {
        console.warn('[useReels] initial fetch failed');
        setError(true);
      })
      .finally(() => setLoading(false));
  }, [flushChunk]);

  const loadMore = useCallback(() => {
    if (isFetching.current || loadMoreError) return;

    if (buffer.current.length > 0) {
      console.log(`[useReels] loadMore: serving from buffer (${buffer.current.length} remaining)`);
      flushChunk();
      return;
    }

    if (!nextPageUrl.current) {
      console.log('[useReels] loadMore: no more pages');
      return;
    }

    console.log('[useReels] buffer empty — fetching next page:', nextPageUrl.current);
    isFetching.current = true;
    setLoadingMore(true);

    reelsApi
      .fetch(nextPageUrl.current)
      .then(data => {
        console.log(`[useReels] next page fetched: ${data.videos.length} videos buffered`);
        buffer.current = data.videos;
        nextPageUrl.current = data.next_page ?? null;
        setLoadMoreError(false);
        flushChunk();
      })
      .catch(() => {
        console.warn('[useReels] next page fetch failed');
        setLoadMoreError(true);
      })
      .finally(() => {
        setLoadingMore(false);
        isFetching.current = false;
      });
  }, [loadMoreError, flushChunk]);

  return { videos, loading, loadingMore, error, loadMoreError, loadMore };
}
