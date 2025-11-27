# PROXIMA - Hyperlocal Proximity Profiles

A real-time proximity-based profile viewer with interactive reactions built with SolidJS and Vite.

## 🎯 Overview

PROXIMA shows people who are "live online" within a 50ft radius. Users can interact with nearby profiles through two engagement mechanisms:
- **Pulse ($3.00)**: Instant reaction with floating hearts animation
- **Tease (variable)**: Hold-to-send mechanic starting at $1.00, increases by $0.01 every 100ms

## 🚀 Tech Stack

- **Framework**: SolidJS (fine-grained reactivity, no virtual DOM)
- **Build Tool**: Vite
- **Styling**: Pure CSS with GPU-accelerated animations
- **Language**: JavaScript (ES6+)

## 📁 Project Structure
```
proximity-profiles-solid/
├── src/
│   ├── App.jsx           # Main app component with profiles
│   ├── App.css           # All styles and animations
│   ├── index.css         # Empty (kept for structure)
│   └── main.jsx          # Entry point
├── public/               # Static assets
├── index.html            # HTML template
├── vite.config.js        # Vite configuration
└── package.json          # Dependencies
```

## 🎨 Features

### Profile Display
- 8 profiles positioned in a circular pattern
- All profiles are 50px × 50px (uniform size)
- Blurred by default (3px blur), sharp on hover
- Scale to 2x on hover with smooth transitions
- GPU-accelerated animations for performance

### Pulse Button
- **Cost**: Fixed $3.00
- **Action**: Click to send
- **Animation**: 3 hearts shoot up with random horizontal drift
- **Feedback**: Green "sent ❤️ pulse $3.00" message

### Tease Button
- **Cost**: Variable (starts at $1.00)
- **Action**: Hold for 0.5 seconds to activate
- **Increment**: +$0.01 every 100ms while holding
- **Animation**: Button turns purple and pulses
- **Feedback**: Shows current amount while holding, green "sent 😏 tease $X.XX" on release

### Animations
- **Floating Hearts**: Facebook Live-style reaction animation
  - 3-second duration
  - Ease-out timing
  - Random drift (-50px to +50px)
  - Scale from 0.5 → 1 → 0.8
  - Opacity fade from 1 → 0

- **Profile Hover**: 
  - 0.4s transition
  - Cubic-bezier easing for natural feel
  - Blur removal
  - Border-radius change (circle → rounded square)

## 🛠️ Setup & Installation

### Prerequisites
- Node.js 18+ 
- npm or yarn
- WSL2 (if on Windows)

### Installation
```bash
# Clone the repository
git clone https://github.com/maddi115/proximity-profiles-solid.git
cd proximity-profiles-solid

# Install dependencies
npm install

# Run development server
npm run dev -- --host 0.0.0.0
```

### WSL2 Users
If running on WSL2, you need to expose the server:
```bash
npm run dev -- --host 0.0.0.0
```

Then access via:
- Windows browser: `http://localhost:5173` or `http://YOUR_WSL_IP:5173`
- Get WSL IP: `hostname -I`

### Build for Production
```bash
npm run build
npm run preview
```

## 🎮 Usage

1. **Hover** over any profile circle to reveal interaction buttons
2. **Click "pulse $"** to send an instant $3.00 reaction with hearts
3. **Hold "tease"** for 0.5+ seconds to activate variable payment
4. Watch the amount increase while holding
5. Release to send the teased amount

## 🧠 Key Technical Decisions

### Why SolidJS?
- **Performance**: No virtual DOM, fine-grained reactivity
- **Size**: ~7KB vs React's 40KB+
- **Speed**: 2-3x faster than React for UI updates
- **Perfect for animations**: Direct DOM updates without diffing

### Why Vite?
- Instant HMR (Hot Module Replacement)
- Native ES modules
- Optimized production builds
- Better DX than webpack

### Animation Strategy
- Used `transform` instead of `width/height` (GPU-accelerated)
- `will-change` hints for browser optimization
- `backface-visibility: hidden` for smoother transforms
- CSS variables for dynamic values (drift)

### State Management
- Component-local `createSignal` for each profile
- No global state needed (each profile is independent)
- Event handlers attached in `onMount` for tease button
- Direct DOM manipulation for floating hearts (performance)

## 🐛 Known Issues & Solutions

### Issue: "localhost refused to connect" on WSL2
**Solution**: Use `--host 0.0.0.0` flag and access via WSL IP

### Issue: Tease button not activating
**Solution**: Must hold for 500ms - this is intentional to prevent accidental clicks

### Issue: Hearts not appearing
**Solution**: Check browser console - likely z-index or animation conflict

## 📝 Code Style

- **Minified CSS** in production (single line)
- **Short variable names** (P, C, H, m, i, a) for optimized builds
- **Terry Davis philosophy**: Direct, efficient, no abstractions
- **No unnecessary dependencies**: Pure SolidJS + Vite

## 🔮 Future Enhancements

- [ ] Real-time backend integration
- [ ] Actual geolocation/proximity detection
- [ ] User authentication
- [ ] Payment processing integration
- [ ] Profile details modal
- [ ] Custom reaction types
- [ ] Sound effects
- [ ] Haptic feedback (mobile)
- [ ] Activity history
- [ ] Notification system

## 📄 License

MIT

## 👨‍💻 Development Notes for AI Assistants

### Critical Context
- This is a **proximity-based social interaction** app
- The "50ft radius" is currently simulated with fixed positions
- All monetary values are cosmetic (no real payment processing)
- Optimized for performance - avoid adding heavy dependencies

### When Modifying
- **DO NOT** break the 500ms hold delay on tease button
- **DO NOT** remove GPU acceleration hints
- **MAINTAIN** the blur/focus effect - it prevents user overwhelm
- **KEEP** animation durations as-is (tested for feel)
- **PRESERVE** the hover-to-reveal interaction pattern

### Testing Checklist
- [ ] Profile images load properly
- [ ] Hover reveals buttons smoothly
- [ ] Pulse sends hearts animation
- [ ] Tease requires 500ms hold
- [ ] Tease counter increments correctly
- [ ] Sent messages appear and disappear
- [ ] No console errors
- [ ] Works on mobile (touch events)
- [ ] WSL2 accessible with --host flag

### Performance Targets
- First Contentful Paint: < 1s
- Time to Interactive: < 2s
- Animation FPS: 60fps
- Bundle size: < 50KB gzipped

---

Built with ❤️ for hyperlocal connections
