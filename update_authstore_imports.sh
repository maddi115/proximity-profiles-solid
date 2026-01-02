#!/bin/bash

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  UPDATING IMPORTS: authStore → DB_authStore"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# List of files to update
FILES=(
  "src/features/auth/hooks/useAuth.ts"
  "src/features/messages/store/messagesStore.ts"
  "src/app/App.jsx"
  "src/routes/(sheet)/welcome-page/index.jsx"
  "src/routes/(sheet)/home/StoryButton.jsx"
  "src/routes/(sheet)/home/dynamicIsland/modes/CompactMode.jsx"
  "src/routes/(sheet)/home/messages/conversation.jsx"
  "src/routes/(sheet)/home/messages/index.jsx"
  "src/routes/_layout.jsx"
)

for file in "${FILES[@]}"; do
  if [ -f "$file" ]; then
    echo "📝 Updating: $file"
    
    # Show current import
    echo "   Before: $(grep "from.*authStore" "$file" | head -1)"
    
    # Update the import path
    sed -i "s|from '\(.*\)/authStore'|from '\1/DB_authStore'|g" "$file"
    sed -i 's|from "\(.*\)/authStore"|from "\1/DB_authStore"|g' "$file"
    
    # Show new import
    echo "   After:  $(grep "from.*DB_authStore" "$file" | head -1)"
    echo ""
  else
    echo "⚠️  File not found: $file"
    echo ""
  fi
done

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  VERIFICATION"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Check if any files still import old authStore
echo "Files still importing old authStore:"
OLD_IMPORTS=$(grep -r "from.*['\"].*authStore['\"]" src/ --include="*.ts" --include="*.tsx" --include="*.jsx" -l | grep -v "DB_authStore" | grep -v "authStore.ts.backup" | wc -l)

if [ "$OLD_IMPORTS" -eq 0 ]; then
  echo "✅ All imports updated successfully!"
else
  echo "⚠️  Found $OLD_IMPORTS files still using old import:"
  grep -r "from.*['\"].*authStore['\"]" src/ --include="*.ts" --include="*.tsx" --include="*.jsx" -l | grep -v "DB_authStore" | grep -v "authStore.ts.backup"
fi

echo ""
echo "Files now importing DB_authStore:"
grep -r "from.*DB_authStore" src/ -l | wc -l

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
