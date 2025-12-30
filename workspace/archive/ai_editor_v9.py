#!/usr/bin/env python3
"""
AI Code Assistant v9.1 - Fixed conversation history + JSON serialization
"""
from dotenv import load_dotenv
from sentence_transformers import SentenceTransformer
import psycopg2
import os
import anthropic
import subprocess
from datetime import datetime
import glob
import json

try:
    from tree_sitter_languages import get_language, get_parser
    TREE_SITTER_AVAILABLE = True
except ImportError:
    TREE_SITTER_AVAILABLE = False

load_dotenv()

# ANSI colors
YELLOW = '\033[93m'
GREEN = '\033[92m'
CYAN = '\033[96m'
BLUE = '\033[94m'
RED = '\033[91m'
RESET = '\033[0m'
BOLD = '\033[1m'

print(f"{CYAN}Loading model...{RESET}")
model = SentenceTransformer('nomic-ai/nomic-embed-text-v1.5', trust_remote_code=True)

client = anthropic.Anthropic(
    api_key=os.getenv("ANTHROPIC_API_KEY"),
    base_url=os.getenv("ANTHROPIC_BASE_URL")
)

# === STATE ===
conversation_history = []
cached_tree = None
parsed_code_map = {}
symbol_index = {}

def get_git_status():
    try:
        result = subprocess.run(['git', 'status', '--porcelain', 'src/'], 
                              capture_output=True, text=True)
        return result.stdout.strip()
    except:
        return ""

def parse_file_simple(file_path):
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        import re
        
        facts = {
            'imports': [],
            'functions': [],
            'components': [],
            'stores': [],
            'file_path': file_path
        }
        
        import_pattern = r'import\s+(?:{([^}]+)}|(\w+))\s+from\s+[\'"]([^\'"]+)[\'"]'
        for match in re.finditer(import_pattern, content):
            if match.group(1):
                names = [n.strip() for n in match.group(1).split(',')]
                source = match.group(3)
                for name in names:
                    facts['imports'].append({'name': name, 'from': source})
            elif match.group(2):
                facts['imports'].append({'name': match.group(2), 'from': match.group(3)})
        
        func_pattern = r'(?:export\s+)?(?:async\s+)?function\s+(\w+)'
        facts['functions'] = re.findall(func_pattern, content)
        
        comp_pattern = r'(?:export\s+)?const\s+(\w+)\s*=\s*\([^)]*\)\s*=>'
        facts['components'] = re.findall(comp_pattern, content)
        
        store_pattern = r'(?:export\s+)?const\s+(\w+Store)\s*='
        facts['stores'] = re.findall(store_pattern, content)
        
        return facts
    except:
        return None

def parse_file_with_tree_sitter(file_path):
    if not TREE_SITTER_AVAILABLE:
        return parse_file_simple(file_path)
    
    try:
        with open(file_path, 'rb') as f:
            code = f.read()
        
        if file_path.endswith(('.tsx', '.jsx')):
            parser = get_parser('tsx')
        elif file_path.endswith('.ts'):
            parser = get_parser('typescript')
        else:
            parser = get_parser('javascript')
        
        tree = parser.parse(code)
        
        facts = {
            'imports': [],
            'functions': [],
            'components': [],
            'stores': [],
            'file_path': file_path
        }
        
        def extract_text(node):
            return code[node.start_byte:node.end_byte].decode('utf-8', errors='ignore')
        
        def visit(node):
            if node.type == 'import_statement':
                try:
                    for child in node.children:
                        if child.type == 'string':
                            source = extract_text(child).strip('"\'')
                            for n in node.children:
                                if n.type == 'import_clause':
                                    for spec in n.children:
                                        if spec.type in ['identifier', 'import_specifier']:
                                            name = extract_text(spec).split(' as ')[0].strip()
                                            facts['imports'].append({'name': name, 'from': source})
                except:
                    pass
            
            if node.type in ['function_declaration', 'function_expression']:
                try:
                    for child in node.children:
                        if child.type == 'identifier':
                            facts['functions'].append(extract_text(child))
                            break
                except:
                    pass
            
            if node.type == 'lexical_declaration':
                try:
                    for child in node.children:
                        if child.type == 'variable_declarator':
                            name_node = child.child_by_field_name('name')
                            if name_node:
                                name = extract_text(name_node)
                                value_node = child.child_by_field_name('value')
                                if value_node:
                                    value_text = extract_text(value_node)
                                    if 'createStore' in value_text or 'Store' in name:
                                        facts['stores'].append(name)
                                    elif '=>' in value_text:
                                        facts['components'].append(name)
                except:
                    pass
            
            for child in node.children:
                visit(child)
        
        visit(tree.root_node)
        return facts if facts['imports'] or facts['functions'] else parse_file_simple(file_path)
    except:
        return parse_file_simple(file_path)

def build_symbol_index():
    global symbol_index
    symbol_index = {}
    
    for filepath, facts in parsed_code_map.items():
        for func in facts.get('functions', []):
            symbol_index.setdefault(func, {'defined_in': [], 'used_in': []})
            if filepath not in symbol_index[func]['defined_in']:
                symbol_index[func]['defined_in'].append(filepath)
        
        for comp in facts.get('components', []):
            symbol_index.setdefault(comp, {'defined_in': [], 'used_in': []})
            if filepath not in symbol_index[comp]['defined_in']:
                symbol_index[comp]['defined_in'].append(filepath)
        
        for store in facts.get('stores', []):
            symbol_index.setdefault(store, {'defined_in': [], 'used_in': []})
            if filepath not in symbol_index[store]['defined_in']:
                symbol_index[store]['defined_in'].append(filepath)
        
        for imp in facts.get('imports', []):
            name = imp['name']
            symbol_index.setdefault(name, {'defined_in': [], 'used_in': []})
            if filepath not in symbol_index[name]['used_in']:
                symbol_index[name]['used_in'].append(filepath)

def refresh_tree(force_print=False):
    global cached_tree, parsed_code_map
    
    print(f"{CYAN}🔄 Refreshing...{RESET}")
    
    ls_result = subprocess.run(['ls', 'src/'], capture_output=True, text=True)
    tree_result = subprocess.run(['tree', 'src/'], capture_output=True, text=True)
    
    cached_tree = f"""DIRECTORY STRUCTURE:

$ ls src/
{ls_result.stdout.strip()}

$ tree src/
{tree_result.stdout.strip()}
"""
    
    git_status = get_git_status()
    if git_status:
        cached_tree += f"\n\n📝 UNCOMMITTED:\n{git_status}\n"
    
    if force_print or not conversation_history:
        print(f"{CYAN}{cached_tree}{RESET}")
    
    print(f"{YELLOW}🌳 Parsing...{RESET}")
    parsed_code_map = {}
    
    files = glob.glob('src/**/*.ts', recursive=True) + \
            glob.glob('src/**/*.tsx', recursive=True) + \
            glob.glob('src/**/*.jsx', recursive=True) + \
            glob.glob('src/**/*.js', recursive=True)
    
    parsed_count = 0
    for filepath in files:
        if os.path.isfile(filepath):
            facts = parse_file_with_tree_sitter(filepath)
            if facts and (facts['imports'] or facts['functions'] or facts['components'] or facts['stores']):
                parsed_code_map[filepath] = facts
                parsed_count += 1
    
    build_symbol_index()
    print(f"{GREEN}✅ Parsed {parsed_count}/{len(files)} files, {len(symbol_index)} symbols{RESET}\n")

refresh_tree(force_print=True)

# === TOOLS ===

def tool_find_usages(symbol):
    if symbol not in symbol_index:
        return {"error": f"Symbol '{symbol}' not found"}
    
    data = symbol_index[symbol]
    return {
        "symbol": symbol,
        "defined_in": [f.replace('src/', '') for f in data['defined_in']],
        "used_in": [f.replace('src/', '') for f in data['used_in']],
        "usage_count": len(data['used_in'])
    }

def tool_list_stores():
    stores = {k: v for k, v in symbol_index.items() if 'store' in k.lower()}
    return {
        "count": len(stores),
        "stores": [
            {
                "name": name,
                "defined_in": data['defined_in'][0].replace('src/', '') if data['defined_in'] else None,
                "usage_count": len(data['used_in'])
            }
            for name, data in sorted(stores.items())
        ]
    }

def tool_list_components():
    components = {}
    for filepath, facts in parsed_code_map.items():
        for comp in facts.get('components', []):
            if comp in symbol_index:
                components[comp] = symbol_index[comp]
    
    return {
        "count": len(components),
        "components": [
            {
                "name": name,
                "defined_in": data['defined_in'][0].replace('src/', '') if data['defined_in'] else None,
                "usage_count": len(data['used_in'])
            }
            for name, data in sorted(components.items())
        ]
    }

def tool_semantic_search(query, limit=5):
    query_embedding = model.encode(query).tolist()
    conn = psycopg2.connect(os.getenv("COCOINDEX_DATABASE_URL"))
    cur = conn.cursor()
    cur.execute("""
        SELECT filename, code,
               1 - (embedding <=> %s::vector) as similarity
        FROM codebaseindex__codebase_embeddings
        ORDER BY similarity DESC
        LIMIT %s
    """, (query_embedding, limit))
    results = cur.fetchall()
    conn.close()

    return {
        "query": query,
        "results": [
            {
                "filename": r[0].replace('src/', ''),
                "code": r[1][:400] + "..." if len(r[1]) > 400 else r[1],
                "similarity": f"{r[2]*100:.1f}%"
            }
            for r in results
        ]
    }

TOOLS = [
    {
        "name": "find_usages",
        "description": "Find where a symbol is defined/used. Use for: 'where is X used', 'what uses X', 'find X'.",
        "input_schema": {
            "type": "object",
            "properties": {
                "symbol": {"type": "string", "description": "Symbol name (e.g., 'authStore', 'useAuth')"}
            },
            "required": ["symbol"]
        }
    },
    {
        "name": "list_stores",
        "description": "List all stores. Use for: 'show stores', 'list stores', 'what stores exist'.",
        "input_schema": {"type": "object", "properties": {}, "required": []}
    },
    {
        "name": "list_components",
        "description": "List all components. Use for: 'show components', 'list components'.",
        "input_schema": {"type": "object", "properties": {}, "required": []}
    },
    {
        "name": "semantic_search",
        "description": "Search by meaning/intent. Use for: 'how does X work', 'show error handling', 'find validation'.",
        "input_schema": {
            "type": "object",
            "properties": {
                "query": {"type": "string", "description": "What to search for"},
                "limit": {"type": "integer", "default": 5}
            },
            "required": ["query"]
        }
    }
]

def execute_tool(tool_name, tool_input):
    if tool_name == "find_usages":
        return tool_find_usages(tool_input["symbol"])
    elif tool_name == "list_stores":
        return tool_list_stores()
    elif tool_name == "list_components":
        return tool_list_components()
    elif tool_name == "semantic_search":
        return tool_semantic_search(tool_input["query"], tool_input.get("limit", 5))
    return {"error": f"Unknown tool: {tool_name}"}

def process_query(query):
    print(f"\n{CYAN}🤖 Processing: {query[:60]}...{RESET}")
    
    # Fresh messages EVERY TIME - no history pollution!
    messages = [{
        "role": "user",
        "content": f"""TASK: {query}

Context: {len(symbol_index)} symbols indexed, {len(parsed_code_map)} files parsed.

Use tools to answer. Call multiple tools if needed for multi-part questions."""
    }]
    
    response = client.messages.create(
        model="claude-sonnet-4-20250514",
        max_tokens=4096,
        tools=TOOLS,
        messages=messages
    )
    
    # Tool execution loop
    while response.stop_reason == "tool_use":
        for block in response.content:
            if block.type == "tool_use":
                print(f"{GREEN}🛠️  {block.name}({json.dumps(block.input)}){RESET}")
                result = execute_tool(block.name, block.input)
                
                messages.append({"role": "assistant", "content": response.content})
                messages.append({
                    "role": "user",
                    "content": [{
                        "type": "tool_result",
                        "tool_use_id": block.id,
                        "content": json.dumps(result)
                    }]
                })
        
        response = client.messages.create(
            model="claude-sonnet-4-20250514",
            max_tokens=4096,
            tools=TOOLS,
            messages=messages
        )
    
    # Get final answer
    final_text = "".join([b.text for b in response.content if b.type == "text"])
    
    print(f"\n{BLUE}{'='*70}{RESET}")
    print(final_text)
    print(f"{BLUE}{'='*70}{RESET}\n")
    
    # Save only final Q&A (no tool artifacts)
    conversation_history.append({"role": "user", "content": query})
    conversation_history.append({"role": "assistant", "content": final_text})

def main():
    print(f"\n{YELLOW}{'='*70}{RESET}")
    print(f"{YELLOW}{BOLD}💡 AI CODE ASSISTANT v9.1{RESET}")
    print(f"{YELLOW}{'='*70}{RESET}\n")

    while True:
        try:
            query = input(f"{BOLD}{GREEN}>{RESET} ").strip()
            
            if not query:
                continue
            if query.lower() in ['quit', 'exit', 'q']:
                print(f"\n{CYAN}👋 Goodbye!{RESET}\n")
                break
            if query.lower() == '!refresh-tree':
                refresh_tree(True)
                continue
            if query.lower() == 'reindex':
                print(f"\n{CYAN}Run: python tools/index_codebase.py{RESET}\n")
                continue
            
            process_query(query)

        except KeyboardInterrupt:
            print(f"\n\n{CYAN}👋 Goodbye!{RESET}\n")
            break
        except Exception as e:
            print(f"\n{RED}⚠️  {e}{RESET}\n")
            import traceback
            traceback.print_exc()

if __name__ == "__main__":
    main()
