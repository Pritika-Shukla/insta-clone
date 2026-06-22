# AGENTS.md

Instructions for AI coding agents (Cursor, Copilot, Claude Code, etc.) working in this repo.

## Project Summary

React Native Instagram clone. TypeScript + NativeWind (Tailwind CSS) + Zustand + React Navigation v7. No backend — Pexels API for media, JSONPlaceholder for comments, AsyncStorage for persistence.

**Node >= 22.11.0 required.**

## Running the App

```bash
npm start           # Metro bundler (keep running in background)
npm run ios         # iOS simulator
npm run android     # Android emulator / device
npm run lint        # ESLint check
npm test            # Jest unit tests
```

Set `PEXELS_API_KEY` in `.env` before running.

## Repo Layout

| Path | Purpose |
|------|---------|
| `src/screens/` | One folder per screen (Auth, Home, Reels, Comments, PostDetail, Profile) |
| `src/components/` | Reusable UI — `common/Icon.tsx` (27 SVG icons), `feed/` (PostCard, FeedHeader, FeedSkeleton) |
| `src/navigation/` | `RootNavigator.tsx` (auth gate) + `MainTabNavigator.tsx` (3 bottom tabs) |
| `src/services/api/` | `client.ts` (`apiFetch<T>`), `feedApi.ts`, `reelsApi.ts`, `commentsApi.ts` |
| `src/services/` | `feedCache.ts` (AsyncStorage, max 10 posts), `storage.ts` (generic wrapper) |
| `src/store/` | `authStore.ts` — Zustand store, sole source of auth truth |
| `src/hooks/` | All data-fetching hooks; screens import from here, not from services directly |
| `src/types/index.ts` | 31 shared TypeScript types — add new ones here |
| `src/constants/index.ts` | `PEXELS_API_KEY`, `AUTH_KEY`, `EMAIL_REGEX` |

## Coding Rules

### Do
- Functional components + hooks only
- Add types to `src/types/index.ts`
- Use `apiFetch<T>()` for all HTTP (handles error + URL normalization)
- `React.memo` all list-item components (`PostCard`, `CommentItem`, etc.)
- Use NativeWind Tailwind classes for styling
- Add data-fetching logic to custom hooks in `src/hooks/`, not in screen files
- Persist interaction state (likes, bookmarks) via `src/services/storage.ts`

### Don't
- No class components
- No Redux or React Context for state (Zustand only)
- No axios (use `apiFetch<T>()`)
- No new icon libraries (use `Icon.tsx`)
- No inline `StyleSheet.create` where NativeWind works
- Don't store passwords — auth is local name/email only
- Don't commit `.env` or hardcode `PEXELS_API_KEY`

## Data Flow

```
Screen → custom hook → services/api → apiFetch<T>() → Pexels / JSONPlaceholder
                     ↘ services/storage → AsyncStorage (persistence)
Screen → Zustand store (auth state)
```

Auth gate: `authStore.isLoggedIn` is `null` during hydration. `RootNavigator` shows a spinner until it resolves to `true` or `false`.

## AsyncStorage Keys

| Key | Contents |
|-----|---------|
| `@auth_user` | `{ name, email }` |
| `@feed_cache` | Last 10 posts (photos + videos) |
| `@comments_likes` | Set of liked comment IDs |
| `@comments_user` | User-added comments |
| `@reels_likes` | Set of liked reel video IDs |

## Navigation Structure

```
RootNavigator (Stack)
├── LoginScreen           (when !isLoggedIn)
└── MainTabNavigator      (when isLoggedIn)
    ├── Home tab → HomeScreen
    ├── Reels tab → ReelsScreen
    └── Profile tab → ProfileScreen
    + Modal stack: PostDetailScreen, CommentsScreen
```

## Styling

- Primary active color: `#4f46e5` (indigo-600)
- Inactive / muted: `#A1A1AA` (zinc-400)
- Tab bar active pill background: `#EEF2FF`
- Use Tailwind class names via NativeWind; avoid `StyleSheet.create` unless unavoidable

## Testing

- Jest + `@testing-library/react-native`
- Test files in `__tests__/`
- Run `npm test` — must pass before marking a task done
- Run `npm run lint` — no ESLint errors

## Environment

```
PEXELS_API_KEY=your_key_here   # required — get from pexels.com/api
```
