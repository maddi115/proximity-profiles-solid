"""Tool registry and execution"""
from .find_usages import find_usages
from .list_stores import list_stores
from .list_components import list_components
from .semantic_search import semantic_search

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
    return {"error": f"Unknown tool: {tool_name}"}
