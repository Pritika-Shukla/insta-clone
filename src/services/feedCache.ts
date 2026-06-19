import { storage } from './storage';
import type { Post } from '../types';

const FEED_CACHE_KEY = '@feed_cache';
const CACHE_LIMIT = 10;

export const feedCache = {
  get: () => storage.get<Post[]>(FEED_CACHE_KEY),
  set: (posts: Post[]) => storage.set(FEED_CACHE_KEY, posts.slice(0, CACHE_LIMIT)),
};
