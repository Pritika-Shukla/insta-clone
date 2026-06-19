import { apiFetch } from './client';
import { PEXELS_API_KEY } from '../../constants';
import type { PexelsVideoResponse } from '../../types';

const INITIAL_URL =
  'https://api.pexels.com/videos/search?query=cinematic+nature&orientation=portrait&per_page=50';

export const reelsApi = {
  fetch: (url: string = INITIAL_URL) =>
    apiFetch<PexelsVideoResponse>(url, { Authorization: PEXELS_API_KEY }),
};
