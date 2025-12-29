"""Main CLI loop and user interaction"""
from .config import get_anthropic_client, get_embedding_model, get_db_url, COLORS
from .context import build_full_context
from .parser import parse_all_files
from .indexer import build_index
from .query import process_query

def refresh_all():
    """Refresh context, parse files, build index"""
    print(f"{COLORS['CYAN']}🔄 Refreshing...{COLORS['RESET']}")
    
    # Build context
    context = build_full_context()
    print(f"{COLORS['CYAN']}{context}{COLORS['RESET']}")
    
    # Parse files
    print(f"{COLORS['YELLOW']}🌳 Parsing...{COLORS['RESET']}")
    parsed_files, parsed_count, total_files = parse_all_files()
    
    # Build index
    symbol_index = build_index(parsed_files)
    
    print(f"{COLORS['GREEN']}✅ Parsed {parsed_count}/{total_files} files, {len(symbol_index)} symbols{COLORS['RESET']}\n")
    
    return context, parsed_files, symbol_index

def main():
    """Main entry point"""
    # Setup
    anthropic_client = get_anthropic_client()
    embedding_model = get_embedding_model()
    db_url = get_db_url()
    
    # Initial refresh
    context, parsed_files, symbol_index = refresh_all()
    
    # CLI header
    print(f"\n{COLORS['YELLOW']}{'='*70}{COLORS['RESET']}")
    print(f"{COLORS['YELLOW']}{COLORS['BOLD']}💡 AGENTWINTER - Project Context Aware{COLORS['RESET']}")
    print(f"{COLORS['YELLOW']}{'='*70}{COLORS['RESET']}\n")
    
    conversation_history = []
    
    # Main loop
    while True:
        try:
            query = input(f"{COLORS['BOLD']}{COLORS['GREEN']}>{COLORS['RESET']} ").strip()
            
            if not query:
                continue
            
            if query.lower() in ['quit', 'exit', 'q']:
                print(f"\n{COLORS['CYAN']}👋 Goodbye!{COLORS['RESET']}\n")
                break
            
            if query.lower() == '!refresh-tree':
                context, parsed_files, symbol_index = refresh_all()
                continue
            
            if query.lower() == 'reindex':
                print(f"\n{COLORS['CYAN']}Run: python tools/index_codebase.py{COLORS['RESET']}\n")
                continue
            
            # Process query
            answer = process_query(
                query, 
                context, 
                symbol_index, 
                parsed_files, 
                anthropic_client, 
                embedding_model, 
                db_url
            )
            
            # Save to history
            conversation_history.append({"role": "user", "content": query})
            conversation_history.append({"role": "assistant", "content": answer})
        
        except KeyboardInterrupt:
            print(f"\n\n{COLORS['CYAN']}👋 Goodbye!{COLORS['RESET']}\n")
            break
        except Exception as e:
            print(f"\n{COLORS['RED']}⚠️  {e}{COLORS['RESET']}\n")
            import traceback
            traceback.print_exc()
