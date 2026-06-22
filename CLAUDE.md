# CLAUDE.md

## Project

React Native Instagram clone. TypeScript, NativeWind (Tailwind CSS), Zustand, React Navigation. No backend — uses Pexels API (photos/videos) and JSONPlaceholder (comments).

## Commands

```bash
npm start           # Metro bundler
npm run ios         # Run on iOS simulator
npm run android     # Run on Android emulator
npm run lint        # ESLint
npm test            # Jest
```

Requires Node >= 22.11.0. Pexels API key in `.env` as `PEXELS_API_KEY`.

## Architecture

```
src/
  components/       # Reusable UI (PostCard, FeedHeader, Icon, skeletons)
  screens/          # Auth/, Home/, Reels/, Comments/, PostDetail/, Profile/
  navigation/       # RootNavigator (auth gate) + MainTabNavigator (3 bottom tabs)
  services/
    api/            # apiFetch<T>() client + feedApi, reelsApi, commentsApi
    feedCache.ts    # AsyncStorage feed cache (max 10 posts)
    storage.ts      # Generic AsyncStorage wrapper
  store/            # Zustand: authStore (isLoggedIn | null, name, email)
  hooks/            # useFeed, useReels, useComments, useCommentInteractions, useReelInteractions
  types/            # index.ts — 31 shared types
  constants/        # PEXELS_API_KEY, AUTH_KEY, EMAIL_REGEX
  utils/            # format.ts (formatCount: 1200 → 1.2K)
```

## Key Patterns

**State**: Zustand (`authStore`). `isLoggedIn` is `null` while hydrating — RootNavigator shows spinner until resolved.

**API**: All requests go through `apiFetch<T>(url, headers)` in `services/api/client.ts`. It normalizes double `/v1/v1/` paths and throws on non-ok responses.

**Data sources**:
- Feed: Pexels photos (`/v1/search`, 15/page) + videos (`/v1/videos/search`, 10/page), interleaved every 4 photos
- Reels: Pexels portrait videos, chunked 5-video buffer loading
- Comments: JSONPlaceholder `/comments`, page size 10

**Persistence** (AsyncStorage keys):
- `@auth_user` — name + email
- `@feed_cache` — last 10 posts
- `@comments_likes` — liked comment IDs
- `@comments_user` — user-added comments
- `@reels_likes` — liked reel video IDs

**Styling**: NativeWind (Tailwind classes in JSX). Active color `#4f46e5` (indigo), inactive `#A1A1AA` (zinc). No StyleSheet unless Tailwind can't cover it.

**Icons**: Custom SVG icon system in `components/common/Icon.tsx` — 27 named icons, memoized. Don't add new icon libraries.

**Performance**:
- `PostCard` and other heavy components are `React.memo`'d
- Videos pause when < 60% visible (viewability threshold)
- Feed and reels use chunked/paginated loading

## Conventions

- Functional components only, no class components
- Custom hooks for all data-fetching logic — screens stay thin
- Types live in `src/types/index.ts`, add there rather than inline
- No password stored — auth is local name/email only
- No real backend; don't introduce one without explicit request

## What to Avoid

- Don't install new icon libraries (custom SVG system exists)
- Don't add Redux or Context API (Zustand is the store)
- Don't add axios usage (project uses `apiFetch` wrapper)
- Don't commit `.env` or expose `PEXELS_API_KEY` in code
- Don't skip `React.memo` on list-item components
- Don't use inline `StyleSheet` where NativeWind suffices
