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
  Home: undefined;
};

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
