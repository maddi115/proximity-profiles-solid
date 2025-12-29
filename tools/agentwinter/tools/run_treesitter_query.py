"""Execute custom Tree-sitter queries across the codebase"""

import glob
import os

try:
    from tree_sitter_languages import get_language, get_parser

    TREE_SITTER_AVAILABLE = True
except ImportError:
    TREE_SITTER_AVAILABLE = False


def run_treesitter_query(query_pattern, language="tsx", max_results=20):
    """Execute a Tree-sitter S-expression query across all files"""

    if not TREE_SITTER_AVAILABLE:
        return {"error": "Tree-sitter not available"}

    try:
        # Get parser and language
        parser = get_parser(language)
        lang = get_language(language)

        # Compile query
        query = lang.query(query_pattern)

        # Find all relevant files
        extensions = {
            "tsx": ["*.tsx", "*.ts"],
            "typescript": ["*.ts"],
            "javascript": ["*.js", "*.jsx"],
        }

        files = []
        for ext in extensions.get(language, ["*.tsx", "*.ts"]):
            files.extend(glob.glob(f"src/**/{ext}", recursive=True))

        results = []

        for filepath in files[:50]:  # Limit to 50 files for performance
            if not os.path.isfile(filepath):
                continue

            try:
                with open(filepath, "rb") as f:
                    code = f.read()

                tree = parser.parse(code)
                captures = query.captures(tree.root_node)

                if captures:
                    for node, capture_name in captures[:5]:  # Limit per file
                        # Extract surrounding context
                        start = max(0, node.start_byte - 50)
                        end = min(len(code), node.end_byte + 50)
                        context = code[start:end].decode("utf-8", errors="ignore")

                        results.append(
                            {
                                "file": filepath.replace("src/", ""),
                                "capture": capture_name,
                                "text": code[node.start_byte : node.end_byte].decode(
                                    "utf-8", errors="ignore"
                                ),
                                "context": context,
                                "line": code[: node.start_byte].count(b"\n") + 1,
                            }
                        )

                        if len(results) >= max_results:
                            break
            except Exception:
                continue

            if len(results) >= max_results:
                break

        return {
            "query": query_pattern,
            "total_matches": len(results),
            "matches": results,
        }

    except Exception as e:
        return {"error": f"Query execution failed: {str(e)}", "query": query_pattern}
