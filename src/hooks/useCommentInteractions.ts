import { useCallback, useEffect, useRef, useState } from 'react';
import { storage } from '../services/storage';
import type { Comment } from '../types';

const LIKES_KEY = '@comments_likes';
const USER_COMMENTS_KEY = '@comments_user';

export function useCommentInteractions() {
  const [likedIds, setLikedIds] = useState<Set<string>>(new Set());
  const [userComments, setUserComments] = useState<Comment[]>([]);

  const likedIdsRef = useRef<Set<string>>(new Set());
  const userCommentsRef = useRef<Comment[]>([]);

  useEffect(() => {
    storage.get<string[]>(LIKES_KEY).then(ids => {
      if (ids) {
        const set = new Set(ids);
        likedIdsRef.current = set;
        setLikedIds(set);
      }
    });
    storage.get<Comment[]>(USER_COMMENTS_KEY).then(saved => {
      if (saved) {
        userCommentsRef.current = saved;
        setUserComments(saved);
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

  const addUserComment = useCallback((comment: Comment) => {
    const next = [comment, ...userCommentsRef.current];
    userCommentsRef.current = next;
    setUserComments(next);
    storage.set(USER_COMMENTS_KEY, next);
  }, []);

  return { likedIds, toggleLike, userComments, addUserComment };
}
