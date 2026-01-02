#!/bin/bash

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  AUTH & DATABASE RELATIONSHIP MAP"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

echo "📍 1. SUPABASE CLIENT LOCATIONS"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
grep -rn "supabase" src/ --include="*.ts" --include="*.js" --include="*.jsx" | grep -i "import\|from\|createClient" | sort -u
echo ""

echo "📍 2. AUTH STORE - WHERE IT LIVES"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
find src/ -name "*authStore*" -o -name "*auth*store*" | while read f; do
  echo "📄 $f"
  echo "   Exports:"
  grep -n "^export" "$f" | head -10
  echo ""
done

echo "📍 3. WHO IMPORTS AUTH"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
grep -rn "from.*auth" src/ --include="*.ts" --include="*.jsx" --include="*.js" | grep -v "node_modules" | cut -d: -f1 | sort -u | while read f; do
  echo "📄 $f"
  grep "from.*auth" "$f" | sed 's/^/   → /'
done
echo ""

echo "📍 4. AUTH METHODS AVAILABLE"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
if [ -f src/features/auth/store/authStore.ts ]; then
  echo "From authStore.ts:"
  grep -n "^\s*async\s\|^\s*[a-zA-Z_]*().*:" src/features/auth/store/authStore.ts | grep -v "^\s*//" | sed 's/^/   /'
fi
echo ""

echo "📍 5. PROTECTED ROUTES"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
grep -rn "ProtectedRoute" src/ --include="*.jsx" --include="*.tsx" | cut -d: -f1,2 | sort -u
echo ""

echo "📍 6. DATABASE ENV VARS (What's Expected)"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
grep -rn "import.meta.env\|process.env" src/ --include="*.ts" --include="*.js" | grep -i "supabase\|database\|db" | cut -d: -f1-3 | sort -u
echo ""

echo "📍 7. DATABASE ENV VARS (What Exists)"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
if [ -f .env ]; then
  grep "SUPABASE\|DATABASE\|POSTGRES" .env || echo "   ❌ No database vars in .env"
else
  echo "   ❌ No .env file exists"
fi
echo ""

echo "📍 8. AUTH HOOK DEPENDENCIES"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
if [ -f src/features/auth/hooks/useAuth.ts ]; then
  echo "useAuth.ts returns:"
  grep -A 20 "return {" src/features/auth/hooks/useAuth.ts | grep ":" | sed 's/^/   /'
fi
echo ""

echo "📍 9. AUTH FLOW - FILE DEPENDENCY CHAIN"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "   Database Client"
echo "        ↓"
echo "   src/features/auth/utils/supabaseClient.js"
echo "        ↓"
echo "   src/features/auth/store/authStore.ts"
echo "        ↓"
echo "   src/features/auth/hooks/useAuth.ts"
echo "        ↓"
find src/ -name "*LoginForm*" -o -name "*login*" | grep -v node_modules | sed 's/^/   /'
echo "        ↓"
grep -l "ProtectedRoute" src/app/*.jsx src/routes/*.jsx 2>/dev/null | sed 's/^/   /'
echo ""

echo "📍 10. MISSING PIECES"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo -n "   .env with VITE_SUPABASE_*: "
grep -q "VITE_SUPABASE" .env 2>/dev/null && echo "✅ EXISTS" || echo "❌ MISSING"

echo -n "   Supabase client initialized: "
grep -q "createClient" src/features/auth/utils/supabaseClient.js 2>/dev/null && echo "✅ YES" || echo "❌ NO"

echo -n "   Auth store has skipAuth: "
grep -q "skipAuth" src/features/auth/store/authStore.ts 2>/dev/null && echo "✅ YES" || echo "❌ NO"

echo -n "   LoginForm has guest button: "
grep -q "Guest" src/features/auth/components/LoginForm.jsx 2>/dev/null && echo "✅ YES" || echo "❌ NO"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
