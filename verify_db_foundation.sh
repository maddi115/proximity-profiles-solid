#!/bin/bash

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  DATABASE FOUNDATION CHECK (Bottom → Top)"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

STATUS="✅"

# LAYER 1: DATABASE (Foundation)
echo "━━━ LAYER 1: DATABASE (Foundation) ━━━"
echo ""
echo "Supabase Project:"
if grep -q "VITE_SUPABASE_URL" .env.local 2>/dev/null; then
  URL=$(grep "VITE_SUPABASE_URL" .env.local | cut -d= -f2)
  if [[ $URL == *"supabase.co"* ]] && [[ $URL != *"your-"* ]]; then
    echo "   ✅ URL configured: $URL"
  else
    echo "   ❌ URL invalid or placeholder: $URL"
    STATUS="❌"
  fi
else
  echo "   ❌ VITE_SUPABASE_URL missing from .env"
  STATUS="❌"
fi

if grep -q "VITE_SUPABASE_ANON_KEY" .env.local 2>/dev/null; then
  KEY=$(grep "VITE_SUPABASE_ANON_KEY" .env.local | cut -d= -f2)
  if [[ ${#KEY} -gt 100 ]] && [[ $KEY != *"your-"* ]]; then
    echo "   ✅ Anon key configured (${#KEY} chars)"
  else
    echo "   ❌ Anon key invalid or placeholder"
    STATUS="❌"
  fi
else
  echo "   ❌ VITE_SUPABASE_ANON_KEY missing from .env"
  STATUS="❌"
fi
echo ""

# LAYER 2: CLIENT INITIALIZATION
echo "━━━ LAYER 2: CLIENT INITIALIZATION ━━━"
echo ""
if [ -f src/features/auth/utils/supabaseClient.js ]; then
  echo "supabaseClient.js:"
  
  # Check if it reads env vars
  if grep -q "import.meta.env.VITE_SUPABASE" src/features/auth/utils/supabaseClient.js; then
    echo "   ✅ Reads VITE_SUPABASE_* from env"
  else
    echo "   ❌ Not reading env vars correctly"
    STATUS="❌"
  fi
  
  # Check if it has createClient
  if grep -q "createClient" src/features/auth/utils/supabaseClient.js; then
    echo "   ✅ Calls createClient()"
  else
    echo "   ❌ createClient() not found"
    STATUS="❌"
  fi
  
  # Check if it exports 'supabase'
  if grep -q "export.*supabase" src/features/auth/utils/supabaseClient.js; then
    echo "   ✅ Exports supabase client"
  else
    echo "   ❌ No supabase export found"
    STATUS="❌"
  fi
  
  # Check if mock fallback exists
  if grep -q "createMockClient\|hasValidCredentials" src/features/auth/utils/supabaseClient.js; then
    echo "   ⚠️  Has mock fallback (will use if env vars invalid)"
  fi
else
  echo "   ❌ supabaseClient.js not found"
  STATUS="❌"
fi
echo ""

# LAYER 3: STORE (State Management)
echo "━━━ LAYER 3: STORE (State Management) ━━━"
echo ""
if [ -f src/features/auth/store/authStore.ts ]; then
  echo "authStore.ts:"
  
  # Check if it imports supabase
  if grep -q 'import.*supabase.*from.*supabaseClient' src/features/auth/store/authStore.ts; then
    echo "   ✅ Imports supabase client"
  else
    echo "   ❌ Doesn't import supabase"
    STATUS="❌"
  fi
  
  # Check for key methods
  METHODS=("initialize" "signIn" "signOut" "signInWithOAuth" "skipAuth")
  for method in "${METHODS[@]}"; do
    if grep -q "$method.*:.*function\|async $method\|$method()" src/features/auth/store/authStore.ts; then
      echo "   ✅ Has $method() method"
    else
      echo "   ❌ Missing $method() method"
      STATUS="❌"
    fi
  done
  
  # Check if it exports authActions
  if grep -q "export.*authActions" src/features/auth/store/authStore.ts; then
    echo "   ✅ Exports authActions"
  else
    echo "   ❌ authActions not exported"
    STATUS="❌"
  fi
else
  echo "   ❌ authStore.ts not found"
  STATUS="❌"
fi
echo ""

# LAYER 4: HOOKS (Business Logic)
echo "━━━ LAYER 4: HOOKS (Business Logic) ━━━"
echo ""
if [ -f src/features/auth/hooks/useAuth.ts ]; then
  echo "useAuth.ts:"
  
  # Check if it imports authStore
  if grep -q 'import.*authStore.*from.*authStore' src/features/auth/hooks/useAuth.ts; then
    echo "   ✅ Imports authStore"
  else
    echo "   ❌ Doesn't import authStore"
    STATUS="❌"
  fi
  
  # Check if it exports useAuth
  if grep -q "export.*useAuth" src/features/auth/hooks/useAuth.ts; then
    echo "   ✅ Exports useAuth hook"
  else
    echo "   ❌ useAuth not exported"
    STATUS="❌"
  fi
  
  # Check what it returns
  EXPOSED=("user" "session" "isAuthenticated" "signIn" "signOut" "skipAuth")
  for item in "${EXPOSED[@]}"; do
    if grep -q "$item:" src/features/auth/hooks/useAuth.ts; then
      echo "   ✅ Exposes $item"
    else
      echo "   ⚠️  Missing $item in return"
    fi
  done
else
  echo "   ❌ useAuth.ts not found"
  STATUS="❌"
fi
echo ""

# LAYER 5: COMPONENTS (UI)
echo "━━━ LAYER 5: COMPONENTS (UI) ━━━"
echo ""
if [ -f src/features/auth/components/LoginForm.jsx ]; then
  echo "LoginForm.jsx:"
  
  # Check if it uses useAuth
  if grep -q "useAuth()" src/features/auth/components/LoginForm.jsx; then
    echo "   ✅ Uses useAuth() hook"
  else
    echo "   ❌ Doesn't use useAuth()"
    STATUS="❌"
  fi
  
  # Check for OAuth button
  if grep -q "signInWithOAuth\|Google" src/features/auth/components/LoginForm.jsx; then
    echo "   ✅ Has Google OAuth button"
  else
    echo "   ⚠️  No Google OAuth button"
  fi
  
  # Check for guest mode
  if grep -q "skipAuth\|Guest" src/features/auth/components/LoginForm.jsx; then
    echo "   ✅ Has guest mode button"
  else
    echo "   ⚠️  No guest mode button"
  fi
else
  echo "   ❌ LoginForm.jsx not found"
  STATUS="❌"
fi
echo ""

# LAYER 6: ROUTES (Entry Points)
echo "━━━ LAYER 6: ROUTES (Entry Points) ━━━"
echo ""
echo "Protected Routes:"
PROTECTED_COUNT=$(grep -r "ProtectedRoute" src/app/*.jsx src/routes/*.jsx 2>/dev/null | wc -l)
if [ $PROTECTED_COUNT -gt 0 ]; then
  echo "   ✅ Found $PROTECTED_COUNT protected routes"
  grep -h "path=\"" src/app/*.jsx 2>/dev/null | grep -B1 "ProtectedRoute" | grep "path=" | sed 's/^/      /'
else
  echo "   ⚠️  No protected routes found"
fi

echo ""
echo "Public Routes:"
if grep -q '/auth/login' src/app/*.jsx 2>/dev/null; then
  echo "   ✅ Has /auth/login route"
else
  echo "   ❌ No login route found"
  STATUS="❌"
fi
echo ""

# LAYER 7: INITIALIZATION
echo "━━━ LAYER 7: APP INITIALIZATION ━━━"
echo ""
if [ -f src/app/App.jsx ]; then
  echo "App.jsx:"
  
  # Check if auth is initialized
  if grep -q "authActions.initialize\|authActions.setupAuthListener" src/app/App.jsx; then
    echo "   ✅ Initializes auth on mount"
  else
    echo "   ⚠️  No auth initialization found"
  fi
else
  echo "   ❌ App.jsx not found"
  STATUS="❌"
fi
echo ""

# FINAL VERDICT
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
if [ "$STATUS" = "✅" ]; then
  echo "🎉 FOUNDATION IS SOLID"
  echo ""
  echo "All layers properly configured:"
  echo "   Database → Client → Store → Hook → Component → Routes → App"
  echo ""
  echo "OAuth should work if:"
  echo "   1. Supabase project has Google OAuth enabled"
  echo "   2. Redirect URL is configured: http://localhost:3000/home"
else
  echo "⚠️  FOUNDATION HAS ISSUES"
  echo ""
  echo "Fix the ❌ items above before expecting OAuth to work."
  echo ""
  echo "Quick fixes:"
  echo "   1. Add VITE_SUPABASE_* to .env"
  echo "   2. Verify all files exist"
  echo "   3. Check imports/exports match"
fi
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
