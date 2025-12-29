"""Tool registry and execution"""
from .find_usages import find_usages
from .list_stores import list_stores
from .list_components import list_components
from .semantic_search import semantic_search
from .run_treesitter_query import run_treesitter_query
from .run_shell_command import run_shell_command

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
    },
    {
        "name": "run_treesitter_query",
        "description": "Execute custom Tree-sitter S-expression query for complex patterns. Use when standard tools insufficient. Examples: find hooks with specific patterns, detect anti-patterns, trace dependency chains. You already know Tree-sitter query syntax.",
        "input_schema": {
            "type": "object",
            "properties": {
                "query_pattern": {
                    "type": "string",
                    "description": "S-expression query like: (call_expression function: (identifier) @fn (#eq? @fn \"useState\"))"
                },
                "language": {"type": "string", "default": "tsx"},
                "max_results": {"type": "integer", "default": 20}
            },
            "required": ["query_pattern"]
        }
    },
    {
        "name": "run_shell_command",
        "description": "Execute safe shell commands for generating static documentation or reading project files. Use when you need to: generate fresh ARCHITECTURE.md and FLOW.md via './analyze-project.sh', read documentation files, check git status. Always safe - only whitelisted commands allowed.",
        "input_schema": {
            "type": "object",
            "properties": {
                "command": {
                    "type": "string",
                    "description": "Command to execute. Safe commands: './analyze-project.sh', 'cat TOOLS.md', 'cat ARCHITECTURE.md', 'git status'"
                }
            },
            "required": ["command"]
        }
    }
]

def execute_tool(tool_name, tool_input, symbol_index, parsed_files, embedding_model, db_url):
    """Execute a tool by name"""
    if tool_name == "find_usages":
        return find_usages(tool_input["symbol"], symbol_index)
    elif tool_name == "list_stores":
        return list_stores(symbol_index)
    elif tool_name == "list_components":
        return list_components(symbol_index, parsed_files)
    elif tool_name == "semantic_search":
        return semantic_search(tool_input["query"], embedding_model, db_url, tool_input.get("limit", 5))
    elif tool_name == "run_treesitter_query":
        return run_treesitter_query(
            tool_input["query_pattern"],
            tool_input.get("language", "tsx"),
            tool_input.get("max_results", 20)
        )
    elif tool_name == "run_shell_command":
        return run_shell_command(tool_input["command"])
    
    return {"error": f"Unknown tool: {tool_name}"}
