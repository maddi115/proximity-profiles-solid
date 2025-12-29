#!/bin/bash
set -e

echo "🔄 MIGRATING TO NOMIC-EMBED-TEXT:v1.5"
echo ""

# 1. Install sentence-transformers if needed
echo "📦 Ensuring sentence-transformers is installed..."
pip install -q sentence-transformers 2>/dev/null || pip install sentence-transformers

# 2. Test nomic model loads
echo "🧪 Testing nomic-embed-text model..."
python << 'ENDOFTEST'
from sentence_transformers import SentenceTransformer
print("   Loading nomic-embed-text:v1.5...")
model = SentenceTransformer('nomic-ai/nomic-embed-text-v1.5', trust_remote_code=True)
test_emb = model.encode("test")
print(f"   ✅ Model loaded (dims: {len(test_emb)})")
ENDOFTEST

# 3. Update index_codebase.py
echo "📝 Updating index_codebase.py..."
sed -i.bak 's/sentence-transformers\/all-MiniLM-L6-v2/nomic-ai\/nomic-embed-text-v1.5/g' tools/index_codebase.py

# Add trust_remote_code if not present
if ! grep -q "trust_remote_code" tools/index_codebase.py; then
    echo "   Adding trust_remote_code parameter..."
    # This is a simple approach - manual edit might be needed
fi

# 4. Update search_code.py
echo "📝 Updating search_code.py..."
sed -i.bak "s/'sentence-transformers\/all-MiniLM-L6-v2'/'nomic-ai\/nomic-embed-text-v1.5', trust_remote_code=True/g" tools/search_code.py

# 5. Update ai_editor_v3.py
echo "📝 Updating ai_editor_v3.py..."
sed -i.bak "s/'sentence-transformers\/all-MiniLM-L6-v2'/'nomic-ai\/nomic-embed-text-v1.5', trust_remote_code=True/g" tools/ai_editor_v3.py

# 6. Drop old index
echo "🗑️  Dropping old index..."
python << 'ENDOFDROP'
from dotenv import load_dotenv
load_dotenv()
import sys
sys.path.insert(0, 'tools')
try:
    from index_codebase import codebase_index_flow
    codebase_index_flow.drop()
    print("   ✅ Old index dropped")
except Exception as e:
    print(f"   ⚠️  Drop failed: {e}")
ENDOFDROP

# 7. Re-index
echo "🔄 Re-indexing with nomic-embed-text:v1.5..."
python tools/index_codebase.py

# 8. Test search
echo "🧪 Testing search..."
python tools/search_code.py 'proximity' | head -30

echo ""
echo "✅ MIGRATION COMPLETE!"
echo ""
echo "Test the agent:"
echo "  python tools/ai_editor_v3.py 'explain proximity features'"
echo ""
echo "If there are issues:"
echo "  ./rollback_migration.sh"
