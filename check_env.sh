#!/bin/bash

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  DATABASE ENVIRONMENT VALIDATION"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

STATUS="✅"

# Check .env.local exists
if [ ! -f .env.local ]; then
  echo "❌ .env.local not found"
  echo "   Create it with: cp .env.local.example .env.local"
  STATUS="❌"
else
  echo "✅ .env.local exists"
fi

# Check VITE_SUPABASE_URL
if grep -q "VITE_SUPABASE_URL" .env.local 2>/dev/null; then
  URL=$(grep "VITE_SUPABASE_URL" .env.local | cut -d= -f2)
  if [[ $URL == *"supabase.co"* ]] && [[ $URL != *"your-"* ]]; then
    echo "✅ VITE_SUPABASE_URL configured"
  else
    echo "❌ VITE_SUPABASE_URL invalid: $URL"
    STATUS="❌"
  fi
else
  echo "❌ VITE_SUPABASE_URL missing"
  STATUS="❌"
fi

# Check VITE_SUPABASE_ANON_KEY
if grep -q "VITE_SUPABASE_ANON_KEY" .env.local 2>/dev/null; then
  KEY=$(grep "VITE_SUPABASE_ANON_KEY" .env.local | cut -d= -f2)
  if [[ ${#KEY} -gt 50 ]] && [[ $KEY != *"your-"* ]]; then
    echo "✅ VITE_SUPABASE_ANON_KEY configured (${#KEY} chars)"
  else
    echo "❌ VITE_SUPABASE_ANON_KEY invalid"
    STATUS="❌"
  fi
else
  echo "❌ VITE_SUPABASE_ANON_KEY missing"
  STATUS="❌"
fi

echo ""
if [ "$STATUS" = "✅" ]; then
  echo "🎉 Environment configured correctly!"
  echo "   OAuth should work (if enabled in Supabase dashboard)"
else
  echo "⚠️  Environment issues found"
  echo ""
  echo "Fix:"
  echo "  1. Go to https://supabase.com/dashboard"
  echo "  2. Settings → API"
  echo "  3. Copy Project URL + anon public key"
  echo "  4. Add to .env.local"
fi
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
