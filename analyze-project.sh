#!/usr/bin/env bash
set -euo pipefail

echo "=== STATIC ANALYSIS ==="
echo "Date: $(date '+%Y-%m-%d %H:%M:%S')"
echo

echo "1/2 Architecture tree..."
node tools/static-analysis/codebrain.mjs tree src > tools/docs/ARCHITECTURE.md
echo "    ✓ tools/docs/ARCHITECTURE.md"

echo "2/2 Call flow..."
node tools/static-analysis/flow-doc.cjs src > tools/docs/FLOW.md
echo "    ✓ tools/docs/FLOW.md"

echo
echo "✅ Done! Documentation in tools/docs/"
