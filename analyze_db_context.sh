#!/bin/bash

echo "================================"
echo "DATABASE & BACKEND CONTEXT MAP"
echo "================================"
echo ""

echo "📁 PROJECT STRUCTURE:"
echo "├── Frontend (SolidJS in src/)"
echo "├── Backend (Bun/Hono in backend/)"
echo "└── AI Tools (Python in workspace/)"
echo ""

echo "🗄️  DATABASE CONFIGURATIONS:"
echo ""
echo "1. SUPABASE (Frontend Auth):"
ls .env* 2>/dev/null | while read f; do
  if grep -q "VITE_SUPABASE" "$f" 2>/dev/null; then
    echo "   ✅ Found in: $f"
    grep "VITE_SUPABASE" "$f" | sed 's/=.*/=***/' 
  fi
done
if ! grep -r "VITE_SUPABASE" .env* 2>/dev/null >/dev/null; then
  echo "   ❌ No VITE_SUPABASE_* variables found"
  echo "   📍 Currently using: MOCK client (see src/features/auth/utils/supabaseClient.js)"
fi
echo ""

echo "2. POSTGRES (AI Tools):"
if grep -q "POSTGRES_" .env 2>/dev/null; then
  echo "   ✅ Configured for: AI code indexing (AgentWinter)"
  grep "POSTGRES_DB" .env 2>/dev/null
else
  echo "   ❌ Not configured"
fi
echo ""

echo "3. BACKEND DATABASE:"
if [ -f backend/drizzle.config.ts ]; then
  echo "   📄 Config exists: backend/drizzle.config.ts"
  echo "   🔍 Type: $(grep -o "driver.*" backend/drizzle.config.ts | head -1 || echo "Not specified")"
else
  echo "   ❌ No Drizzle config found"
fi
echo ""

echo "🔌 ACTIVE CONNECTIONS:"
echo ""
echo "Frontend → Database:"
if grep -q "VITE_SUPABASE_URL" .env* 2>/dev/null; then
  echo "   ✅ Supabase configured"
else
  echo "   ⚠️  Using MOCK Supabase (no real database)"
fi
echo ""

echo "Backend Status:"
if [ -f backend/src/index.ts ]; then
  echo "   📝 Code exists but check if connected:"
  grep -i "database\|supabase\|d1\|postgres" backend/src/index.ts | head -3 || echo "   ❓ No database imports found"
else
  echo "   ❌ No backend code"
fi
echo ""

echo "📊 SUMMARY:"
echo ""
has_frontend_db=false
has_backend_db=false

grep -q "VITE_SUPABASE" .env* 2>/dev/null && has_frontend_db=true

if [ "$has_frontend_db" = true ]; then
  echo "✅ Frontend: Connected to Supabase"
else
  echo "⚠️  Frontend: Using MOCK database (guest mode active)"
fi

if [ -f backend/drizzle.config.ts ]; then
  echo "📋 Backend: Configured but may not be connected"
else
  echo "❌ Backend: Not set up"
fi

echo ""
echo "================================"
