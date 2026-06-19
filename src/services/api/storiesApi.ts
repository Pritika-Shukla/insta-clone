import { apiFetch } from './client';
import { PEXELS_API_KEY } from '../../constants';
import type { PexelsPhotoResponse } from '../../types';

const STORIES_URL =
  'https://api.pexels.com/v1/search?query=portrait+people&per_page=10&orientation=square';

export const storiesApi = {
  fetch: () =>
    apiFetch<PexelsPhotoResponse>(STORIES_URL, { Authorization: PEXELS_API_KEY }),
};
