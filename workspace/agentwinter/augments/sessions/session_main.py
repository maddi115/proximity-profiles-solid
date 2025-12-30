"""Main entry point with session management"""

import sys
from ...core.config import get_anthropic_client, get_embedding_model, get_db_url, COLORS
from ...indexing.auto_refresh import auto_refresh
from ...core.context import build_full_context
from ...indexing.parser import parse_all_files
from ...indexing.indexer import build_index
from ...indexing.file_watcher import FileWatcher
from ...indexing.cache import get_cache_stats, clear_all_caches
from .session_config import get_redis_client
from .session_manager import SessionManager, generate_session_id
from .session_query import process_query


def rebuild_context_and_index():
    """Rebuild context, parsed files, and symbol index"""
    context = build_full_context()
    parsed_files, parsed_count, total_files = parse_all_files()
    symbol_index = build_index(parsed_files)
    return context, parsed_files, symbol_index


def handle_file_change(
    file_path, event_type, context_ref, parsed_files_ref, symbol_index_ref
):
    """Handle file change events"""
    print(f"\n{COLORS['YELLOW']}📝 {event_type.title()}: {file_path}{COLORS['RESET']}")
    print(f"{COLORS['CYAN']}🔄 Re-parsing...{COLORS['RESET']}")

    try:
        # Re-parse all files
        new_context, new_parsed_files, new_symbol_index = rebuild_context_and_index()

        # Update references (can't reassign, must modify in place)
        context_ref["value"] = new_context
        parsed_files_ref.clear()
        parsed_files_ref.update(new_parsed_files)
        symbol_index_ref.clear()
        symbol_index_ref.update(new_symbol_index)

        print(
            f"{COLORS['GREEN']}✅ Updated! ({len(new_symbol_index)} symbols){
                COLORS['RESET']
            }\n"
        )
    except Exception as e:
        print(f"{COLORS['RED']}⚠️  Re-parse failed: {e}{COLORS['RESET']}\n")


def main():
    """Main entry point with session persistence"""
    # Check for --watch flag
    watch_mode = "--watch" in sys.argv

    # Initial setup
    context, parsed_files, symbol_index = rebuild_context_and_index()

    # Auto-refresh CocoIndex and static docs
    auto_refresh()

    print("=" * 70)
    print(f"{COLORS['CYAN']}💡 AGENTWINTER - With Session Persistence{COLORS['RESET']}")
    print("=" * 70)

    # Start file watcher if in watch mode
    watcher = None
    if watch_mode:
        try:
            # Use dict for context to allow mutation in callback
            context_ref = {"value": context}

            watcher = FileWatcher(
                watch_path="src/",
                on_change_callback=lambda path, event: handle_file_change(
                    path, event, context_ref, parsed_files, symbol_index
                ),
            )
            watcher.start()
        except Exception as e:
            print(
                f"{COLORS['YELLOW']}⚠️  File watching unavailable: {e}{COLORS['RESET']}"
            )
            print(f"{COLORS['YELLOW']}   Running in normal mode{COLORS['RESET']}")

    # Get API clients
    client = get_anthropic_client()
    embedding_model = get_embedding_model()
    db_url = get_db_url()
    
    # Get Redis client and create session manager
    redis_client = get_redis_client()
    session_manager = SessionManager(redis_client)
    
    # Generate initial session ID
    current_session_id = generate_session_id()
    print(f"{COLORS['CYAN']}📝 Session: {current_session_id[:24]}...{COLORS['RESET']}")

    # Main loop
    try:
        while True:
            query = input(f"\n{COLORS['BOLD']}> {COLORS['RESET']}")

            if not query.strip():
                continue

            if query.lower() in ["exit", "quit", "q"]:
                break

            if query == "!refresh":
                print(f"{COLORS['CYAN']}🔄 Refreshing...{COLORS['RESET']}")
                if watch_mode:
                    context, parsed_files, symbol_index = rebuild_context_and_index()
                    context_ref["value"] = context
                else:
                    context, parsed_files, symbol_index = rebuild_context_and_index()
                print(f"{COLORS['GREEN']}✅ Refreshed!{COLORS['RESET']}")
                continue
                
            if query == "!new":
                # Start a new session
                current_session_id = generate_session_id()
                print(f"{COLORS['GREEN']}🆕 New session: {current_session_id[:24]}...{COLORS['RESET']}")
                continue
                
            if query == "!sessions":
                # List all sessions
                sessions = session_manager.list_sessions()
                if sessions:
                    print(f"{COLORS['CYAN']}📋 Active sessions:{COLORS['RESET']}")
                    for s in sessions:
                        print(f"  - {s['id'][:24]}... ({s['message_count']} msgs, expires in {s['expires_in']}s)")
                else:
                    print(f"{COLORS['YELLOW']}No active sessions{COLORS['RESET']}")
                continue
                
            if query == "!cache":
                stats = get_cache_stats()
                print(f"{COLORS['CYAN']}📊 Cache Statistics:{COLORS['RESET']}")
                print(f"  Parse cache: {stats['parse_cache_size']} files")
                print(f"  Search cache: {stats['search_cache_size']} queries")
                print(f"  Embedding cache: {stats['embedding_cache_size']} embeddings")
                continue

            if query == "!clear-cache":
                clear_all_caches()
                print(f"{COLORS['GREEN']}✅ All caches cleared{COLORS['RESET']}")
                continue

            # Use context from ref if in watch mode
            current_context = context_ref["value"] if watch_mode else context

            # Process query with session
            process_query(
                query,
                current_context,
                symbol_index,
                parsed_files,
                client,
                embedding_model,
                db_url,
                session_manager,
                current_session_id,
            )

    except KeyboardInterrupt:
        print(f"\n\n{COLORS['YELLOW']}👋 Goodbye!{COLORS['RESET']}")

    finally:
        # Stop file watcher
        if watcher:
            watcher.stop()


if __name__ == "__main__":
    main()
