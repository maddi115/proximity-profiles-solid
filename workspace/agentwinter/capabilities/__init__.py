"""Tool registry and execution"""

from .find_usages import find_usages
from .list_stores import list_stores
from .list_components import list_components
from .semantic_search import semantic_search
from .run_treesitter_query import run_treesitter_query
from .shell_execution import run_shell_command
from .dependency_graph import dependency_graph
from .format_code import format_code
from .git_history import (
    git_log,
    git_blame,
    git_recent_changes,
    git_contributors,
    git_diff,
)

TOOLS = [
    {
        "name": "find_usages",
        "description": "Find where a symbol is defined/used. Use for: 'where is X used', 'what uses X', 'find X'.",
        "input_schema": {
            "type": "object",
            "properties": {
                "symbol": {
                    "type": "string",
                    "description": "Symbol name (e.g., 'authStore', 'useAuth')",
                }
            },
            "required": ["symbol"],
        },
    },
    {
        "name": "list_stores",
        "description": "List all stores. Use for: 'show stores', 'list stores', 'what stores exist'.",
        "input_schema": {"type": "object", "properties": {}, "required": []},
    },
    {
        "name": "list_components",
        "description": "List all components. Use for: 'show components', 'list components'.",
        "input_schema": {"type": "object", "properties": {}, "required": []},
    },
    {
        "name": "semantic_search",
        "description": "Search by meaning/intent. Use for: 'how does X work', 'show error handling', 'find validation'.",
        "input_schema": {
            "type": "object",
            "properties": {
                "query": {"type": "string", "description": "What to search for"},
                "limit": {"type": "integer", "default": 5},
            },
            "required": ["query"],
        },
    },
    {
        "name": "run_treesitter_query",
        "description": "Execute custom Tree-sitter S-expression query for complex patterns. Use when standard tools insufficient.",
        "input_schema": {
            "type": "object",
            "properties": {
                "query_pattern": {
                    "type": "string",
                    "description": "S-expression query",
                },
                "language": {"type": "string", "default": "tsx"},
                "max_results": {"type": "integer", "default": 20},
            },
            "required": ["query_pattern"],
        },
    },
    {
        "name": "run_shell_command",
        "description": "Execute safe shell commands for generating static documentation or reading project files.",
        "input_schema": {
            "type": "object",
            "properties": {
                "command": {"type": "string", "description": "Command to execute"}
            },
            "required": ["command"],
        },
    },
    {
        "name": "git_log",
        "description": "Show git commit history for a file. Use for: 'show me history of X', 'who changed X', 'commits for X'.",
        "input_schema": {
            "type": "object",
            "properties": {
                "file_path": {
                    "type": "string",
                    "description": "Path to file (e.g., 'src/features/auth/store/authStore.ts')",
                },
                "limit": {"type": "integer", "default": 10},
            },
            "required": ["file_path"],
        },
    },
    {
        "name": "git_blame",
        "description": "Show who last modified each line. Use for: 'who wrote this', 'blame for X', 'line authors'.",
        "input_schema": {
            "type": "object",
            "properties": {
                "file_path": {"type": "string", "description": "Path to file"},
                "start_line": {"type": "integer"},
                "end_line": {"type": "integer"},
            },
            "required": ["file_path"],
        },
    },
    {
        "name": "git_recent_changes",
        "description": "Get recent commits. Use for: 'what changed recently', 'commits this week', 'recent changes in X'.",
        "input_schema": {
            "type": "object",
            "properties": {
                "since": {"type": "string", "default": "1 week"},
                "path": {"type": "string"},
            },
            "required": [],
        },
    },
    {
        "name": "git_contributors",
        "description": "List contributors. Use for: 'who contributes to X', 'show contributors', 'code ownership'.",
        "input_schema": {
            "type": "object",
            "properties": {"path": {"type": "string"}},
            "required": [],
        },
    },
    {
        "name": "git_diff",
        "description": "Show differences between commits. Use for: 'what changed in X', 'diff between commits'.",
        "input_schema": {
            "type": "object",
            "properties": {
                "file_path": {"type": "string"},
                "commit1": {"type": "string", "default": "HEAD~1"},
                "commit2": {"type": "string", "default": "HEAD"},
            },
            "required": ["file_path"],
        },
    },
    {
        "name": "dependency_graph",
        "description": "Generate visual dependency graphs. Use for: 'show dependency graph', 'visualize dependencies', 'graph architecture'. Creates mermaid diagrams.",
        "input_schema": {
            "type": "object",
            "properties": {
                "graph_type": {
                    "type": "string",
                    "enum": ["feature", "store", "cross-feature"],
                    "description": "Type of graph: 'feature' (one feature), 'store' (store dependencies), 'cross-feature' (all features)",
                },
                "target": {
                    "type": "string",
                    "description": "Target name (feature name like 'proximity', or store name like 'authStore')",
                },
            },
            "required": ["graph_type"],
        },
    },
    {
        "name": "format_code",
        "description": "Format Python code files. Use for: 'format the code', 'run black', 'fix formatting', 'clean up python files'.",
        "input_schema": {
            "type": "object",
            "properties": {
                "formatter": {
                    "type": "string",
                    "enum": ["black", "autopep8", "ruff", "all"],
                    "default": "all",
                    "description": "Formatter to use: 'black' (most popular), 'autopep8' (PEP8), 'ruff' (fast), 'all' (runs all)",
                },
                "target_path": {
                    "type": "string",
                    "default": "workspace/agentwinter/",
                    "description": "Path to format (default: tools/agentwinter/)",
                },
            },
            "required": [],
        },
    },
]


def execute_tool(
    tool_name, tool_input, symbol_index, parsed_files, embedding_model, db_url
):
    """Execute a tool by name"""
    if tool_name == "find_usages":
        return find_usages(tool_input["symbol"], symbol_index)
    elif tool_name == "list_stores":
        return list_stores(symbol_index)
    elif tool_name == "list_components":
        return list_components(symbol_index, parsed_files)
    elif tool_name == "semantic_search":
        return semantic_search(
            tool_input["query"], embedding_model, db_url, tool_input.get("limit", 5)
        )
    elif tool_name == "run_treesitter_query":
        return run_treesitter_query(
            tool_input["query_pattern"],
            tool_input.get("language", "tsx"),
            tool_input.get("max_results", 20),
        )
    elif tool_name == "run_shell_command":
        return run_shell_command(tool_input["command"])
    elif tool_name == "git_log":
        return git_log(tool_input["file_path"], tool_input.get("limit", 10))
    elif tool_name == "git_blame":
        return git_blame(
            tool_input["file_path"],
            tool_input.get("start_line"),
            tool_input.get("end_line"),
        )
    elif tool_name == "git_recent_changes":
        return git_recent_changes(
            tool_input.get("since", "1 week"), tool_input.get("path")
        )
    elif tool_name == "git_contributors":
        return git_contributors(tool_input.get("path"))
    elif tool_name == "git_diff":
        return git_diff(
            tool_input["file_path"],
            tool_input.get("commit1", "HEAD~1"),
            tool_input.get("commit2", "HEAD"),
        )

    elif tool_name == "dependency_graph":
        return dependency_graph(
            tool_input["graph_type"],
            tool_input.get("target"),
            symbol_index,
            parsed_files,
        )

    elif tool_name == "format_code":
        return format_code(
            tool_input.get("formatter", "all"),
            tool_input.get("target_path", "workspace/agentwinter/"),
        )

    return {"error": f"Unknown tool: {tool_name}"}
