#!/bin/bash
set -e

echo "🔄 ROLLING BACK TO SAFE STATE"
echo ""

# 1. Restore files
echo "📁 Restoring files..."
cp .backups/pre-nomic-migration/ai_editor_v3.py tools/ 2>/dev/null || echo "   Skipping ai_editor_v3.py"
cp .backups/pre-nomic-migration/search_code.py tools/ 2>/dev/null || echo "   Skipping search_code.py"
cp .backups/pre-nomic-migration/index_codebase.py tools/ 2>/dev/null || echo "   Skipping index_codebase.py"
cp .backups/pre-nomic-migration/env.backup .env 2>/dev/null || echo "   Skipping .env"

# 2. Restore database
echo "💾 Restoring database..."
if [ -f .backups/pre-nomic-migration/codebase_index.sql ]; then
    dropdb --if-exists codebase_index -h localhost -U postgres 2>/dev/null || true
    createdb codebase_index -h localhost -U postgres 2>/dev/null || true
    psql postgresql://postgres:postgres@localhost:5432/codebase_index < .backups/pre-nomic-migration/codebase_index.sql 2>/dev/null || echo "   Database restore failed"
else
    echo "   No database backup found"
fi

# 3. Restore git branch
echo "🌿 Switching to main branch..."
git checkout main 2>/dev/null || true
git branch -D migration/nomic-embed-text 2>/dev/null || true

echo ""
echo "✅ ROLLBACK COMPLETE!"
echo ""
echo "Test with: python tools/search_code.py 'proximity'"
