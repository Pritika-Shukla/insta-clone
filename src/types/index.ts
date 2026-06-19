// Auth
export type AuthUser = { email: string };

export type AuthState = {
  isLoggedIn: boolean | null;
  email: string;
  hydrate: () => Promise<void>;
  login: (email: string) => Promise<void>;
  logout: () => Promise<void>;
};

// Navigation
export type RootStackParamList = {
  Login: undefined;
  Home: undefined;
};
