# Auth Feature

**Complete authentication system** using Supabase Auth.

## Features
- ✅ Email/password authentication
- ✅ OAuth (Google, GitHub)
- ✅ Password reset
- ✅ Protected routes
- ✅ Session management
- ✅ Auto-refresh tokens
- ✅ Profile sync

## Usage
```javascript
import { useAuth } from '@/features/auth/hooks/useAuth';

const auth = useAuth();

// Sign in
await auth.signIn(email, password);

// Check auth state
if (auth.isAuthenticated()) {
  // User is logged in
}
```

## Setup
1. Add Supabase credentials to `.env`
2. Configure OAuth providers in Supabase dashboard
3. Auth is auto-initialized in App.jsx
