#!/usr/bin/env bash
set -euo pipefail

echo "=== STATIC ANALYSIS ==="
echo "Date: $(date '+%Y-%m-%d %H:%M:%S')"
echo

echo "1/2 Architecture tree..."
node tools/codebrain.mjs tree src > ARCHITECTURE.md
echo "    ✓ ARCHITECTURE.md"

echo "2/2 Call flow..."
node tools/flow-doc.cjs src > FLOW.md
echo "    ✓ FLOW.md"

echo
echo "✅ Done!"
