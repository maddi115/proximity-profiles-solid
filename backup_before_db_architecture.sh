#!/bin/bash

BACKUP_DIR=".backups/db-architecture-$(date +%Y%m%d-%H%M%S)"
mkdir -p "$BACKUP_DIR"

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  BACKUP BEFORE DB ARCHITECTURE IMPLEMENTATION"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "Backup location: $BACKUP_DIR"
echo ""

# Backup all files we'll modify
echo "Backing up files to be modified..."

# Auth store and related
cp src/features/auth/store/authStore.ts "$BACKUP_DIR/" 2>/dev/null
cp src/features/auth/hooks/useAuth.ts "$BACKUP_DIR/" 2>/dev/null
cp src/features/auth/utils/supabaseClient.js "$BACKUP_DIR/" 2>/dev/null

# All files that import authStore (will need import path updates)
echo "Finding files that import authStore..."
grep -r "from.*authStore" src/ -l 2>/dev/null | while read file; do
  mkdir -p "$BACKUP_DIR/$(dirname $file)"
  cp "$file" "$BACKUP_DIR/$file"
  echo "   Backed up: $file"
done

# Scripts we'll modify
cp verify_db_foundation.sh "$BACKUP_DIR/" 2>/dev/null
cp map_auth_database.sh "$BACKUP_DIR/" 2>/dev/null

# Package.json (just in case)
cp package.json "$BACKUP_DIR/"

echo ""
echo "✅ Backup complete"
echo ""
echo "Files backed up:"
find "$BACKUP_DIR" -type f | sed 's|^|   |'
echo ""
echo "To restore: cp -r $BACKUP_DIR/* ./"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
