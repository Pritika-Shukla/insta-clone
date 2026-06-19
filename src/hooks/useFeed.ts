import { useCallback, useEffect, useRef, useState } from 'react';
import { feedApi } from '../services/api/feedApi';
import { feedCache } from '../services/feedCache';
import type { PexelsPhoto, PexelsVideo, PexelsVideoFile, Post } from '../types';

const VIDEOS_EVERY_N = 4;


const mapPhotoToPost = (photo: PexelsPhoto): Post => ({
  id: `photo_${photo.id}`,
  type: 'photo',
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

function getBestVideoUrl(files: PexelsVideoFile[]): string {
  const mp4 = files.filter(f => f.file_type === 'video/mp4');
  return (
    mp4.find(f => f.quality === 'hd')?.link ??
    mp4.find(f => f.quality === 'sd')?.link ??
    mp4[0]?.link ?? ''
  );
}

const mapVideoToPost = (video: PexelsVideo): Post => ({
  id: `video_${video.id}`,
  type: 'video',
  username: video.user.name.toLowerCase().replace(/\s+/g, '.'),
  avatar: video.image,
  imageUrl: video.image,
  videoUrl: getBestVideoUrl(video.video_files),
  likesCount: (video.id * 11) % 20000 + 200,
  caption: `${video.duration}s clip`,
  commentsCount: (video.id * 5) % 500 + 15,
  timestamp: '1 hour ago',
  isLiked: false,
  isBookmarked: false,
  isFollowing: false,
});

function interleave(photos: Post[], videos: Post[], every: number): Post[] {
  const result: Post[] = [];
  let vi = 0;
  for (let i = 0; i < photos.length; i++) {
    result.push(photos[i]);
    if ((i + 1) % every === 0 && vi < videos.length) {
      result.push(videos[vi++]);
    }
  }
  return result;
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useFeed() {
  const [posts, setPosts]               = useState<Post[]>([]);
  const [loading, setLoading]           = useState(true);
  const [loadingMore, setLoadingMore]   = useState(false);
  const [error, setError]               = useState(false);
  const [loadMoreError, setLoadMoreError] = useState(false);
  const [fromCache, setFromCache]       = useState(false);

  const nextPageUrl = useRef<string | null>(null);
  const isFetching  = useRef(false);

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
        const [photoResult, videoResult] = await Promise.allSettled([
          feedApi.fetch(),
          feedApi.fetchVideos(),
        ]);
        if (cancelled) return;

        if (photoResult.status === 'rejected') throw photoResult.reason;

        const photos = photoResult.value.photos.map(mapPhotoToPost);
        const videos = videoResult.status === 'fulfilled'
          ? videoResult.value.videos.map(mapVideoToPost)
          : [];

        const fresh = interleave(photos, videos, VIDEOS_EVERY_N);
        setPosts(fresh);
        setFromCache(false);
        nextPageUrl.current = photoResult.value.next_page ?? null;

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

  const loadMore = useCallback(async () => {
    if (isFetching.current || !nextPageUrl.current || loadMoreError) return;

    isFetching.current = true;
    setLoadingMore(true);

    try {
      const data = await feedApi.fetch(nextPageUrl.current);
      setPosts(prev => [...prev, ...data.photos.map(mapPhotoToPost)]);
      nextPageUrl.current = data.next_page ?? null;
      setLoadMoreError(false);
    } catch {
      setLoadMoreError(true);
    } finally {
      setLoadingMore(false);
      isFetching.current = false;
    }
  }, [loadMoreError]);

  return { posts, loading, loadingMore, error, loadMoreError, fromCache, loadMore };
}
