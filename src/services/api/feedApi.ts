import { apiFetch } from './client';
import { PEXELS_API_KEY } from '../../constants';
import type { PexelsPhotoResponse, PexelsVideoResponse } from '../../types';

const INITIAL_URL =
  'https://api.pexels.com/v1/search?query=lifestyle+travel+food&per_page=15';

const FEED_VIDEOS_URL =
  'https://api.pexels.com/videos/search?query=lifestyle+travel+food&per_page=10';

export const feedApi = {
  fetch: (url: string = INITIAL_URL) =>
    apiFetch<PexelsPhotoResponse>(url, { Authorization: PEXELS_API_KEY }),
  fetchVideos: () =>
    apiFetch<PexelsVideoResponse>(FEED_VIDEOS_URL, { Authorization: PEXELS_API_KEY }),
};
