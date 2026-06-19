import { apiFetch } from './client';
import { PEXELS_API_KEY } from '../../constants';
import type { PexelsPhotoResponse } from '../../types';

const INITIAL_URL =
  'https://api.pexels.com/v1/search?query=lifestyle+travel+food&per_page=5';

export const feedApi = {
  fetch: (url: string = INITIAL_URL) =>
    apiFetch<PexelsPhotoResponse>(url, { Authorization: PEXELS_API_KEY }),
};
