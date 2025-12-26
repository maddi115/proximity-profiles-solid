# Super Close Feature - Archived

**Archived Date:** December 20, 2025

## What It Was
The Super Close feature showed a history page of people the user had been in very close proximity to. Users could:
- View proximity history with timestamps
- Send "Wave & Pass By" to people
- Take photos to send while passing by
- Use action buttons (Pulse, Reveal, Slap, Follow) on each person

## Why Archived
Feature archived to focus on core proximity and notification functionality in Dynamic Island.

## What Was Removed
- `/home/super-close` route and page
- Camera photo upload feature
- Proximity history list UI
- Navigation from Dynamic Island compact mode click

## Files Archived
- `super-close-route/index.jsx` - Main page component
- `super-close-route/super-close.module.css` - Styles
- See `removed-code-snippets.md` for removed navigation code

## Dependencies Still Active
- `proximityHitsStore` - Still used by Dynamic Island
- `useProximityTracking` - Still used by Dynamic Island
- Dynamic Island modes (Compact, Notification, Proximity)

## To Restore
1. Move `super-close-route/` back to `src/routes/(sheet)/home/`
2. Add route to `App.jsx`
3. Add navigation handler to `DynamicIsland/index.jsx`
4. Update `home/index.jsx` isOnSubPage check
