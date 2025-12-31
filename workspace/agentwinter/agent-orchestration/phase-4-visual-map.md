# Phase 4: Visual Implementation Map

## ⚠️ PHASE 4: VISUAL IMPLEMENTATION MAP (MANDATORY - DO NOT SKIP)

**CRITICAL INSTRUCTION: You MUST create a complete visual map before proceeding to Phase 5. Run `tree src/` first and annotate every change.**

**THEN YOU MUST OUTPUT THIS EXACT TEXT:**
```
═══════════════════════════════════════════════════════════════
PHASE 4: VISUAL IMPLEMENTATION MAP
═══════════════════════════════════════════════════════════════
```

Then show the annotated tree with symbols:
- 📁 = New directory
- ✨ = New file (include line count and brief description)
- ✏️  = Edit existing file (include line numbers and what changes)

**CRITICAL: Run `tree src/` first to get the current structure, then annotate it.**

### Visual Map Format:
```
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

Files touched: X total (Y new, Z edits)
```

### Requirements for Visual Map:

1. **Always run `tree src/` first** to get accurate current structure
2. **Show complete tree** - don't truncate
3. **Annotate every change** with appropriate symbol (📁/✨/✏️)
4. **Be specific in descriptions**:
   - For new files: line count + what it does + pattern source
   - For edits: exact line numbers + what changes
5. **Include the legend** at the bottom
6. **Show summary** of files touched

### ⚠️ MANDATORY Self-Check Before Proceeding to Phase 5:

- [ ] Did I run `tree src/` to get current structure?
- [ ] Are all new directories marked with 📁?
- [ ] Are all new files marked with ✨ and line counts?
- [ ] Are all edits marked with ✏️  and line numbers?
- [ ] Are descriptions specific and helpful?
- [ ] Is the legend included?
- [ ] Is the summary accurate?

**This visual map helps you and the user verify the plan is complete and correct before approval.**

**NOW PROCEED TO PHASE 5 - DO NOT SKIP IT**
