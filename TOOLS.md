# Project Analysis Tools

## Static Snapshots (Fast, Free)

### analyze-project.sh
```bash
./analyze-project.sh
```

**Generates:**
- `ARCHITECTURE.md` - structure, dependencies, hot spots
- `FLOW.md` - call graphs by feature

**Use when:**
- Before commits (historical snapshots)
- Sharing context with other AIs
- Quick grep reference

## Live AI Analysis (Deep, Interactive)

### agentwinter
```bash
agentwinter
```

**Capabilities:**
- Autonomous tool orchestration
- Tree-sitter parsing + semantic search
- Anti-pattern detection
- 100% code coverage

**Use when:**
- Deep reasoning: "how does auth work?"
- Pattern detection: "find createEffect without cleanup"
- Refactoring decisions

## Typical Workflow

**Weekly/Before commits:**
```bash
./analyze-project.sh
git add ARCHITECTURE.md FLOW.md
git commit -m "docs: Architecture snapshot"
```

**Daily development:**
```bash
agentwinter
> "show me all stores"
> "where is authStore used?"
```

**AI context handoff:**
```bash
cat ARCHITECTURE.md  # Paste to ChatGPT/Claude/Grok
```
