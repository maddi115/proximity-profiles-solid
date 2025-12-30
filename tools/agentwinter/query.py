import os

"""Query orchestration - LLM + tool execution"""

import json
import time
from .tools import TOOLS, execute_tool
from .config import COLORS
from .cache import get_cache_stats


def process_query(
    query_text,
    context,
    symbol_index,
    parsed_files,
    anthropic_client,
    embedding_model,
    db_url,
):
    """Process a user query with LLM and tools"""
    start_time = time.time()
    print(f"\n{COLORS['CYAN']}🤖 Processing: {query_text[:60]}...{COLORS['RESET']}")

    # Load agent orchestration rules
    orchestration_dir = os.path.join(os.path.dirname(__file__), "agent-orchestration")

    with open(os.path.join(orchestration_dir, "planning-behavior.md")) as f:
        planning_rules = f.read()

    with open(os.path.join(orchestration_dir, "output-templates.md")) as f:
        output_templates = f.read()

    # Build messages with orchestration rules
    messages = [
        {
            "role": "user",
            "content": f"""{planning_rules}

{output_templates}

═══════════════════════════════════════════════════════════════
CURRENT TASK:
═══════════════════════════════════════════════════════════════

{query_text}

═══════════════════════════════════════════════════════════════
PROJECT CONTEXT:
═══════════════════════════════════════════════════════════════

{context[:2000]}

Parsed: {len(symbol_index)} symbols from {len(parsed_files)} files.

Available tools: find_usages, list_stores, list_components, semantic_search, 
run_shell_command, view, git_log, git_blame, git_recent_changes, 
git_contributors, git_diff, dependency_graph, format_code

Use tools strategically. For planning questions: explore → findings → plan → visual tree → approve.
For simple queries: just answer.""",
        }
    ]

    # Initial call
    response = anthropic_client.messages.create(
        model="claude-sonnet-4-20250514",
        max_tokens=4096,
        tools=TOOLS,
        messages=messages,
    )

    # Tool execution loop
    while response.stop_reason == "tool_use":
        # Collect ALL tool results first
        tool_results = []

        for block in response.content:
            if block.type == "tool_use":
                print(
                    f"{COLORS['GREEN']}🛠️  {block.name}({json.dumps(block.input)}){COLORS['RESET']}"
                )

                result = execute_tool(
                    block.name,
                    block.input,
                    symbol_index,
                    parsed_files,
                    embedding_model,
                    db_url,
                )

                tool_results.append(
                    {
                        "type": "tool_result",
                        "tool_use_id": block.id,
                        "content": json.dumps(result),
                    }
                )

        # Now append messages ONCE with ALL tool results
        messages.append({"role": "assistant", "content": response.content})
        messages.append({"role": "user", "content": tool_results})

        # Continue conversation
        response = anthropic_client.messages.create(
            model="claude-sonnet-4-20250514",
            max_tokens=4096,
            tools=TOOLS,
            messages=messages,
        )

    # Extract final answer
    final_text = "".join([b.text for b in response.content if b.type == "text"])

    print(f"\n{COLORS['BLUE']}{'=' * 70}{COLORS['RESET']}")
    print(final_text)
    print(f"{COLORS['BLUE']}{'=' * 70}{COLORS['RESET']}")

    # Show timing and cache stats
    elapsed_time = time.time() - start_time
    stats = get_cache_stats()

    timing_str = ""
    if elapsed_time < 1:
        timing_str = (
            f"{COLORS['YELLOW']}⚡ {elapsed_time * 1000:.0f}ms{COLORS['RESET']}"
        )
    else:
        timing_str = f"{COLORS['YELLOW']}⏱️  {elapsed_time:.2f}s{COLORS['RESET']}"

    cache_str = ""
    if stats["parse_cache_size"] > 0 or stats["search_cache_size"] > 0:
        cache_str = f" {COLORS['CYAN']}| 📊 Cache: {stats['parse_cache_size']} files, {
            stats['search_cache_size']
        } queries{COLORS['RESET']}"

    print(f"{timing_str}{cache_str}")
    print()

    return final_text
