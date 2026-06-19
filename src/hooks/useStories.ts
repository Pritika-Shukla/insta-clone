import { useEffect, useState } from 'react';
import { storiesApi } from '../services/api/storiesApi';
import type { PexelsPhoto, Story } from '../types';

const OWN_STORY: Story = {
  id: 'own',
  username: 'Your story',
  avatar: '',
  hasStory: false,
  isOwn: true,
};

const mapPhotoToStory = (photo: PexelsPhoto): Story => ({
  id: String(photo.id),
  username: photo.photographer.toLowerCase().replace(/\s+/g, '.'),
  avatar: photo.src.small,
  hasStory: photo.id % 3 !== 0,
});

export function useStories() {
  const [stories, setStories] = useState<Story[]>([OWN_STORY]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    storiesApi
      .fetch()
      .then(data => {
        setStories([OWN_STORY, ...data.photos.map(mapPhotoToStory)]);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return { stories, loading };
}
