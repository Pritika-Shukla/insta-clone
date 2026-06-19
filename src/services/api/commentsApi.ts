import { apiFetch } from './client';
import type { Comment } from '../../types';

const BASE = 'https://jsonplaceholder.typicode.com';

export const commentsApi = {
  getByPost: (postId: number) =>
    apiFetch<Comment[]>(`${BASE}/posts/${postId}/comments`),

  getPaginated: (start: number, limit: number) =>
    apiFetch<Comment[]>(`${BASE}/comments?_start=${start}&_limit=${limit}`),
};
