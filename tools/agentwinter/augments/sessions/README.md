# Sessions Augment

Multi-turn conversation persistence for agentwinter using Redis.

## Overview

This augment enables agentwinter to remember conversations across multiple queries within a single CLI session. Sessions are stored in Redis with a 45-minute sliding TTL window.

## Redis Configuration

**Important: This augment uses Redis database 1, not database 0.**

### Why db=1?

- **Isolation**: Prevents conflicts with other Redis users on db=0
- **Safety**: System-wide Redis on localhost is shared by all programs
- **Namespace**: All keys prefixed with `agentwinter:session:`

### Checking Sessions

To view sessions, you must specify database 1:
```bash
# ❌ WRONG - checks db=0 (default)
redis-cli KEYS 'agentwinter:session:*'

# ✅ CORRECT - checks db=1 (where sessions are)
redis-cli -n 1 KEYS 'agentwinter:session:*'

# View a specific session
redis-cli -n 1 GET 'agentwinter:session:session-20251230-120717-983b3050'

# Check TTL (time to live)
redis-cli -n 1 TTL 'agentwinter:session:session-20251230-120717-983b3050'
```

## Architecture
```
augments/sessions/
├── README.md              # This file
├── __init__.py           # Exports session_main and utilities
├── session_config.py     # Redis client (db=1)
├── session_manager.py    # SessionManager class
├── session_query.py      # Query processing with sessions
└── session_main.py       # Main loop with session commands
```

## Features

### Session Persistence
- **45-minute TTL**: Sessions expire after 45 minutes of inactivity
- **Sliding window**: TTL resets on every query
- **Message cleanup**: Summarizes old tool results (keeps last 5 full)
- **Auto-generated IDs**: Format `session-YYYYMMDD-HHMMSS-{uuid}`

### Session Commands
```bash
> !new         # Start a new session
> !sessions    # List all active sessions
> !cache       # Show cache statistics
```

### Visual Indicators
```
🆕 New session: session-20251230-120717...     # First query
↩️  Resuming session: session-20251230-120... (23 messages)  # Subsequent queries
💾 Session saved (expires in 45 min)           # After each query
```

## How It Works

### Message Flow

1. **Load Session**: Retrieve messages from Redis
2. **New vs Resume**:
   - New: Include full orchestration rules + query
   - Resume: Just append query to existing messages
3. **Process**: Run LLM + tools
4. **Serialize**: Convert response objects to JSON-safe dicts
5. **Cleanup**: Summarize old tool results
6. **Save**: Store in Redis with refreshed TTL

### Serialization

Anthropic API returns non-JSON objects like `ThinkingBlock`. We serialize them:
```python
def serialize_content(content):
    for block in content:
        if block.type == 'text':
            serialized.append({'type': 'text', 'text': block.text})
        elif block.type == 'tool_use':
            serialized.append({'type': 'tool_use', 'id': block.id, ...})
        # Skip ThinkingBlock and other non-essential blocks
```

### Message Cleanup

Prevents context bloat by summarizing old tool results:
```python
def cleanup_messages(messages):
    # Keep last 5 tool results full
    # Summarize older: "[Summarized: first 100 chars...]"
    # Keep all user/assistant messages full
```

## Enabling/Disabling

**To enable** (default):
```python
# tools/agentwinter.py
from agentwinter.augments.sessions import session_main as main
```

**To disable**:
```python
# tools/agentwinter.py
from agentwinter.main import main
```

## Dependencies

- **Redis server**: Must be running (`redis-server`)
- **redis** Python package: `pip install redis`

## Limitations

- Sessions don't persist across CLI restarts (by design)
- Maximum message history: ~30 messages (older summarized)
- No cross-session memory (each session independent)
- Expires after 45 minutes of inactivity

## Future Enhancements (Phase 2)

- Named sessions (resume by name)
- Session archival to LanceDB
- Stale context detection (git hash tracking)
- Cross-restart session resumption
- Session export/import

## Troubleshooting

### "Redis not running"
```bash
# Check if Redis is running
redis-cli ping
# Should return: PONG

# Start Redis
redis-server
```

### "Can't see my sessions"
Make sure you're checking database 1:
```bash
redis-cli -n 1 KEYS 'agentwinter:session:*'
```

### "Session expired"
Sessions expire after 45 minutes of inactivity. Start a new session with your query.

## Testing
```bash
# Start agentwinter
agentwinter

# Test multi-turn conversation
> tell me about the project
[waits for response with tool exploration]

> how many features did you find?
[should answer without re-exploring]

> !sessions
[lists your active session]

> !new
[starts fresh session, forgets previous]
```

## Design Philosophy

**Modular**: Sessions are an augment, not core functionality
**Isolated**: Uses db=1 and key prefixes to avoid conflicts
**Sliding TTL**: Active sessions don't expire
**Cleanup**: Prevents context window bloat
**JSON-safe**: All data fully serializable

---

## ⚠️ IMPORTANT: Session Usage Best Practices

### One Feature Per Session Rule

**Each new session should focus on ONE feature or a closely-related set of features.**

#### Why This Matters

Sessions accumulate context over time. Mixing unrelated features in one session leads to:
- **Context confusion**: LLM loses track of which feature it's working on
- **Context rot**: Old decisions contaminate new work
- **Tool result bloat**: Summarization can't distinguish important from noise
- **Poor planning**: Jumping between features creates incomplete implementations

#### Best Practices

✅ **GOOD - Focused Sessions:**
```bash
# Session 1: Authentication feature
> create JWT authentication system
> add password reset flow
> integrate with authStore
> !new  # Done with auth

# Session 2: Real-time messaging
> create websocket message system
> add typing indicators
> integrate with messagesStore
```

❌ **BAD - Unfocused Sessions:**
```bash
# One messy session doing everything
> create JWT auth
> also add websocket messaging
> oh and fix that CSS bug
> and refactor proximityStore
> wait, back to auth - add OAuth
# [45 messages later, context is chaos]
```

#### When to Start a New Session

Start `!new` when:
1. ✅ **Switching features**: Moving from auth to messaging
2. ✅ **Feature complete**: Finished implementing and testing one feature
3. ✅ **Context feels stale**: LLM seems confused or repeating itself
4. ✅ **Major direction change**: Pivoting implementation approach
5. ✅ **Session >30 messages**: Getting unwieldy (warning will appear)

Continue existing session when:
1. ✅ **Iterating on same feature**: Refining, bug-fixing, testing
2. ✅ **Related sub-features**: Adding login after implementing signup
3. ✅ **Follow-up questions**: Clarifying implementation details
4. ✅ **Session <20 messages**: Still focused and manageable

#### Session Scoping Examples

**Feature: Authentication System**
- ✅ Login form
- ✅ Signup form  
- ✅ Password reset
- ✅ Session management
- ✅ Protected routes
→ All related, one session is fine

**Feature: Dashboard + Analytics + Settings**
- ❌ Dashboard UI (start session 1)
- ❌ Analytics backend (start session 2)  
- ❌ Settings page (start session 3)
→ Different concerns, separate sessions

#### Red Flags (Time for !new)

Watch for these signs that context is degrading:
- 🚩 LLM asks about decisions already made
- 🚩 Suggests code patterns you already rejected
- 🚩 Can't remember file structure discussed 10 messages ago
- 🚩 Proposes features you already implemented
- 🚩 Session exceeds 30 messages

#### The 45-Minute Rule

Sessions expire after 45 minutes of inactivity. Use this as a natural break:
- Take a break → session expires → fresh start
- Perfect for context reset between features
- Prevents accumulation of stale exploration data

#### Summary

**Think of sessions like Git branches:**
- One branch (session) per feature
- Keep commits (messages) focused
- Merge (complete) before starting new branch
- Clean history = better context

**Golden Rule:**
> "If you wouldn't put both features in the same Git commit, don't put them in the same session."

