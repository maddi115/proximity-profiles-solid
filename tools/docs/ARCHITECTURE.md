
=== 🧠 CODEBRAIN ARCHITECTURE ANALYSIS ===
Project: proximity-profiles-solid
Files Analyzed: 94 | Depth: unlimited

📂 DIRECTORY STRUCTURE WITH CODE REFERENCES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

src/
├── 🎯 Entry Points (2)
│   ├── App.jsx
│   │   📄 src/app/App.jsx
│   │   ├─ Imports: @solidjs/router, solid-js, authStore, ProtectedRoute...
│   │   └─ Functions: App
│
│   ├── main.tsx
│   │   📄 src/main.tsx
│   │   ├─ Imports: solid-js/web, App
│
├── 📱 Features (10)
│   ├── auth/ (9 files)
│   │
│   ├── 🧩 Components (4)
│   │   ├── LoginForm.jsx
│   │   │   📄 src/features/auth/components/LoginForm.jsx
│   │   │   ├─ Imports: solid-js, useAuth, auth.module
│   │   │   └─ Key Function: LoginForm() - 34 lines
│   │   ├── LoginModal.jsx
│   │   │   📄 src/features/auth/components/LoginModal.jsx
│   │   │   ├─ Imports: LoginForm
│   │   │   └─ Key Function: LoginModal() - 6 lines
│   │   ├── ProtectedRoute.jsx
│   │   │   📄 src/features/auth/components/ProtectedRoute.jsx
│   │   │   ├─ Imports: solid-js, @solidjs/router, useAuth...
│   │   │   └─ Key Function: ProtectedRoute() - 36 lines
│   │   └── SignupForm.jsx
│   │       📄 src/features/auth/components/SignupForm.jsx
│   │       ├─ Imports: solid-js, @solidjs/router, useAuth...
│   │       └─ Key Function: SignupForm() - 106 lines
│   │
│   ├── 🎣 Hooks (1)
│   │   └── useAuth.ts
│   │       📄 src/features/auth/hooks/useAuth.ts
│   │       ├─ Exports: useAuth()
│   │       └─ Used by: LoginForm.jsx, ProtectedRoute.jsx +2 more
│   │
│   ├── 💾 Stores (1)
│   │   └── authStore.ts ⚠️ HIGH COUPLING
│   │       📄 src/features/auth/store/authStore.ts
│   │       └─ Used by: 9 files
│   │           - App.jsx
│   │           - useAuth.ts
│   │           - messagesStore.ts
│   │           - StoryButton.jsx
│   │           - CompactMode.jsx
│   │           - conversation.jsx
│   │           - index.jsx
│   │           - index.jsx
│   │           - _layout.jsx
│   │
│   └── 🛠️ Utils (1)
│       └── supabaseClient.js
│           📄 src/features/auth/utils/supabaseClient.js
│           ├─ Exports: createMockClient
│           └─ Used by: authStore.ts
│
│   ├── errors/ (3 files)
│   │
│   └── 🛠️ Utils (1)
│       └── errorHandler.js
│           📄 src/features/errors/utils/errorHandler.js
│           ├─ Exports: handleError
│
│   ├── following/ (1 files)
│   │
│   ├── 💾 Stores (1)
│   │   └── followingStore.ts
│   │       📄 src/features/following/store/followingStore.ts
│   │       └─ Used by: 1 file
│   │           - index.jsx
│
│   ├── loading/ (5 files)
│   │
│   ├── 🧩 Components (2)
│   │   ├── LoadingButton.jsx
│   │   │   📄 src/features/loading/components/LoadingButton.jsx
│   │   │   ├─ Imports: solid-js, LoadingSpinner, loading.module
│   │   │   └─ Key Function: LoadingButton() - 62 lines
│   │   └── LoadingSpinner.jsx
│   │       📄 src/features/loading/components/LoadingSpinner.jsx
│   │       ├─ Imports: loading.module
│   │       └─ Key Function: LoadingSpinner() - 15 lines
│   │
│   ├── 🎣 Hooks (1)
│   │   └── useLoading.ts
│   │       📄 src/features/loading/hooks/useLoading.ts
│   │       ├─ Exports: useLoading()
│   │       └─ Used by: useProfileActions.ts
│   │
│   ├── 💾 Stores (1)
│   │   └── loadingStore.ts
│   │       📄 src/features/loading/store/loadingStore.ts
│   │       └─ Used by: 1 file
│   │           - useLoading.ts
│
│   ├── messages/ (1 files)
│   │
│   ├── 💾 Stores (1)
│   │   └── messagesStore.ts
│   │       📄 src/features/messages/store/messagesStore.ts
│   │       └─ Used by: 1 file
│   │           - index.jsx
│
│   ├── notifications/ (5 files)
│   │
│   ├── 🧩 Components (1)
│   │   └── NotificationView.jsx
│   │       📄 src/features/notifications/components/NotificationView.jsx
│   │       ├─ Imports: solid-js, notifications.module
│   │       └─ Key Function: NotificationView() - 48 lines
│   │
│   ├── 🎣 Hooks (1)
│   │   └── useNotifications.ts
│   │       📄 src/features/notifications/hooks/useNotifications.ts
│   │       ├─ Exports: useNotifications()
│   │       └─ Used by: useProfileActions.ts
│   │
│   ├── 💾 Stores (2)
│   │   ├── activityStore.ts
│   │   │   📄 src/features/notifications/store/activityStore.ts
│   │   │   └─ Used by: 3 files
│   │   │       - messagesStore.ts
│   │   │       - useProfileActions.ts
│   │   │       - activity.jsx
│   │   └── notificationStore.ts
│   │       📄 src/features/notifications/store/notificationStore.ts
│   │       └─ Used by: 2 files
│   │           - useNotifications.ts
│   │           - index.jsx
│
│   ├── profile/ (4 files)
│   │
│   ├── 🧩 Components (3)
│   │   ├── Card.jsx
│   │   │   📄 src/features/profile/components/Card.jsx
│   │   │   ├─ Imports: card.module
│   │   │   └─ Key Function: Card() - 25 lines
│   │   ├── ProfileHeader.jsx
│   │   │   📄 src/features/profile/components/ProfileHeader.jsx
│   │   │   ├─ Imports: solid-js, profileStore, profile.module
│   │   │   └─ Key Function: ProfileHeader() - 77 lines
│   │   └── ProfileStats.jsx
│   │       📄 src/features/profile/components/ProfileStats.jsx
│   │       ├─ Imports: profileStore, profile.module
│   │       └─ Key Function: ProfileStats() - 32 lines
│   │
│   ├── 💾 Stores (1)
│   │   └── profileStore.ts
│   │       📄 src/features/profile/store/profileStore.ts
│   │       └─ Used by: 3 files
│   │           - ProfileHeader.jsx
│   │           - ProfileStats.jsx
│   │           - my-profile.jsx
│
│   ├── proximity/ ⭐ CORE FEATURE (20 files)
│   │
│   ├── 🧩 Components (4)
│   │   ├── ProximityMap.jsx
│   │   │   📄 src/features/proximity/ProximityMap.jsx
│   │   │   ├─ Imports: solid-js, AppleWatchGrid, mockData...
│   │   │   └─ Key Function: ProximityMap() - 34 lines
│   │   ├── AppleWatchGrid.jsx
│   │   │   📄 src/features/proximity/components/AppleWatchGrid.jsx
│   │   │   ├─ Imports: solid-js, appleWatch.module, honeycombLayout...
│   │   │   └─ Key Function: AppleWatchGrid() - 320 lines
│   │   ├── BlurredBackground.jsx
│   │   │   📄 src/features/proximity/components/BlurredBackground.jsx
│   │   │   ├─ Imports: solid-js
│   │   │   └─ Key Function: BlurredBackground() - 89 lines
│   │   └── ProximityList.jsx
│   │       📄 src/features/proximity/components/ProximityList.jsx
│   │       ├─ Imports: solid-js, proximityList.module
│   │       └─ Key Function: ProximityList() - 38 lines
│   │
│   ├── 🎣 Hooks (6)
│   │   ├── useCulling.js
│   │   │   📄 src/features/proximity/components/canvas/useCulling.js
│   │   │   ├─ Exports: useCulling()
│   │   │   └─ Used by: AppleWatchGrid.jsx
│   │   ├── useSnapback.js
│   │   │   📄 src/features/proximity/components/canvas/useSnapback.js
│   │   │   ├─ Exports: useSnapback()
│   │   │   └─ Used by: AppleWatchGrid.jsx
│   │   ├── useProfileClick.js
│   │   │   📄 src/features/proximity/components/interactions/useProfileClick.js
│   │   │   ├─ Exports: useProfileClick()
│   │   │   └─ Used by: AppleWatchGrid.jsx
│   │   ├── useProfileActions.ts
│   │   │   📄 src/features/proximity/hooks/useProfileActions.ts
│   │   │   ├─ Exports: useProfileActions()
│   │   │   └─ Used by: ProfileActions.jsx
│   │   ├── useProfileSelection.ts
│   │   │   📄 src/features/proximity/hooks/useProfileSelection.ts
│   │   │   ├─ Exports: useProfileSelection()
│   │   └── useProximityTracking.ts
│   │       📄 src/features/proximity/hooks/useProximityTracking.ts
│   │       ├─ Exports: useProximityTracking()
│   │       └─ Used by: index.jsx
│   │
│   ├── 💾 Stores (3)
│   │   ├── proximityHitsStore.ts
│   │   │   📄 src/features/proximity/store/proximityHitsStore.ts
│   │   │   └─ Used by: 2 files
│   │   │       - useProximityTracking.ts
│   │   │       - index.jsx
│   │   ├── proximityStore.ts ⚠️ HIGH COUPLING
│   │   │   📄 src/features/proximity/store/proximityStore.ts
│   │   │   └─ Used by: 8 files
│   │   │       - followingStore.ts
│   │   │       - ProximityMap.jsx
│   │   │       - useProfileActions.ts
│   │   │       - useProfileSelection.ts
│   │   │       - activity.jsx
│   │   │       - BalanceWarning.jsx
│   │   │       - index.jsx
│   │   │       - index.jsx
│   │   └── selectedProfileStore.ts
│   │       📄 src/features/proximity/store/selectedProfileStore.ts
│   │       └─ Used by: 2 files
│   │           - ProximityMap.jsx
│   │           - index.jsx
│   │
│   └── 🛠️ Utils (2)
│       ├── extractDominantColor.js
│       │   📄 src/features/proximity/utils/extractDominantColor.js
│       │   ├─ Exports: extractDominantColor
│       └── utils.js
│           📄 src/features/proximity/utils.js
│           ├─ Exports: calculateDistance, createHeart
│
│   ├── settings/ (3 files)
│   │
│   ├── 🧩 Components (2)
│   │   ├── SettingsSection.jsx
│   │   │   📄 src/features/settings/components/SettingsSection.jsx
│   │   │   ├─ Imports: settings.module
│   │   │   └─ Key Function: SettingsSection() - 26 lines
│   │   └── ThemeToggle.jsx
│   │       📄 src/features/settings/components/ThemeToggle.jsx
│   │       ├─ Imports: settingsStore, settings.module
│   │       └─ Key Function: ThemeToggle() - 30 lines
│   │
│   ├── 💾 Stores (1)
│   │   └── settingsStore.ts
│   │       📄 src/features/settings/store/settingsStore.ts
│   │       └─ Used by: 2 files
│   │           - ThemeToggle.jsx
│   │           - settings.jsx
│
│   └── test/ (1 files)
    │
    ├── 💾 Stores (1)
    │   └── testStore.ts
    │       📄 src/features/test/store/testStore.ts
│
├── 🗺️  Routes (29)
│   ├── _layout.jsx
│   │   📄 src/routes/(sheet)/_layout.jsx
│   │   └─ Imports: solid-js, @solidjs/router, SheetFooter, sheetLayout.module
│   ├── activity.jsx
│   │   📄 src/routes/(sheet)/activity.jsx
│   │   └─ Imports: solid-js, activityStore, proximityStore, mockData...
│   ├── login.jsx
│   │   📄 src/routes/(sheet)/auth/login.jsx
│   │   └─ Imports: LoginForm
│   ├── dashboard.jsx
│   │   📄 src/routes/(sheet)/dashboard.jsx
│   │   └─ Imports: routes.module
│   ├── SheetFooter.jsx
│   │   📄 src/routes/(sheet)/footer/SheetFooter.jsx
│   │   └─ Imports: Menu, AuthButton, sheetFooter.module
│   ├── AuthButton.jsx
│   │   📄 src/routes/(sheet)/footer/auth-button/AuthButton.jsx
│   │   └─ Imports: solid-js, @solidjs/router, useAuth, authButton.module
│   ├── Menu.jsx
│   │   📄 src/routes/(sheet)/footer/menu/Menu.jsx
│   │   └─ Imports: solid-js, @solidjs/router, menu.module
│   ├── ProfileActions.jsx
│   │   📄 src/routes/(sheet)/home/ProfileActions.jsx
│   │   └─ Imports: solid-js, useProfileActions, LoadingButton, home.module
│   ├── SelectedProfileCard.jsx
│   │   📄 src/routes/(sheet)/home/SelectedProfileCard.jsx
│   │   └─ Imports: home.module
│   ├── StoryButton.jsx
│   │   📄 src/routes/(sheet)/home/StoryButton.jsx
│   │   └─ Imports: @solidjs/router, authStore, StoryButton.module
│   ├── BalanceWarning.jsx
│   │   📄 src/routes/(sheet)/home/dynamicIsland/components/BalanceWarning.jsx
│   │   └─ Imports: solid-js, proximityStore, island.module
│   ├── constants.js
│   │   📄 src/routes/(sheet)/home/dynamicIsland/constants.js
│   ├── index.jsx
│   │   📄 src/routes/(sheet)/home/dynamicIsland/index.jsx
│   │   └─ Imports: solid-js, islandStore, notificationStore, proximityHitsStore...
│   ├── CompactMode.jsx
│   │   📄 src/routes/(sheet)/home/dynamicIsland/modes/CompactMode.jsx
│   │   └─ Imports: authStore, island.module
│   ├── NotificationMode.jsx
│   │   📄 src/routes/(sheet)/home/dynamicIsland/modes/NotificationMode.jsx
│   │   └─ Imports: solid-js, island.module
│   ├── ProximityMode.jsx
│   │   📄 src/routes/(sheet)/home/dynamicIsland/modes/ProximityMode.jsx
│   │   └─ Imports: ProximityList, island.module
│   ├── islandStore.ts
│   │   📄 src/routes/(sheet)/home/dynamicIsland/store/islandStore.ts
│   │   └─ Imports: solid-js/store, types
│   ├── types.ts
│   │   📄 src/routes/(sheet)/home/dynamicIsland/types.ts
│   ├── index.jsx
│   │   📄 src/routes/(sheet)/home/following/index.jsx
│   │   └─ Imports: solid-js, @solidjs/router, followingStore, routes.module...
│   ├── viewing-profile.jsx
│   │   📄 src/routes/(sheet)/home/following/viewing-profile.jsx
│   │   └─ Imports: @solidjs/router, solid-js, SelectedProfileCard, ProfileActions...
│   ├── index.jsx
│   │   📄 src/routes/(sheet)/home/index.jsx
│   │   └─ Imports: solid-js, @solidjs/router, selectedProfileStore, proximityStore...
│   ├── conversation.jsx
│   │   📄 src/routes/(sheet)/home/messages/conversation.jsx
│   │   └─ Imports: solid-js, @solidjs/router, authStore, routes.module...
│   ├── index.jsx
│   │   📄 src/routes/(sheet)/home/messages/index.jsx
│   │   └─ Imports: solid-js, @solidjs/router, messagesStore, proximityStore...
│   ├── viewing-profile.jsx
│   │   📄 src/routes/(sheet)/home/messages/viewing-profile.jsx
│   │   └─ Imports: @solidjs/router, solid-js, SelectedProfileCard, ProfileActions...
│   ├── index.jsx
│   │   📄 src/routes/(sheet)/home/my-story/index.jsx
│   │   └─ Imports: solid-js, @solidjs/router, dynamicIsland, routes.module...
│   ├── my-profile.jsx
│   │   📄 src/routes/(sheet)/my-profile.jsx
│   │   └─ Imports: profileStore, ProfileHeader, ProfileStats, Card...
│   ├── settings.jsx
│   │   📄 src/routes/(sheet)/settings.jsx
│   │   └─ Imports: settingsStore, SettingsSection, ThemeToggle, routes.module
│   ├── index.jsx
│   │   📄 src/routes/(sheet)/welcome-page/index.jsx
│   │   └─ Imports: solid-js, @solidjs/router, authStore, welcome-page.module
│   └── _layout.jsx
│       📄 src/routes/_layout.jsx
│       └─ Imports: solid-js, authStore, ProximityMap, BalanceWarning...

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔗 DEPENDENCY INSIGHTS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

⚠️  HOT SPOTS (High Coupling):
  1. authStore.ts → 9 imports
     Consider: Splitting into smaller modules

  2. proximityStore.ts → 8 imports
     Consider: Splitting into smaller modules

  3. mockData.js → 7 imports
     Consider: Splitting into smaller modules

  4. useAuth.ts → 4 imports
  5. activityStore.ts → 3 imports

⚠️  CROSS-FEATURE DEPENDENCIES (7):
  auth/ → loading/ (ProtectedRoute.jsx imports LoadingSpinner.jsx)
  following/ → proximity/ (followingStore.ts imports proximityStore.ts)
  messages/ → notifications/ (messagesStore.ts imports activityStore.ts)
  messages/ → auth/ (messagesStore.ts imports authStore.ts)
  proximity/ → notifications/ (useProfileActions.ts imports useNotifications.ts)
  proximity/ → loading/ (useProfileActions.ts imports useLoading.ts)
  proximity/ → errors/ (useProfileActions.ts imports errors)

✅ WELL-ISOLATED FEATURES:
  - errors/ (no external feature dependencies)
  - loading/ (no external feature dependencies)
  - notifications/ (no external feature dependencies)
  - profile/ (no external feature dependencies)
  - settings/ (no external feature dependencies)
  - test/ (no external feature dependencies)

📊 FEATURE SIZE:
  proximity            20 files (21%) ████
  auth                  9 files (10%) ██
  loading               5 files (5%) █
  notifications         5 files (5%) █
  profile               4 files (4%) 
  errors                3 files (3%) 
  settings              3 files (3%) 
  following             1 files (1%) 
  messages              1 files (1%) 
  test                  1 files (1%) 

=== Analysis complete ===

