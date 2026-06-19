import { useCallback, useEffect, useRef, useState } from 'react';
import { storage } from '../services/storage';

const LIKES_KEY = '@reels_likes';

export function useReelInteractions() {
  const [likedIds, setLikedIds] = useState<Set<string>>(new Set());
  const likedIdsRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    storage.get<string[]>(LIKES_KEY).then(ids => {
      if (ids) {
        const set = new Set(ids);
        likedIdsRef.current = set;
        setLikedIds(set);
      }
    });
  }, []);

  const toggleLike = useCallback((id: string) => {
    const next = new Set(likedIdsRef.current);
    if (next.has(id)) {
      next.delete(id);
    } else {
      next.add(id);
    }
    likedIdsRef.current = next;
    setLikedIds(new Set(next));
    storage.set(LIKES_KEY, [...next]);
  }, []);

  return { likedIds, toggleLike };
}
