"""Query orchestration with session persistence"""

import os
import json
import time
from ...capabilities import TOOLS, execute_tool
from ...core.config import COLORS
from ...indexing.cache import get_cache_stats


def serialize_content(content):
    """Convert response content blocks to JSON-serializable format"""
    if isinstance(content, list):
        serialized = []
        for block in content:
            if hasattr(block, 'type'):
                # Convert Anthropic block objects to dicts
                if block.type == 'text':
                    serialized.append({
                        'type': 'text',
                        'text': block.text
                    })
                elif block.type == 'tool_use':
                    serialized.append({
                        'type': 'tool_use',
                        'id': block.id,
                        'name': block.name,
                        'input': block.input
                    })
                # Skip ThinkingBlock and other non-essential blocks
            else:
                serialized.append(block)
        return serialized
    return content


def process_query(
    query_text,
    context,
    symbol_index,
    parsed_files,
    anthropic_client,
    embedding_model,
    db_url,
    session_manager,
    session_id,
):
    """Process a user query with LLM and tools (with session persistence)"""
    start_time = time.time()
    print(f"\n{COLORS['CYAN']}🤖 Processing: {query_text[:60]}...{COLORS['RESET']}")

    # Load existing messages from session
    messages = session_manager.load_session(session_id)

    # If new session, build initial message with orchestration rules
    if not messages:
        # Load agent orchestration rules
        orchestration_dir = os.path.join(os.path.dirname(__file__), "../../agent-orchestration")

        # Load all 5 phase files
        phases = []
        phase_files = {
            1: "phase-1-exploration.md",
            2: "phase-2-findings.md",
            3: "phase-3-planning.md",
            4: "phase-4-visual-map.md",
            5: "phase-5-approval.md",
        }
        for phase_num in range(1, 6):
            phase_file = os.path.join(orchestration_dir, phase_files[phase_num])
            if os.path.exists(phase_file):
                with open(phase_file) as f:
                    phases.append(f.read())

        # CRITICAL: Sequential execution forcing instruction
        sequential_instruction = """
═══════════════════════════════════════════════════════════════
CRITICAL EXECUTION REQUIREMENT - READ THIS FIRST
═══════════════════════════════════════════════════════════════

YOU MUST OUTPUT ALL 5 PHASES IN EXACT SEQUENTIAL ORDER.
YOU CANNOT SKIP ANY PHASE. EACH PHASE IS MANDATORY.

Your response MUST contain these 5 exact phase headers in this order:
1. "PHASE 1: EXPLORATION" (with tool calls)
2. "PHASE 2: FINDINGS & ANALYSIS" (with 3 approaches)
3. "PHASE 3: DETAILED PLANNING" (with steps, checklist, self-critique)
4. "PHASE 4: VISUAL IMPLEMENTATION MAP" (with annotated tree)
5. "PHASE 5: APPROVAL" (with confidence assessment)

If ANY phase header is missing from your response, your response is INVALID.
If you skip from Phase 1 directly to Phase 4, your response is INVALID.

You must COMPLETE each phase BEFORE moving to the next phase.
═══════════════════════════════════════════════════════════════
"""

        # Combine all phases with explicit Phase 1 instruction
        phase1_header = """
CRITICAL INSTRUCTION FOR ALL PLANNING QUESTIONS:

Before using ANY tools, you MUST first output this exact header:
```
═══════════════════════════════════════════════════════════════
PHASE 1: EXPLORATION
═══════════════════════════════════════════════════════════════

Building complete understanding of codebase...
```

Then proceed with tool calls as described in Phase 1.
"""
        planning_rules = sequential_instruction + "\n\n" + phase1_header + "\n\n" + "\n\n".join(phases)

        # Load output templates
        with open(os.path.join(orchestration_dir, "output-templates.md")) as f:
            output_templates = f.read()

        # Auto-detect if this is a planning/implementation query
        planning_keywords = [
            "plan", "implement", "add", "create", "build", "refactor", 
            "feature", "modify", "change", "update", "design", "architect"
        ]
        is_planning_query = any(keyword in query_text.lower() for keyword in planning_keywords)
        
        # Set temperature based on query type
        temperature = 0.7 if is_planning_query else 0.2
        
        print(f"{COLORS['YELLOW']}🎯 Mode: {'Planning' if is_planning_query else 'Query'} (temp={temperature}){COLORS['RESET']}")

        # Build initial message with orchestration rules
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

{context}

Parsed: {len(symbol_index)} symbols from {len(parsed_files)} files.

Available tools: find_usages, list_stores, list_components, semantic_search,
run_shell_command, view, git_log, git_blame, git_recent_changes,
git_contributors, git_diff, dependency_graph, format_code

Use tools strategically. For planning questions: explore → findings → plan → visual tree → approve.
For simple queries: just answer.""",
            }
        ]

        print(f"{COLORS['YELLOW']}🆕 New session: {session_id[:20]}...{COLORS['RESET']}")
    else:
        # Existing session - just append new query
        messages.append({
            "role": "user",
            "content": query_text
        })
        print(f"{COLORS['GREEN']}↩️  Resuming session: {session_id[:20]}... ({len(messages)} messages){COLORS['RESET']}")
        
        # For existing sessions, use lower temperature for consistency
        temperature = 0.2

    # Determine temperature for new sessions
    if not messages or len(messages) == 1:
        planning_keywords = [
            "plan", "implement", "add", "create", "build", "refactor", 
            "feature", "modify", "change", "update", "design", "architect"
        ]
        is_planning_query = any(keyword in query_text.lower() for keyword in planning_keywords)
        temperature = 0.7 if is_planning_query else 0.2
    else:
        temperature = 0.2

    # Initial call - Using MiniMax-M2.1
    response = anthropic_client.messages.create(
        model="MiniMax-M2.1",
        max_tokens=8192,
        temperature=temperature,
        top_p=0.95,
        top_k=40,
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

        # Serialize response content before appending
        serialized_content = serialize_content(response.content)
        messages.append({"role": "assistant", "content": serialized_content})
        messages.append({"role": "user", "content": tool_results})

        # Continue conversation
        response = anthropic_client.messages.create(
            model="MiniMax-M2.1",
            max_tokens=8192,
            temperature=temperature,
            top_p=0.95,
            top_k=40,
            tools=TOOLS,
            messages=messages,
        )

    # Extract final answer
    final_text = "".join([b.text for b in response.content if b.type == "text"])

    print(f"\n{COLORS['BLUE']}{'=' * 70}{COLORS['RESET']}")
    print(final_text)
    print(f"{COLORS['BLUE']}{'=' * 70}{COLORS['RESET']}")

    # Serialize final response content before saving
    serialized_final = serialize_content(response.content)
    messages.append({"role": "assistant", "content": serialized_final})

    # Save session to Redis
    session_manager.save_session(session_id, messages)
    print(f"{COLORS['CYAN']}💾 Session saved (expires in 45 min){COLORS['RESET']}")

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
