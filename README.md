# Instagram Clone

An Instagram clone built with React Native. Pulls real photos and videos from the Pexels API, supports full-screen reels,  comments, persistent likes/bookmarks, and a local auth flow.

<video src="src/assets/vdo.mp4" autoplay loop muted playsinline controls width="320"></video>

---

## Features

- **Feed** — Infinite scroll of photos and videos (interleaved every 4 photos), skeleton placeholders, offline banner with cached posts
- **Reels** — Full-screen vertical video feed with snap pagination, like button (persisted), comments bottom sheet, and TTL-based video caching
- **Post Detail** — Single post view with mute toggle, like / bookmark / share / follow, and paginated comments
- **Comments** — Paginated list, add your own comments, like/unlike individual comments (all persisted locally)
- **Profile** — Deterministic initials avatar, name/email display, logout with confirmation
- **Auth** — Name, email, password validation; credentials stored locally via AsyncStorage (no server)

---

## Tech Stack

| Layer | Library |
|---|---|
| Framework | React Native 0.86 + TypeScript |
| Navigation | React Navigation v7 (Stack + Bottom Tabs) |
| State | Zustand |
| Styling | NativeWind (Tailwind CSS) |
| HTTP | Custom `apiFetch<T>()` wrapper (no axios) |
| Video | react-native-video |
| Images | react-native-fast-image |
| Storage | AsyncStorage |
| Animation | react-native-reanimated |
| Icons | Custom SVG system (27 icons) |
| Data — Media | [Pexels API](https://www.pexels.com/api/) |
| Data — Comments | JSONPlaceholder |

---

## Prerequisites

- Node >= 22.11.0
- npm
- **iOS**: Xcode + CocoaPods (`sudo gem install cocoapods`)
- **Android**: Android Studio, JDK 17, `ANDROID_HOME` set in your shell
- Pexels API key — free at [pexels.com/api](https://www.pexels.com/api/)

---

## Setup

```bash
# 1. Clone
git clone https://github.com/your-username/insta-clone.git
cd insta-clone

# 2. Install dependencies
npm install --legacy-peer-deps

# 3. Add your Pexels API key
echo "PEXELS_API_KEY=your_key_here" > .env
```

### iOS

```bash
cd ios && pod install && cd ..
npm run ios
```

### Android

```bash
npm run android
```

> If you see `adb: command not found`, add Android platform-tools to your PATH:
> ```bash
> export ANDROID_HOME=$HOME/Library/Android/sdk
> export PATH=$PATH:$ANDROID_HOME/platform-tools
> ```

---

## Running

```bash
npm start        # Start Metro bundler
npm run ios      # Run on iOS simulator
npm run android  # Run on Android emulator / device
npm run lint     # ESLint
npm test         # Jest
```

---

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `PEXELS_API_KEY` | Yes | Pexels API key for photos and videos |

Create a `.env` file in the project root (already in `.gitignore`).

---

## Project Structure

```
src/
├── components/
│   ├── common/         Icon.tsx (27 custom SVG icons)
│   └── feed/           PostCard, FeedHeader, FeedSkeleton
├── screens/
│   ├── Auth/           LoginScreen
│   ├── Home/           HomeScreen (infinite scroll feed)
│   ├── Reels/          ReelsScreen + ReelCommentsSheet
│   ├── Comments/       CommentsScreen + sub-components
│   ├── PostDetail/     PostDetailScreen
│   └── Profile/        ProfileScreen
├── navigation/         RootNavigator, MainTabNavigator
├── services/
│   ├── api/            apiFetch client, feedApi, reelsApi, commentsApi
│   ├── feedCache.ts    AsyncStorage feed cache (max 10 posts)
│   ├── reelsCache.ts   Video file cache — downloads mp4s to disk, 1h TTL
│   └── storage.ts      Generic AsyncStorage wrapper
├── store/              authStore (Zustand)
├── hooks/              useFeed, useReels, useComments, useCommentInteractions, useReelInteractions
├── types/              index.ts — 31 shared types
├── constants/          API keys, regex, storage keys
└── utils/              format.ts (formatCount)
```

### AsyncStorage Keys

| Key | Contents |
|---|---|
| `@auth_user` | `{ name, email }` |
| `@feed_cache` | Last 10 posts |
| `@comments_likes` | Liked comment IDs |
| `@comments_user` | User-added comments |
| `@reels_likes` | Liked reel video IDs |
| `@reels_video_cache` | Cached reel metadata + local file paths (TTL: 1 hour) |

---

## GitHub Deployment

### Android Release APK

A GitHub Actions workflow at `.github/workflows/release.yml` automatically builds a signed release APK on every push to `main`.

**What it does:**

1. Checks out the repo
2. Sets up Node 20 and installs dependencies (`--legacy-peer-deps`)
3. Sets up Java 17 (Temurin)
4. Runs `./gradlew assembleRelease` in the `android/` directory
5. Uploads the APK as a GitHub Actions artifact (`app-release`)

**Trigger:** Push to `main` branch.

**Download the APK:**

1. Go to your repo on GitHub
2. Click **Actions** → select the latest **Android Release Build** run
3. Scroll to **Artifacts** → download `app-release`

**To add signing** (for Play Store distribution), add these secrets to your GitHub repo under **Settings → Secrets → Actions**:

| Secret | Description |
|---|---|
| `KEYSTORE_FILE` | Base64-encoded `.jks` keystore |
| `KEY_ALIAS` | Key alias |
| `KEY_PASSWORD` | Key password |
| `STORE_PASSWORD` | Keystore password |

Then update the workflow's Gradle step:

```yaml
- name: Build Release APK
  env:
    KEYSTORE_FILE: ${{ secrets.KEYSTORE_FILE }}
    KEY_ALIAS: ${{ secrets.KEY_ALIAS }}
    KEY_PASSWORD: ${{ secrets.KEY_PASSWORD }}
    STORE_PASSWORD: ${{ secrets.STORE_PASSWORD }}
  run: |
    echo "$KEYSTORE_FILE" | base64 --decode > android/app/release.keystore
    cd android
    ./gradlew assembleRelease \
      -Pandroid.injected.signing.store.file=../app/release.keystore \
      -Pandroid.injected.signing.store.password=$STORE_PASSWORD \
      -Pandroid.injected.signing.key.alias=$KEY_ALIAS \
      -Pandroid.injected.signing.key.password=$KEY_PASSWORD
```

### iOS

iOS builds require Apple Developer certificates and cannot run on GitHub's free Linux runners. Use [Fastlane](https://fastlane.tools/) with a macOS runner or [Expo EAS](https://expo.dev/eas) for CI/CD.

---

## Notes

- No real authentication — password is validated client-side and never stored
- Pexels API free tier: 200 requests/hour, 20,000/month
- Feed caches the last 10 posts for offline viewing
- Reels cache up to 4 videos as local mp4 files with a 1-hour TTL — fresh cache serves instantly while new data loads in the background; stale cache is discarded
- Video autoplay respects viewability (pauses when < 60% visible)
