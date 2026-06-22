import { storage } from './storage';
import type { Comment } from '../types';

const CACHE_KEY = '@comments_cache';

export async function cacheComments(comments: Comment[]): Promise<void> {
  await storage.set<Comment[]>(CACHE_KEY, comments);
}

export async function getCachedComments(): Promise<Comment[]> {
  return (await storage.get<Comment[]>(CACHE_KEY)) ?? [];
}
