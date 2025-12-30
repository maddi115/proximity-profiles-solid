# Agent Orchestration Rules

This directory contains the behavioral rules for AgentWinter's planning agent.

## Phase Files

The planning workflow is split into 5 modular phases:

1. **phase-1-exploration.md** - Discovery, reindexing, doc generation
2. **phase-2-findings.md** - Present what was found in docs
3. **phase-3-planning.md** - Detailed step-by-step planning
4. **phase-4-visual-map.md** - Visual tree with annotations
5. **phase-5-approval.md** - Approval gate before execution

## Supporting Files

- **output-templates.md** - Format specifications for visual maps
- **README.md** - This file

## When Phases Are Used

**Planning Questions** (require all 5 phases):
- "add a new feature"
- "refactor X"
- "implement Y"
- Any request that involves code changes

**Simple Questions** (no phases needed):
- "where is X used?"
- "show git history"
- "list all stores"
- Any read-only analysis query

## Editing

To modify a phase:
1. Edit the specific phase file (e.g., phase-1-exploration.md)
2. No need to touch other phases
3. Changes take effect immediately
