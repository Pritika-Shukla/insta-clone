import RNFS from 'react-native-fs';
import { storage } from './storage';
import type { PexelsVideo, PexelsVideoFile } from '../types';

const CACHE_META_KEY = '@reels_video_cache';
const CACHE_COUNT = 4;
const CACHE_TTL_MS = 60 * 60 * 1000; // 1 hour

function getCacheDir(): string {
  return `${RNFS.CachesDirectoryPath}/reels`;
}

interface ReelsCacheMeta {
  cachedAt: number;
  videos: PexelsVideo[];
}

function getBestVideoFile(files: PexelsVideoFile[]): PexelsVideoFile | undefined {
  const mp4 = files.filter(f => f.file_type === 'video/mp4');
  return mp4.find(f => f.quality === 'hd') ?? mp4.find(f => f.quality === 'sd') ?? mp4[0];
}

async function ensureCacheDir(): Promise<void> {
  const dir = getCacheDir();
  const exists = await RNFS.exists(dir);
  if (!exists) await RNFS.mkdir(dir);
}

async function downloadVideo(url: string, videoId: number): Promise<string> {
  const localPath = `${getCacheDir()}/video_${videoId}.mp4`;
  const exists = await RNFS.exists(localPath);
  if (!exists) {
    const { promise } = RNFS.downloadFile({ fromUrl: url, toFile: localPath });
    await promise;
  }
  return localPath;
}

export async function cacheReels(videos: PexelsVideo[]): Promise<void> {
  await ensureCacheDir();

  const cachedVideos = await Promise.all(
    videos.slice(0, CACHE_COUNT).map(async video => {
      const best = getBestVideoFile(video.video_files);
      if (!best) return video;
      try {
        const localPath = await downloadVideo(best.link, video.id);
        const updatedFiles = video.video_files.map(f =>
          f.id === best.id ? { ...f, link: `file://${localPath}` } : f,
        );
        return { ...video, video_files: updatedFiles };
      } catch {
        return video;
      }
    }),
  );

  await storage.set<ReelsCacheMeta>(CACHE_META_KEY, {
    cachedAt: Date.now(),
    videos: cachedVideos,
  });
}

export async function getCachedReels(): Promise<PexelsVideo[]> {
  const meta = await storage.get<ReelsCacheMeta>(CACHE_META_KEY);
  return meta?.videos ?? [];
}

export async function hasCachedReels(): Promise<boolean> {
  const meta = await storage.get<ReelsCacheMeta>(CACHE_META_KEY);
  return (meta?.videos?.length ?? 0) > 0;
}

export async function isCacheStale(): Promise<boolean> {
  const meta = await storage.get<ReelsCacheMeta>(CACHE_META_KEY);
  if (!meta) return true;
  return Date.now() - meta.cachedAt > CACHE_TTL_MS;
}
