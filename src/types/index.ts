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
  | 'chevron-forward'
  | 'alert-circle-outline'
  | 'add-circle-outline'
  | 'add'
  | 'home'
  | 'home-outline'
  | 'film'
  | 'film-outline'
  | 'play-circle'
  | 'play-circle-outline'
  | 'volume-high'
  | 'volume-mute'
  | 'person'
  | 'person-outline'
  | 'log-out-outline'
  | 'grid-outline';

export interface IconProps {
  name: IconName;
  size?: number;
  color?: string;
}

// ─── Auth ────────────────────────────────────────────────────────────────────

export type AuthUser = { name: string; email: string };

export type AuthState = {
  isLoggedIn: boolean | null;
  name: string;
  email: string;
  hydrate: () => Promise<void>;
  login: (name: string, email: string) => Promise<void>;
  logout: () => Promise<void>;
};

// ─── Navigation ──────────────────────────────────────────────────────────────

export type RootStackParamList = {
  Login: undefined;
  MainTabs: undefined;
  PostDetail: { post: Post };
  Comments: { postId: string };
};

export type TabParamList = {
  Feed: undefined;
  Reels: undefined;
  Profile: undefined;
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


export interface Post {
  id: string;
  type?: 'photo' | 'video';
  username: string;
  avatar: string;
  location?: string;
  imageUrl: string;
  videoUrl?: string;
  likesCount: number;
  caption: string;
  commentsCount: number;
  timestamp: string;
  isLiked: boolean;
  isBookmarked: boolean;
  isFollowing: boolean;
}

// ─── Component Props ─────────────────────────────────────────────────────────

export interface PostCardProps {
  post: Post;
  isActive?: boolean;
}

// ─── Reels ────────────────────────────────────────────────────────────────────

export interface ReelItemProps {
  item: PexelsVideo;
  isActive: boolean;
  height: number;
  isLast: boolean;
  loadingMore: boolean;
  isLiked: boolean;
  onToggleLike: () => void;
  onOpenComments: () => void;
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
