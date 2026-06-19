// ─── Icon ────────────────────────────────────────────────────────────────────

export type IconName =
  | 'heart'
  | 'heart-outline'
  | 'chatbubble-outline'
  | 'paper-plane-outline'
  | 'bookmark'
  | 'bookmark-outline'
  | 'ellipsis-horizontal'
  | 'arrow-back'
  | 'alert-circle-outline'
  | 'add-circle-outline'
  | 'add'
  | 'home'
  | 'home-outline'
  | 'play-circle'
  | 'play-circle-outline'
  | 'volume-high'
  | 'volume-mute';

export interface IconProps {
  name: IconName;
  size?: number;
  color?: string;
}

// ─── Auth ────────────────────────────────────────────────────────────────────

export type AuthUser = { email: string };

export type AuthState = {
  isLoggedIn: boolean | null;
  email: string;
  hydrate: () => Promise<void>;
  login: (email: string) => Promise<void>;
  logout: () => Promise<void>;
};

// ─── Navigation ──────────────────────────────────────────────────────────────

export type RootStackParamList = {
  Login: undefined;
  MainTabs: undefined;
  Comments: { postId: string };
};

export type TabParamList = {
  Feed: undefined;
  Reels: undefined;
};

// ─── Comments ─────────────────────────────────────────────────────────────────

export interface Comment {
  id: number;
  postId: number;
  name: string;
  email: string;
  body: string;
}

// ─── Feed ────────────────────────────────────────────────────────────────────

export interface Story {
  id: string;
  username: string;
  avatar: string;
  hasStory: boolean;
  isOwn?: boolean;
}

export interface Post {
  id: string;
  username: string;
  avatar: string;
  location?: string;
  imageUrl: string;
  likesCount: number;
  caption: string;
  commentsCount: number;
  timestamp: string;
  isLiked: boolean;
  isBookmarked: boolean;
  isFollowing: boolean;
}

// ─── Component Props ─────────────────────────────────────────────────────────

export interface StoryItemProps {
  story: Story;
}

export interface PostCardProps {
  post: Post;
}

// ─── Reels ────────────────────────────────────────────────────────────────────

export interface ReelItemProps {
  item: PexelsVideo;
  isActive: boolean;
  height: number;
  isLast: boolean;
  loadingMore: boolean;
}

// ─── Pexels Photos ────────────────────────────────────────────────────────────

export interface PexelsPhotoSrc {
  original: string;
  large2x: string;
  large: string;
  medium: string;
  small: string;
  portrait: string;
  landscape: string;
  tiny: string;
}

export interface PexelsPhoto {
  id: number;
  width: number;
  height: number;
  photographer: string;
  src: PexelsPhotoSrc;
  alt: string;
}

export interface PexelsPhotoResponse {
  page: number;
  per_page: number;
  total_results: number;
  photos: PexelsPhoto[];
  next_page?: string;
}

// ─── Pexels Videos ────────────────────────────────────────────────────────────

export interface PexelsVideoFile {
  id: number;
  quality: string;
  file_type: string;
  width: number;
  height: number;
  link: string;
}

export interface PexelsVideo {
  id: number;
  width: number;
  height: number;
  image: string;
  duration: number;
  user: { id: number; name: string; url: string };
  video_files: PexelsVideoFile[];
}

export interface PexelsVideoResponse {
  page: number;
  per_page: number;
  total_results: number;
  videos: PexelsVideo[];
  next_page?: string;
}
