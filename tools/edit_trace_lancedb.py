#!/usr/bin/env python3
"""
Edit trace system with staleness detection
"""
import lancedb
from datetime import datetime, timezone
from typing import Optional, List
import json
import os

class TraceManager:
    """Manage edit traces with automatic staleness detection"""
    
    def __init__(self, db_path=".lancedb"):
        self.db = lancedb.connect(db_path)
        
        try:
            self.table = self.db.open_table("edit_traces")
        except:
            self.table = None
    
    def add(self, query: str, summary: str, files: List[str] = None, 
            change: str = None, applied: bool = True, status: str = "active"):
        """Add a new trace"""
        
        # Generate embedding for summary
        from sentence_transformers import SentenceTransformer
        model = SentenceTransformer('nomic-ai/nomic-embed-text-v1.5', trust_remote_code=True)
        summary_vector = model.encode(summary).tolist()
        
        trace_data = {
            "query": query,
            "summary": summary,
            "summary_vector": summary_vector,
            "timestamp": datetime.now(timezone.utc).isoformat(),
            "files_modified": json.dumps(files or []),
            "change_applied": change or "",
            "applied": applied,  # NEW: Was this actually implemented?
            "status": status      # active, removed, superseded
        }
        
        if self.table is None:
            self.table = self.db.create_table("edit_traces", data=[trace_data])
        else:
            self.table.add([trace_data])
        
        return trace_data
    
    def _check_if_stale(self, trace):
        """Check if trace files still exist in codebase"""
        files = json.loads(trace.get('files_modified', '[]'))
        
        if not files:
            return False  # No files to check
        
        # Check if files exist
        missing = []
        for f in files:
            filepath = os.path.join('src', f) if not f.startswith('src') else f
            if not os.path.exists(filepath):
                missing.append(f)
        
        # If ALL files are missing, probably stale
        return len(missing) == len(files) and len(files) > 0
    
    def recent(self, limit: int = 10, active_only: bool = True, check_staleness: bool = True):
        """Get recent traces, optionally checking for staleness"""
        if self.table is None:
            return []
        
        df = self.table.to_pandas()
        
        if active_only:
            df = df[df['status'] == 'active']
        
        # Only show applied changes (not just suggestions)
        df = df[df['applied'] == True]
        
        # Sort by timestamp desc
        df = df.sort_values('timestamp', ascending=False)
        results = df.head(limit).to_dict('records')
        
        # Check for staleness
        if check_staleness:
            for trace in results:
                if self._check_if_stale(trace):
                    trace['_stale'] = True
        
        return results
    
    def mark_removed(self, trace_id: int = None, pattern: str = None):
        """Mark traces as removed (by ID or keyword pattern)"""
        if self.table is None:
            return
        
        # For now, just add a note
        # LanceDB would need to update existing rows
        print(f"ℹ️  To mark as removed, add a new trace:")
        print(f'   trace.add("removed X", "Removed {pattern} feature", status="active")')
    
    def search_semantic(self, query: str, limit: int = 10, active_only: bool = True):
        """Semantic search over trace summaries"""
        if self.table is None:
            return []
        
        from sentence_transformers import SentenceTransformer
        model = SentenceTransformer('nomic-ai/nomic-embed-text-v1.5', trust_remote_code=True)
        query_vector = model.encode(query).tolist()
        
        results = self.table.search(query_vector).limit(limit * 2).to_list()
        
        if active_only:
            results = [r for r in results if r.get('status') == 'active']
        
        # Only applied changes
        results = [r for r in results if r.get('applied') == True]
        
        return results[:limit]
    
    def get_memory_context(self, current_query: str = None, limit: int = 5):
        """Get memory context, filtering out stale traces"""
        if current_query:
            traces = self.search_semantic(current_query, limit=limit)
        else:
            traces = self.recent(limit=limit)
        
        if not traces:
            return ""
        
        context = "\n\nRECENT CHANGES YOU MADE:\n"
        for trace in traces:
            timestamp = trace['timestamp']
            summary = trace['summary']
            files = json.loads(trace.get('files_modified', '[]'))
            is_stale = trace.get('_stale', False)
            
            # Format time
            dt = datetime.fromisoformat(timestamp)
            friendly_date = dt.strftime("%b %d, %Y")
            
            # Relative time
            now = datetime.now(timezone.utc)
            diff = now - dt
            
            if diff.days > 30:
                relative = f"{diff.days // 30} month{'s' if diff.days // 30 > 1 else ''} ago"
            elif diff.days > 0:
                relative = f"{diff.days} day{'s' if diff.days > 1 else ''} ago"
            elif diff.seconds > 3600:
                relative = f"{diff.seconds // 3600} hour{'s' if diff.seconds // 3600 > 1 else ''} ago"
            elif diff.seconds > 60:
                relative = f"{diff.seconds // 60} minute{'s' if diff.seconds // 60 > 1 else ''} ago"
            else:
                relative = "just now"
            
            files_str = ', '.join(files[:3]) if files else ''
            if len(files) > 3:
                files_str += f", +{len(files)-3} more"
            
            # Mark stale traces
            stale_marker = " [⚠️  FILES MISSING - POSSIBLY REMOVED]" if is_stale else ""
            
            context += f"- [{friendly_date}] ({relative}) {summary}"
            if files_str:
                context += f" (in {files_str})"
            context += stale_marker
            context += "\n"
        
        return context
    
    def stats(self):
        """Get statistics"""
        if self.table is None:
            return {
                'total_traces': 0,
                'active_traces': 0,
                'applied_traces': 0,
                'suggestions_only': 0,
                'first_trace': None,
                'last_trace': None
            }
        
        df = self.table.to_pandas()
        active = df[df['status'] == 'active']
        applied = df[df['applied'] == True]
        suggestions = df[df['applied'] == False]
        
        if len(df) > 0:
            timestamps = [datetime.fromisoformat(t) for t in df['timestamp']]
            first = min(timestamps)
            last = max(timestamps)
        else:
            first = last = None
        
        return {
            'total_traces': len(df),
            'active_traces': len(active),
            'applied_traces': len(applied),
            'suggestions_only': len(suggestions),
            'first_trace': first.strftime("%b %d, %Y") if first else None,
            'last_trace': last.strftime("%b %d, %Y") if last else None
        }


if __name__ == "__main__":
    print("🧪 Testing updated trace system...")
    print()
    
    trace_mgr = TraceManager()
    
    # Add applied change
    trace_mgr.add(
        query="add vibration",
        summary="Added haptic vibration for proximity <10ft",
        files=["ProximityMap.jsx"],
        applied=True
    )
    
    # Add suggestion (not applied)
    trace_mgr.add(
        query="improve performance",
        summary="Could optimize with Web Workers",
        files=[],
        applied=False
    )
    
    print("✅ Added test traces")
    print()
    
    stats = trace_mgr.stats()
    print("📊 Stats:", stats)
    print()
    
    print("📝 Applied changes only:")
    for r in trace_mgr.recent(limit=5):
        print(f"   - {r['summary']}")
    print()
    
    context = trace_mgr.get_memory_context("proximity")
    print("🧠 Memory context:")
    print(context)
