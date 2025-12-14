# FLOW CHEAT SHEET

Legend:
- Names with `()` are functions or components.
- `<object>.method()` = methods on an exported store/actions object.
- `→` means "calls" or "depends on".
- Sections group files by feature/domain.
- This doc is a *code flow map*, not a full data model.

## Boot & Routing Flow

### src/App.jsx
App()

### src/layouts/DashboardLayout.jsx
DashboardLayout()

### src/layouts/MainLayout.jsx
MainLayout()

### src/layouts/SheetLayout.jsx
SheetLayout()

### src/main.jsx
mainEntry()
  → render()
  → App()

### src/routes/ActivityHistory.jsx
ActivityHistory()
  → activities()
formatTime()
getCostDisplay()
getProfile()
  → store.profiles.find()
  → profiles.find()

### src/routes/Dashboard.jsx
Dashboard()

### src/routes/index.jsx
Home()

### src/routes/Settings.jsx
handleLogout()  // DEV LOGGING
Settings()

### src/routes/UserProfile.jsx
formatTime()
recentActivities()
  → activityStore.activities.slice()
toggleEdit()
  → profileActions.setEditing()
UserProfile()
  → recentActivities()
  → recentActivities.map()
  → profileStore.user.joinedDate.toLocaleDateString()

## Dynamic Island Flow

### src/features/dynamicIsland/components/BalanceWarning.jsx
BalanceWarning()
  → isLowBalance()
  → balance.toFixed()
  → balance()
isLowBalance()
  → balance()

### src/features/dynamicIsland/components/DynamicIsland.jsx
DynamicIsland()
  → useProximityTracking()
  → createEffect()
  → nearbyCount()
  → queueCount()

### src/features/dynamicIsland/components/modes/CompactMode.jsx
CompactMode()

### src/features/dynamicIsland/components/modes/NotificationMode.jsx
NotificationMode()

### src/features/dynamicIsland/components/modes/ProximityMode.jsx
ProximityMode()

### src/features/dynamicIsland/store/islandStore.js
// STORE (stateful, writes via setStore)

<object>.collapse()
  → setStore()
<object>.expand()
  → setStore()
<object>.returnFromNotification()
  → setStore()
<object>.showNotification()
  → setStore()

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

### src/features/proximity/components/ProfileSheet.jsx
handleButtonClick()
  → e.preventDefault()
  → e.stopPropagation()
  → profileActions()
  → actions.handlePulse()
  → actions.handleReveal()
  → actions.handleSlap()
  → actions.handleFollow()
ProfileSheet()
  → createSignal()
  → createMemo()
  → createEffect()

### src/features/proximity/components/ProximityList.jsx
ProximityList()
  → props.hits.map()

### src/features/proximity/components/reallyclosetome-futurefeature.jsx
DynamicIsland()

### src/features/proximity/hooks/useProfileActions.js
getProfile()
  → store.profiles.find()
  → profiles.find()
handleFollow()
  → withLoading()
  → handleError()
handlePulse()
  → withLoading()
  → handleError()
handleReveal()
  → withLoading()
  → handleError()
handleSlap()
  → withLoading()
  → handleError()
useProfileActions()
  → createSignal()
  → useNotifications()
  → useLoading()
  → onCleanup()

### src/features/proximity/hooks/useProfileSelection.js
selectProfile()
  → setSelectedProfile()
selectProfileById()
  → allProfiles.find()
  → setSelectedProfile()
useProfileSelection()
  → createSignal()
  → createMemo()

### src/features/proximity/hooks/useProximityTracking.js
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
ProximityMap()
  → useProfileSelection()
  → onMount()
  → selection.profileWithStoreData()

### src/features/proximity/store/proximityHitsStore.js
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

### src/features/proximity/store/proximityStore.js
// STORE (stateful, writes via setStore)

<object>.initializeProfiles()
  → setStore()
  → profiles.map()
<object>.sendAction()
  → setStore()
<object>.toggleFollow()
  → setStore()

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

### src/features/notifications/hooks/useNotifications.js
useNotifications()
  → notificationActions.showNotification.bind()
  → notificationActions.dismissCurrent.bind()
  → notificationActions.clearQueue.bind()

### src/features/notifications/store/activityStore.js
// STORE (stateful, writes via setStore)

<object>.addActivity()  // DEV LOGGING
  → Date.now.toString()
  → Date.now()
  → <?>.slice()
  → setStore()
<object>.clearActivities()
  → setStore()

### src/features/notifications/store/notificationStore.js
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

### src/features/profile/store/profileStore.js
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

### src/features/settings/store/settingsStore.js
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

### src/features/loading/hooks/useLoading.js
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

### src/features/loading/store/loadingStore.js
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

## Menu & Navigation Flow

### src/features/menu/Menu.jsx
handleMenuClick()  // DEV LOGGING
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
  → menuItems.map()

## Utils & Infra Flow

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

