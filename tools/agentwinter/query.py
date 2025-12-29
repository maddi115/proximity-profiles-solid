"""Query orchestration - LLM + tool execution"""
import json
from .tools import TOOLS, execute_tool
from .config import COLORS

def process_query(query_text, context, symbol_index, parsed_files, anthropic_client, embedding_model, db_url):
    """Process a user query with LLM and tools"""
    print(f"\n{COLORS['CYAN']}🤖 Processing: {query_text[:60]}...{COLORS['RESET']}")
    
    # Build messages
    messages = [{
        "role": "user",
        "content": f"""TASK: {query_text}

PROJECT CONTEXT (always reference this):
{context[:2000]}

Parsed: {len(symbol_index)} symbols from {len(parsed_files)} files.

Use tools to answer. Call multiple tools if needed."""
    }]
    
    # Initial call
    response = anthropic_client.messages.create(
        model="claude-sonnet-4-20250514",
        max_tokens=4096,
        tools=TOOLS,
        messages=messages
    )
    
    # Tool execution loop
    while response.stop_reason == "tool_use":
        # Collect ALL tool results first
        tool_results = []
        
        for block in response.content:
            if block.type == "tool_use":
                print(f"{COLORS['GREEN']}🛠️  {block.name}({json.dumps(block.input)}){COLORS['RESET']}")
                
                result = execute_tool(
                    block.name, 
                    block.input, 
                    symbol_index, 
                    parsed_files, 
                    embedding_model, 
                    db_url
                )
                
                tool_results.append({
                    "type": "tool_result",
                    "tool_use_id": block.id,
                    "content": json.dumps(result)
                })
        
        # Now append messages ONCE with ALL tool results
        messages.append({"role": "assistant", "content": response.content})
        messages.append({"role": "user", "content": tool_results})
        
        # Continue conversation
        response = anthropic_client.messages.create(
            model="claude-sonnet-4-20250514",
            max_tokens=4096,
            tools=TOOLS,
            messages=messages
        )
    
    # Extract final answer
    final_text = "".join([b.text for b in response.content if b.type == "text"])
    
    print(f"\n{COLORS['BLUE']}{'='*70}{COLORS['RESET']}")
    print(final_text)
    print(f"{COLORS['BLUE']}{'='*70}{COLORS['RESET']}\n")
    
    return final_text
