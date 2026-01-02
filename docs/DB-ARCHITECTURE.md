# 🍄 Database Architecture

## Overview

All database operations go through a **🍄 Tracer + 🌊 Transporter** system with **mandatory Zod validation**.

This ensures:
- ✅ Type safety (TypeScript + Zod runtime validation)
- ✅ Error tracing (exactly where operations fail)
- ✅ Self-documenting code (schemas ARE documentation)
- ✅ Intentional friction (can't accidentally touch DB)

---

## File Structure
```
src/
├── types/
│   └── DB_schemas.ts          🍄 Zod validation schemas
├── utils/
│   └── DB_operations.ts       🍄 Tracer + Transporter
└── features/auth/
    ├── utils/
    │   └── DB_supabaseClient.js  🍄 Supabase client
    └── store/
        └── DB_authStore.ts       🍄 Auth operations
```

**Rule:** All files that touch the database have `DB_` prefix.

---

## Data Flow (7 Layers)
```
Layer 1: Supabase Project
         ↓ (.env.local credentials)
Layer 2: DB_supabaseClient.js
         ↓ (reads VITE_SUPABASE_URL + VITE_SUPABASE_ANON_KEY)
Layer 3: DB_operations.ts
         ↓ (validates with Zod, traces execution)
Layer 4: DB_authStore.ts
         ↓ (wraps all Supabase calls)
Layer 5: useAuth.ts
         ↓ (exposes to components)
Layer 6: LoginForm, AuthButton, etc
         ↓ (UI components)
Layer 7: ProtectedRoute
         ↓ (guards routes)
```

---

## Usage

### DB.AUTH - Authentication with Validation
```typescript
// Must provide: schema + data + operation
await DB.AUTH(
  DB_AuthSchemas.signUp,           // Zod schema
  { email, password },              // Raw data
  (validated) =>                    // Lambda with validated data
    supabase.auth.signUp(validated) // DB operation
);
```

**Console output:**
```
🍄 AUTH tracer -> validating input
🌊 AUTH -> transporting validated data: { email: "...", password: "***" }
✅ AUTH transport complete
```

**On error:**
```
🌊 Transport BLOCKED at AUTH validation: Invalid email format
```

### DB.READ - Read Operations
```typescript
await DB.READ(() => 
  supabase.auth.getSession()
);
```

### DB.WRITE - Write Operations
```typescript
await DB.WRITE(() => 
  profileActions.updateProfile(data)
);
```

---

## Schemas (types/DB_schemas.ts)

All validation happens with Zod schemas:
```typescript
DB_AuthSchemas = {
  signUp: z.object({
    email: z.string().email(),
    password: z.string().min(8),
    metadata: z.object({ username: z.string() }).optional()
  }),
  signIn: z.object({
    email: z.string().email(),
    password: z.string()
  }),
  oauth: z.object({
    provider: z.enum(['google', 'github']),
    redirectTo: z.string().url()
  })
}
```

**Schemas = Living Documentation**

Anyone reading the schema knows exactly:
- What data is required
- What format it must be
- What constraints exist
- What error messages users see

---

## Finding DB Operations

### Grep Commands
```bash
# All DB files
find src/ -name "DB_*"

# All AUTH operations
grep -r "DB\.AUTH" src/

# All READ operations  
grep -r "DB\.READ" src/

# All WRITE operations
grep -r "DB\.WRITE" src/

# Files importing DB components
grep -r "from.*DB_" src/ -l
```

### Current DB Operations

- **DB.AUTH:** 4 operations (signUp, signIn, oauth, resetPassword)
- **DB.READ:** 5 operations (initialize, getSession, etc)
- **DB.WRITE:** 3 operations (updateProfile, syncProfile)

---

## Environment Setup

### Required Variables
```bash
# .env.local (gitignored)
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=sb_publishable_...
```

### Validate Environment
```bash
# Check if env is set up correctly
npm run check:env

# Or manually
./verify_db_foundation.sh
```

**Expected output if correct:**
```
✅ Layer 1: Database credentials exist
✅ Layer 2: Client reads env vars
✅ Layer 3: Store imports client
...
```

### Missing Credentials?

If `VITE_SUPABASE_*` not set:
- App falls back to **mock client**
- OAuth won't work
- Use **Guest Mode** instead

---

## Error Handling

### Validation Errors
```typescript
// User tries invalid email
await signUp("bad-email", "123");

// Console:
🌊 Transport BLOCKED at AUTH validation:
  - Invalid email format
  - Password too short (min 8 characters)
```

### Database Errors
```typescript
// DB operation fails
await signUp("test@test.com", "password123");

// Console:
🌊 Transport BLOCKED at AUTH operation: User already exists
```

---

## Why This Architecture?

### Problem: Silent Failures

**Before:**
```typescript
await supabase.auth.signUp({ email, password });
// No validation, no tracing, errors buried
```

**After:**
```typescript
await DB.AUTH(schema, { email, password }, (v) => 
  supabase.auth.signUp(v)
);
// Validated, traced, errors clear
```

### Intentional Friction

**Light code** (no DB):
```typescript
const count = users.length;  // Fast, safe
```

**Heavy code** (DB):
```typescript
await DB.AUTH(schema, data, op);  // Deliberate, validated
```

The ceremony matches the importance.

---

## Extending

### Adding New DB Operations

1. Create Zod schema in `DB_schemas.ts`
2. Wrap operation in `DB.AUTH/READ/WRITE`
3. Operation automatically gets validation + tracing
```typescript
// 1. Add schema
export const DB_NewSchema = z.object({
  field: z.string()
});

// 2. Use in operation
await DB.AUTH(
  DB_NewSchema,
  { field: value },
  (validated) => supabase.from('table').insert(validated)
);
```

---

## Troubleshooting

### "Transport BLOCKED at validation"
- Check input matches schema
- See console for exact field errors
- Update data or schema

### "supabaseClient is not a function"
- Import from `DB_supabaseClient`, not `supabaseClient`
- Check file has `DB_` prefix

### "Mock client active"
- Add `VITE_SUPABASE_*` to `.env.local`
- Or use Guest Mode for development

---

## Quick Reference

| Operation | Use When | Validates? |
|-----------|----------|------------|
| `DB.AUTH` | User auth (signUp, signIn, oauth) | ✅ Yes (Zod) |
| `DB.READ` | Fetching data | ❌ No |
| `DB.WRITE` | Updating data | ❌ No |

**All operations:**
- Log execution (`🍄 → 🌊 → ✅`)
- Stop on error (`🌊 BLOCKED`)
- Show exact failure point
