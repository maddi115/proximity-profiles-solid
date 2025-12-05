# Proximity Profiles Feature

Apple Watch-style proximity-based profile interaction system built with SolidJS.

## 📁 Architecture
```
proximity/
├── ProximityMap.jsx              # Main container component
├── components/
│   ├── AppleWatchGrid.jsx        # Honeycomb grid with culling
│   ├── ProfileSheet.jsx          # Bottom sheet UI
│   ├── DynamicIsland.jsx         # (Future feature)
│   ├── canvas/                   # Canvas rendering logic
│   │   ├── useCulling.js        # Visibility calculations
│   │   └── useSnapback.js       # Elastic snapback animation
│   ├── interactions/             # User interactions
│   │   └── useProfileClick.js   # Click detection
│   └── layout/                   # Layout algorithms
│       └── honeycombLayout.js   # Hexagonal positioning
├── hooks/                        # Custom SolidJS hooks
│   ├── useProfileActions.js     # Action handlers (pulse, reveal, etc)
│   └── useProfileSelection.js   # Profile selection state
├── constants.js                  # Global constants
├── data.js                       # Mock profile data
├── types.js                      # JSDoc type definitions
└── utils.js                      # Utility functions
```

## 🎯 Key Features

- **Reactive Culling**: Only renders visible profiles (60fps)
- **Elastic Snapback**: Smooth animation when profiles go off-screen
- **Apple Watch UI**: Honeycomb grid with zoom effect
- **Profile Actions**: Pulse ($1), Reveal ($5), Slap (Free), Follow
- **Auto-Selection**: Sheet updates as you scroll through profiles

## 🔧 Core Technologies

- **SolidJS**: Fine-grained reactivity
- **Canvas API**: Hardware-accelerated rendering
- **Motion One**: Smooth animations
- **JSDoc**: Type hints without TypeScript

## 📝 Component Patterns

### Reactive State Management
```javascript
const [offset, setOffset] = createSignal({ x: 0, y: 0 });
```

### Computed Values
```javascript
const visibleCircles = createMemo(() => {
  return circles().filter(isInCullingBox);
});
```

### Side Effects
```javascript
createEffect(() => {
  if (visibleCircles().length === 0) {
    startSnapback();
  }
});
```

## 🎨 Customization

Edit `constants.js` to modify:
- `RADIUS`: Profile circle size
- `COLORS`: Profile background colors
- `CULLING_BOX`: Viewport dimensions
- `DURATIONS`: Animation timings

## 🧪 Testing Recommendations

1. **Unit Tests**: `honeycombLayout.js`, `useCulling.js`
2. **Integration Tests**: Profile selection flow
3. **Visual Regression**: Screenshot testing for grid layout

## 📚 Related Files

- Store: `/src/store/proximityStore.js`
- Styles: `proximity.module.css`, `appleWatch.module.css`
