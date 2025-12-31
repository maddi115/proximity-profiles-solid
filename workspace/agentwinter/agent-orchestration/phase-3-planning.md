# Phase 3: Detailed Planning

## ⚠️ PHASE 3: DETAILED PLANNING (MANDATORY - DO NOT SKIP)

**CRITICAL INSTRUCTION: You MUST complete ALL sections below in order. Do NOT skip Pre-flight Checklist, Self-Critique, or Integration Points. Do NOT jump to Phase 4. The Summary comes LAST after you complete these MANDATORY sections.**

**THEN YOU MUST OUTPUT THIS EXACT TEXT:**
```
═══════════════════════════════════════════════════════════════
PHASE 3: DETAILED PLANNING (Approach [Letter])
═══════════════════════════════════════════════════════════════
```

### Implementation Steps (Ordered by Dependencies):

For each step, provide:

**Step 1:** [Concise description of what to do]
- **File:** `src/path/to/file.ts`
- **Action:** Create new file / Modify existing file
- **Lines:** 
  - If new: `~X lines estimated`
  - If modify: `Lines Y-Z` (specific line numbers)
- **Pattern source:** Copy/adapt from `src/path/to/existing.ts:lines X-Y`
- **Specific changes:**
  - [Bullet point of exact change]
  - [Bullet point of exact change]
- **Why this step first:** [Dependency reasoning - what must exist before step 2]
- **Risk:** [What could break - be specific]
- **Mitigation:** [How to prevent/handle the risk]

**Step 2:** [Concise description of what to do]
- **File:** `src/path/to/file.ts`
- **Action:** Create new file / Modify existing file
- **Lines:**
  - If new: `~X lines estimated`
  - If modify: `Lines Y-Z`
- **Pattern source:** Copy/adapt from `src/path/to/existing.ts:lines X-Y`
- **Specific changes:**
  - [Bullet point of exact change]
  - [Bullet point of exact change]
- **Why after step 1:** [What from step 1 does this depend on]
- **Risk:** [What could break - be specific]
- **Mitigation:** [How to prevent/handle the risk]

**Step N:** [Continue for all steps...]

### ⚠️ MANDATORY PRE-FLIGHT CHECKLIST (COMPLETE THIS BEFORE SUMMARY):

Before proceeding to Summary, verify:

- [ ] **Pattern consistency:** Does this follow existing codebase patterns?
  - [Specific pattern being followed]
  
- [ ] **Dependency order:** Are steps ordered correctly so each builds on previous?
  - [Confirmation of dependency chain]

- [ ] **Impact analysis:** Have I identified all files that could be affected?
  - [List of potentially affected areas]

- [ ] **Simplicity check:** Is there a simpler approach I'm missing?
  - [Confirmation this is the simplest viable approach OR acknowledgment of simpler alternative]

- [ ] **Maintainability:** Will this be understandable in 6 months?
  - [What makes this maintainable OR what documentation is needed]

### ⚠️ MANDATORY SELF-CRITIQUE (COMPLETE THIS BEFORE SUMMARY):

**What I'm confident about:**
- [Thing 1 that is definitely correct]
- [Thing 2 that follows established patterns]
- [Thing 3 that has low risk]

**What I'm uncertain about:**
- [Potential issue or edge case I might be missing]
- [Area where the user's requirements might be unclear]
- [Technical decision that could go either way]

**What could go wrong:**
- [Specific failure scenario 1 and how we'd detect it]
- [Specific failure scenario 2 and how we'd detect it]

**If I had more time, I would:**
- [Investigation I'd do to be more certain]
- [Alternative I'd explore]

### ⚠️ MANDATORY INTEGRATION POINTS (COMPLETE THIS BEFORE SUMMARY):

**This connects to:**
- [Existing feature/store/component] at `src/path/`
- [Existing feature/store/component] at `src/path/`

**Potential conflicts:**
- [Area where this might conflict with existing code]
- [How to resolve or avoid the conflict]

**Testing considerations:**
- [What should be tested]
- [Potential edge cases]

### Summary:

**Files to create:** X files
- `src/path/file1.ts` (~Y lines)
- `src/path/file2.tsx` (~Z lines)

**Files to modify:** X files
- `src/path/existing1.ts` (lines A-B)
- `src/path/existing2.tsx` (lines C-D)

**Total scope:**
- New code: ~X lines
- Modified code: ~Y lines
- Files touched: Z total

**Complexity assessment:** Low / Medium / High
**Reasoning:** [Why this complexity level]

**Estimated effort:** Small (< 1 hour) / Medium (1-3 hours) / Large (> 3 hours)

**Breaking change risk:** Low / Medium / High
**Reasoning:** [What makes this risky or safe]

**NOW PROCEED TO PHASE 4 - DO NOT SKIP IT**
