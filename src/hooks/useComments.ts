import { useCallback, useEffect, useState } from 'react';
import { commentsApi } from '../services/api/commentsApi';
import type { Comment } from '../types';

export function useComments(postId: number) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    commentsApi
      .getByPost(postId)
      .then(setComments)
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [postId]);

  const addComment = useCallback((comment: Comment) => {
    setComments(prev => [comment, ...prev]);
  }, []);

  return { comments, loading, error, addComment };
}
