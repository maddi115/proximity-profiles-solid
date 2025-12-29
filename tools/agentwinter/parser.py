"""Parse code files to extract imports, functions, components, stores"""

import re
import glob
import os
from functools import lru_cache

try:
    from tree_sitter_languages import get_parser

    TREE_SITTER_AVAILABLE = True
except ImportError:
    TREE_SITTER_AVAILABLE = False


def parse_with_regex(file_path):
    """Regex-based fallback parser"""
    try:
        with open(file_path, "r", encoding="utf-8") as f:
            content = f.read()

        facts = {
            "imports": [],
            "functions": [],
            "components": [],
            "stores": [],
            "file_path": file_path,
        }

        # Imports
        import_pattern = r'import\s+(?:{([^}]+)}|(\w+))\s+from\s+[\'"]([^\'"]+)[\'"]'
        for match in re.finditer(import_pattern, content):
            if match.group(1):
                names = [n.strip() for n in match.group(1).split(",")]
                source = match.group(3)
                for name in names:
                    facts["imports"].append({"name": name, "from": source})
            elif match.group(2):
                facts["imports"].append(
                    {"name": match.group(2), "from": match.group(3)}
                )

        # Functions
        func_pattern = r"(?:export\s+)?(?:async\s+)?function\s+(\w+)"
        facts["functions"] = re.findall(func_pattern, content)

        # Components
        comp_pattern = r"(?:export\s+)?const\s+(\w+)\s*=\s*\([^)]*\)\s*=>"
        facts["components"] = re.findall(comp_pattern, content)

        # Stores
        store_pattern = r"(?:export\s+)?const\s+(\w+Store)\s*="
        facts["stores"] = re.findall(store_pattern, content)

        return facts
    except BaseException:
        return None


def parse_with_tree_sitter(file_path):
    """Tree-sitter based parser"""
    if not TREE_SITTER_AVAILABLE:
        return parse_with_regex(file_path)

    try:
        with open(file_path, "rb") as f:
            code = f.read()

        if file_path.endswith((".tsx", ".jsx")):
            parser = get_parser("tsx")
        elif file_path.endswith(".ts"):
            parser = get_parser("typescript")
        else:
            parser = get_parser("javascript")

        tree = parser.parse(code)

        facts = {
            "imports": [],
            "functions": [],
            "components": [],
            "stores": [],
            "file_path": file_path,
        }

        def extract_text(node):
            return code[node.start_byte : node.end_byte].decode(
                "utf-8", errors="ignore"
            )

        def visit(node):
            if node.type == "import_statement":
                try:
                    for child in node.children:
                        if child.type == "string":
                            source = extract_text(child).strip("\"'")
                            for n in node.children:
                                if n.type == "import_clause":
                                    for spec in n.children:
                                        if spec.type in [
                                            "identifier",
                                            "import_specifier",
                                        ]:
                                            name = (
                                                extract_text(spec)
                                                .split(" as ")[0]
                                                .strip()
                                            )
                                            facts["imports"].append(
                                                {"name": name, "from": source}
                                            )
                except BaseException:
                    pass

            if node.type in ["function_declaration", "function_expression"]:
                try:
                    for child in node.children:
                        if child.type == "identifier":
                            facts["functions"].append(extract_text(child))
                            break
                except BaseException:
                    pass

            if node.type == "lexical_declaration":
                try:
                    for child in node.children:
                        if child.type == "variable_declarator":
                            name_node = child.child_by_field_name("name")
                            if name_node:
                                name = extract_text(name_node)
                                value_node = child.child_by_field_name("value")
                                if value_node:
                                    value_text = extract_text(value_node)
                                    if "createStore" in value_text or "Store" in name:
                                        facts["stores"].append(name)
                                    elif "=>" in value_text:
                                        facts["components"].append(name)
                except BaseException:
                    pass

            for child in node.children:
                visit(child)

        visit(tree.root_node)
        return (
            facts
            if facts["imports"] or facts["functions"]
            else parse_with_regex(file_path)
        )
    except BaseException:
        return parse_with_regex(file_path)


@lru_cache(maxsize=1000)
def parse_file(file_path):
    """Main entry point - try Tree-sitter, fallback to regex"""
    return parse_with_tree_sitter(file_path)


def parse_all_files():
    """Parse all TypeScript/JavaScript files in src/"""
    files = (
        glob.glob("src/**/*.ts", recursive=True)
        + glob.glob("src/**/*.tsx", recursive=True)
        + glob.glob("src/**/*.jsx", recursive=True)
        + glob.glob("src/**/*.js", recursive=True)
    )

    parsed_map = {}
    parsed_count = 0

    for filepath in files:
        if os.path.isfile(filepath):
            facts = parse_file(filepath)
            if facts and (
                facts["imports"]
                or facts["functions"]
                or facts["components"]
                or facts["stores"]
            ):
                parsed_map[filepath] = facts
                parsed_count += 1

    return parsed_map, parsed_count, len(files)
