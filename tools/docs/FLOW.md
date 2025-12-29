# FLOW CHEAT SHEET

Legend:
- Names with `()` are functions or components.
- `<object>.method()` = methods on an exported store/actions object.
- `→` means "calls" or "depends on".
- Sections group files by feature/domain.
- This doc is a *code flow map*, not a full data model.

## Boot & Routing Flow

### src/routes/_layout.jsx
MainLayout()
  → onMount()

### src/routes/(sheet)/_layout.jsx
SheetLayout()
  → useLocation()
  → showFooter()
showFooter()
  → path.includes()

### src/routes/(sheet)/activity.jsx
ActivityHistory()
  → activities()
formatTime()
getActionEmoji()
getActionText()
getCostDisplay()
  → activity.cost.toFixed()
getProfile()
  → getProfileIdAsNumber()
  → proximityStore.profiles.find()
  → profiles.find()

### src/routes/(sheet)/auth/login.jsx
LoginPage()

### src/routes/(sheet)/dashboard.jsx
Dashboard()

### src/routes/(sheet)/footer/auth-button/AuthButton.jsx
AuthButton()
  → useAuth()
  → useNavigate()
  → createMemo()
  → auth.isLoading()
  → auth.isAuthenticated()
  → label()
handleClick()
  → auth.isLoading()
  → auth.isAuthenticated()
  → auth.signOut()
  → navigate()

### src/routes/(sheet)/footer/menu/Menu.jsx
handleMenuClick()
  → setIsOpen()
  → navigate()
handleMouseEnter()
  → setIsOpen()
handleMouseLeave()
  → setIsOpen()
Menu()
  → createSignal()
  → useNavigate()
  → useLocation()
  → isOpen()

### src/routes/(sheet)/footer/SheetFooter.jsx
SheetFooter()

### src/routes/(sheet)/home/dynamicIsland/components/BalanceWarning.jsx
BalanceWarning()
  → isLowBalance()
  → store.balance.toFixed()

### src/routes/(sheet)/home/dynamicIsland/index.jsx
DynamicIsland()
  → useProximityTracking()
  → createEffect()
  → nearbyCount()
  → queueCount()

### src/routes/(sheet)/home/dynamicIsland/modes/CompactMode.jsx
CompactMode()
  → myAvatar()

### src/routes/(sheet)/home/dynamicIsland/modes/NotificationMode.jsx
NotificationMode()

### src/routes/(sheet)/home/dynamicIsland/modes/ProximityMode.jsx
ProximityMode()

### src/routes/(sheet)/home/dynamicIsland/store/islandStore.ts
// STORE (stateful, writes via setStore)

<object>.collapse()
  → setStore()
<object>.expand()
  → setStore()
<object>.returnFromNotification()
  → setStore()
<object>.showNotification()
  → setStore()

### src/routes/(sheet)/home/following/index.jsx
Following()
  → useNavigate()
  → createMemo()
  → followingProfiles()
handleProfileClick()
  → navigate()

### src/routes/(sheet)/home/following/viewing-profile.jsx
ViewingProfile()
  → useLocation()
  → useNavigate()
  → profile()

### src/routes/(sheet)/home/index.jsx
Home()
  → useNavigate()
  → useLocation()
  → createMemo()
  → profile()
isOnSubPage()
  → location.pathname.includes()

### src/routes/(sheet)/home/messages/conversation.jsx
Conversation()
  → useNavigate()
  → useLocation()
  → profile()
  → conversation()
formatTime()
handleMessageClick()
  → navigate()
  → profile()
myAvatar()
  → currentUser()

### src/routes/(sheet)/home/messages/index.jsx
formatTime()
getProfile()
  → parseInt()
  → proximityStore.profiles.find()
  → profiles.find()
handleConversationClick()
  → getProfile()
  → navigate()
Messages()
  → useNavigate()
  → createMemo()
  → conversations()
myAvatar()
  → currentUser()

### src/routes/(sheet)/home/messages/viewing-profile.jsx
getActionText()
  → message()
ViewingProfile()
  → useLocation()
  → useNavigate()
  → profile()

### src/routes/(sheet)/home/my-story/index.jsx
handleCameraClick()
  → cameraInputRef.click()
handleFileSelect()  // DEV LOGGING
  → setSelectedFile()
handleImageClick()
  → imageInputRef.click()
MyStory()
  → useNavigate()
  → createSignal()
  → selectedFile()

### src/routes/(sheet)/home/ProfileActions.jsx
handleButtonClick()
  → e.preventDefault()
  → profileActions()
  → actions.handlePulse()
  → actions.handleReveal()
  → actions.handleSlap()
  → actions.handleFollow()
ProfileActions()
  → createMemo()
  → profileActions()

### src/routes/(sheet)/home/SelectedProfileCard.jsx
SelectedProfileCard()

### src/routes/(sheet)/home/StoryButton.jsx
StoryButton()
  → useNavigate()
  → myAvatar()

### src/routes/(sheet)/my-profile.jsx
UserProfile()
  → profileStore.user.joinedDate.toLocaleDateString()

### src/routes/(sheet)/settings.jsx
handleLogout()  // DEV LOGGING
Settings()

### src/routes/(sheet)/welcome-page/index.jsx
handleEnter()
  → navigate()
WelcomePage()
  → useNavigate()
  → onMount()

## Proximity Flow

### src/features/proximity/components/AppleWatchGrid.jsx
AppleWatchGrid()
  → createSignal()
  → useCulling()
  → useSnapback()
  → useProfileClick()
  → createEffect()
  → onMount()
draw()
  → cullingBox()
  → offset()
  → culling.centeredProfile()
  → culling.sortedVisibleCircles()
  → sorted.forEach()
  → culling.visibleCircles()
  → circles()
handleClick()
  → clickHandler.detectClickedProfile()
  → culling.visibleCircles()
  → offset()
  → cullingBox()
  → dragStart()
handleMouseDown()
  → setIsDragging()
  → setDragStart()
  → setDragInitialOffset()
  → offset()
  → snapback.stopSnapback()
handleMouseMove()
  → isDragging()
  → dragStart()
  → dragInitialOffset()
  → setOffset()
handleMouseUp()
  → setIsDragging()
handleResize()
  → cullingBox()
  → setCullingBox()
  → initCircles()
handleTouchEnd()
  → setIsDragging()
handleTouchMove()
  → isDragging()
  → e.preventDefault()
  → dragStart()
  → dragInitialOffset()
  → setOffset()
handleTouchStart()
  → setIsDragging()
  → setDragStart()
  → setDragInitialOffset()
  → offset()
  → snapback.stopSnapback()
initCircles()
  → generateHoneycombPositions()
  → profiles.map()
  → setCircles()
  → getGridBounds()
  → cullingBox()
  → setCenterOffset()
  → setOffset()

### src/features/proximity/components/BlurredBackground.jsx
BlurredBackground()
  → onMount()
  → createEffect()
  → onCleanup()
  → scale()
drawBlurredImage()
  → canvasRef.getContext()
  → blurAmount()

### src/features/proximity/components/canvas/useCulling.js
getDistance()
  → cullingBox()
  → offset()
isInCullingBox()
  → cullingBox()
  → offset()
  → getDistance()
useCulling()
  → createMemo()

### src/features/proximity/components/canvas/useSnapback.js
animate()
  → setSnapProgress()
  → setIsSnapping()
currentOffset()
  → isSnapping()
  → snapProgress()
  → easeOutBack()
  → snapStart()
  → snapTarget()
easeOutBack()
startSnapback()
  → setSnapStart()
  → setSnapTarget()
  → setSnapProgress()
  → setIsSnapping()
stopSnapback()
  → setIsSnapping()
useSnapback()
  → createSignal()
  → onCleanup()

### src/features/proximity/components/interactions/useProfileClick.js
detectClickedProfile()
  → overlayRef.getBoundingClientRect()
  → getDistance()
useProfileClick()

### src/features/proximity/components/layout/honeycombLayout.js
generateHoneycombPositions()
  → positions.push()
getGridBounds()
  → positions.forEach()

### src/features/proximity/components/ProximityList.jsx
ProximityList()

### src/features/proximity/components/reallyclosetome-futurefeature.jsx
DynamicIsland()

### src/features/proximity/hooks/useProfileActions.ts
getProfile()
  → store.profiles.find()
  → profiles.find()
handleFollow()  // DEV LOGGING
  → e.preventDefault()
  → setIsFollowing()
  → withLoading()
  → handleError()
handlePulse()  // DEV LOGGING
  → e.preventDefault()
  → setIsPulsing()
  → withLoading()
  → handleError()
handleReveal()  // DEV LOGGING
  → e.preventDefault()
  → setIsRevealing()
  → withLoading()
  → handleError()
handleSlap()  // DEV LOGGING
  → e.preventDefault()
  → setIsSlapping()
  → withLoading()
  → handleError()
useProfileActions()
  → createSignal()
  → useNotifications()
  → useLoading()
  → onCleanup()

### src/features/proximity/hooks/useProfileSelection.ts
selectProfile()
  → setSelectedProfile()
selectProfileById()
  → allProfiles.find()
  → setSelectedProfile()
useProfileSelection()
  → createSignal()
  → createMemo()

### src/features/proximity/hooks/useProximityTracking.ts
handleVisibilityChange()  // DEV LOGGING
simulateProximity()  // MOCK / SIMULATION
  → mockProfiles.forEach()
useProximityTracking()
  → onMount()

### src/features/proximity/mockData.js
// MOCK / SIMULATION

generateCircleLayout()  // MOCK / SIMULATION
  → positions.push()

### src/features/proximity/ProximityMap.jsx
handleCenterProfileChange()  // DEV LOGGING
  → selectedProfileActions.selectProfileById()
handleProfileClick()  // DEV LOGGING
  → selectedProfileActions.selectProfile()
ProximityMap()
  → onMount()

### src/features/proximity/store/proximityHitsStore.ts
// STORE (stateful, writes via setStore)

<object>.addToHistory()
  → store.history.findIndex()
  → setStore()
<object>.clearCurrent()
  → setStore()
<object>.clearHistory()
  → setStore()
<object>.removeFromCurrent()
  → setStore()
  → store.currentHits.filter()
<object>.updateProximity()
  → store.currentHits.findIndex()
  → setStore()
  → <?>.addToHistory()

### src/features/proximity/store/proximityStore.ts
// STORE (stateful, writes via setStore)

<object>.initializeProfiles()
  → setStore()
  → profiles.map()
<object>.sendAction()
  → setStore()
<object>.toggleFollow()
  → setStore()

### src/features/proximity/store/selectedProfileStore.ts
// STORE (stateful, writes via setStore)

<object>.selectProfile()  // DEV LOGGING
  → setSelectedProfile()
<object>.selectProfileById()
  → profiles.find()
  → setSelectedProfile()

### src/features/proximity/utils.js
calculateDistance()
  → parseCoord()
createHeart()
  → animate.finished.then()
  → animate()
parseCoord()
  → parseFloat()
  → coord.replace()

### src/features/proximity/utils/extractDominantColor.js

## Notification Flow

### src/features/notifications/components/NotificationView.jsx
NotificationView()

### src/features/notifications/hooks/useNotifications.ts
useNotifications()
  → notificationActions.showNotification.bind()
  → notificationActions.dismissCurrent.bind()
  → notificationActions.clearQueue.bind()

### src/features/notifications/store/activityStore.ts
// STORE (stateful, writes via setStore)

<object>.addActivity()  // DEV LOGGING
  → Date.now.toString()
  → Date.now()
  → ActivitySchema.parse()
  → <?>.slice()
  → setStore()
<object>.clearActivities()
  → setStore()

### src/features/notifications/store/notificationStore.ts
// STORE (stateful, writes via setStore)

<object>._displayNotification()
  → clearDismissTimeout()
<object>.cleanup()
  → clearDismissTimeout()
  → <?>.clearQueue()
<object>.clearQueue()
  → clearDismissTimeout()
  → setStore()
<object>.dismissCurrent()
  → clearDismissTimeout()
  → setStore()
<object>.showNotification()  // DEV LOGGING
  → Date.now.toString()
  → Date.now()
  → newQueue.shift()
  → setStore()
  → <?>._displayNotification()
clearDismissTimeout()

## Profile Flow

### src/features/profile/components/Card.jsx
Card()

### src/features/profile/components/ProfileHeader.jsx
handleCancel()
  → setEditName()
  → setEditBio()
  → profileActions.setEditing()
handleSave()
  → profileActions.updateName()
  → editName()
  → profileActions.updateBio()
  → editBio()
  → profileActions.setEditing()
ProfileHeader()
  → createSignal()
  → editName()
  → editBio()

### src/features/profile/components/ProfileStats.jsx
ProfileStats()
  → profileStore.user.balance.toFixed()

### src/features/profile/store/profileStore.ts
// STORE (stateful, writes via setStore)

<object>.incrementStat()
  → setStore()
<object>.setEditing()
  → setStore()
<object>.updateAvatar()
  → setStore()
<object>.updateBio()
  → setStore()
<object>.updateName()
  → setStore()
<object>.updateProfile()  // DEV LOGGING
  → setStore()

## Settings Flow

### src/features/settings/components/SettingsSection.jsx
SettingsSection()

### src/features/settings/components/ThemeToggle.jsx
ThemeToggle()
toggleTheme()
  → settingsActions.setTheme()

### src/features/settings/store/settingsStore.ts
// STORE (stateful, writes via setStore)

<object>.setTheme()  // DEV LOGGING
  → setStore()
<object>.toggleNotification()
  → setStore()
<object>.togglePrivacy()
  → setStore()
<object>.updateEmail()
  → setStore()

## Loading Flow

### src/features/loading/components/LoadingButton.jsx
handleClick()
  → isDisabled()
  → e.preventDefault()
LoadingButton()
  → isDisabled()

### src/features/loading/components/LoadingSpinner.jsx
LoadingSpinner()

### src/features/loading/hooks/useLoading.ts
isLoading()
  → loadingActions.isLoading()
startLoading()
  → activeOperations.add()
  → loadingActions.startLoading()
stopLoading()
  → activeOperations.delete()
  → loadingActions.stopLoading()
useLoading()
  → onCleanup()
withLoading()
  → startLoading()
  → asyncFn()
  → stopLoading()

### src/features/loading/store/loadingStore.ts
// STORE (stateful, writes via setStore)

<object>.clearAll()
  → setStore()
<object>.getAllLoading()
  → Object.keys.filter()
  → Object.keys()
<object>.startLoading()  // DEV LOGGING
  → setStore()
<object>.stopLoading()  // DEV LOGGING
  → setStore()

## Utils & Infra Flow

### src/features/auth/utils/supabaseClient.js
createMockClient()  // DEV LOGGING

### src/features/errors/types.js
<class>.constructor()
  → <?>()

### src/features/errors/utils/errorHandler.js
<object>._inferErrorCode()
  → msg.includes()
<object>._logError()  // DEV LOGGING
<object>._normalizeError()
  → <?>._inferErrorCode()
<object>._showErrorNotification()
  → <?>.then()
  → <?>()
<object>.handle()
  → <?>._normalizeError()
  → <?>._logError()
  → <?>._showErrorNotification()
  → onError()
handleError()
  → errorHandler.handle()

### src/utils/memoryMonitor.js
logMemory()  // DEV LOGGING

## Misc Flow

### src/app/App.jsx
App()
  → onMount()

### src/features/auth/components/LoginForm.jsx
handleGoogle()
  → auth.clearError()
  → auth.signInWithOAuth()
LoginForm()
  → useAuth()
  → auth.error()

### src/features/auth/components/LoginModal.jsx
LoginModal()

### src/features/auth/components/ProtectedRoute.jsx
ProtectedRoute()
  → useAuth()
  → createMemo()
  → isReady()
  → isAuthed()

### src/features/auth/components/SignupForm.jsx
handleSubmit()
  → e.preventDefault()
  → setIsLoading()
  → auth.clearError()
  → auth.signUp()
  → email()
  → password()
  → username()
  → navigate()
SignupForm()
  → useNavigate()
  → useAuth()
  → createSignal()
  → username()
  → email()
  → password()
  → auth.error()
  → isLoading()

### src/features/auth/hooks/useAuth.ts
useAuth()
  → authActions.signUp.bind()
  → authActions.signIn.bind()
  → authActions.signOut.bind()
  → authActions.signInWithOAuth.bind()
  → authActions.resetPassword.bind()
  → authActions.updateProfile.bind()
  → authActions.clearError.bind()

### src/features/auth/store/authStore.ts
// STORE (stateful, writes via setStore)

<object>._syncProfile()
  → <?>()
  → profileActions.updateProfile()
<object>.clearError()
  → setStore()
<object>.initialize()  // DEV LOGGING
  → setStore()
  → supabase.auth.getSession()
  → <?>._syncProfile()
<object>.resetPassword()  // DEV LOGGING
  → setStore()
  → supabase.auth.resetPasswordForEmail()
<object>.setupAuthListener()
  → supabase.auth.onAuthStateChange()
<object>.signIn()  // DEV LOGGING
  → setStore()
  → supabase.auth.signInWithPassword()
  → <?>._syncProfile()
<object>.signInWithOAuth()  // DEV LOGGING
  → supabase.auth.signInWithOAuth()
  → setStore()
<object>.signOut()  // DEV LOGGING
  → setStore()
  → supabase.auth.signOut()
<object>.signUp()  // DEV LOGGING
  → setStore()
  → supabase.auth.signUp()
<object>.updateProfile()  // DEV LOGGING
  → supabase.auth.updateUser()
  → setStore()

### src/features/following/store/followingStore.ts
// STORE (stateful, writes via setStore)

<object>.getFollowingCount()
  → proximityStore.profiles.filter()
<object>.getFollowingProfiles()
  → proximityStore.profiles.filter.map()
  → proximityStore.profiles.filter()

### src/features/messages/store/messagesStore.ts
// STORE (stateful, writes via setStore)

<object>.getAllMessages()
  → activityStore.activities.map()
<object>.getConversationWith()
  → <?>.getAllMessages.filter.sort()
  → <?>.getAllMessages.filter()
  → <?>.getAllMessages()
<object>.getGroupedConversations()
  → <?>.getAllMessages()
  → messages.forEach()
  → Array.from.map.sort()
  → Array.from.map()
  → Array.from()
  → grouped.entries()

### src/features/test/store/testStore.ts
// STORE (stateful, writes via setStore)

doSomething()  // DEV LOGGING
  → testValue()
newFunction()  // DEV LOGGING

### src/types/activity.ts
createActivity()
  → Date.now.toString()
  → Date.now()
  → String()
  → ActivitySchema.parse()
getProfileIdAsNumber()
  → parseInt()

### src/types/profile.ts
validateProfile()
  → ProfileSchema.parse()
validateProfiles()
  → data.map()

