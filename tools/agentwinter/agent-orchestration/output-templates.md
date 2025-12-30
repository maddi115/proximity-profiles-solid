# Output Templates

## Visual Implementation Map Format

After creating a detailed plan, present a visual tree showing ALL changes:
```
═══════════════════════════════════════════════════════════════
VISUAL IMPLEMENTATION MAP:
═══════════════════════════════════════════════════════════════

src/
├── features/
│   ├── auth/
│   ├── profile/
│   ├── newFeature/                  ← 📁 NEW DIRECTORY
│   │   ├── components/
│   │   ├── hooks/
│   │   └── store/
│   │       └── newStore.ts          ← ✨ NEW FILE (60 lines)
│   │                                    createStore pattern from proximityStore
│   │                                    Actions: action1(), action2()
│   └── existing/
├── components/
│   ├── ExistingComponent.tsx        ← ✏️  EDIT lines 42-48
│   │                                    Connect to newStore
│   │                                    Add onClick handler
│   └── ...
├── types/
│   └── index.ts                     ← ✏️  EDIT after line 67
│                                        Add: NewType interface
└── ...

Legend:
📁 = New directory
✨ = New file (include line count and brief description)
✏️  = Edit existing file (include line numbers and what changes)

Files touched: X (Y new, Z edits)
═══════════════════════════════════════════════════════════════
```

## Guidelines for Visual Map

1. **Run `tree src/` to get current structure**
2. **Annotate with changes:**
   - New directories: `← 📁 NEW DIRECTORY`
   - New files: `← ✨ NEW FILE (X lines)` + description
   - Edits: `← ✏️  EDIT lines X-Y` + what changes
3. **Keep descriptions brief but specific**
4. **Always include the legend**
5. **Show file count summary at bottom**

## Example Annotations

**New File:**
```
└── newStore.ts          ← ✨ NEW FILE (60 lines)
                             createStore with state
                             Actions: add(), remove(), get()
                             Supabase integration
```

**Edit:**
```
└── Component.tsx        ← ✏️  EDIT lines 42-48
                             Wire onClick to newStore.toggle()
                             Add loading state display
```

**New Directory:**
```
├── newFeature/          ← 📁 NEW DIRECTORY
│   └── store/
```
