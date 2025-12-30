"""Session management for multi-turn conversations"""

import json
import uuid
from datetime import datetime


class SessionManager:
    """Manages session persistence in Redis"""
    
    def __init__(self, redis_client):
        self.redis = redis_client
        self.prefix = "agentwinter:session:"
        self.ttl = 2700  # 45 minutes in seconds
        
    def load_session(self, session_id):
        """Load messages from Redis"""
        key = f"{self.prefix}{session_id}"
        data = self.redis.get(key)
        
        if data:
            session_data = json.loads(data)
            return session_data.get("messages", [])
        return []
    
    def save_session(self, session_id, messages):
        """Save messages to Redis with TTL"""
        key = f"{self.prefix}{session_id}"
        
        # Cleanup messages before saving
        cleaned_messages = cleanup_messages(messages)
        
        session_data = {
            "messages": cleaned_messages,
            "updated_at": datetime.now().isoformat()
        }
        
        # Save with TTL (extends on every save)
        self.redis.setex(key, self.ttl, json.dumps(session_data))
        
    def list_sessions(self):
        """List all active sessions"""
        pattern = f"{self.prefix}*"
        keys = self.redis.keys(pattern)
        
        sessions = []
        for key in keys:
            session_id = key.replace(self.prefix, "")
            data = self.redis.get(key)
            if data:
                session_data = json.loads(data)
                ttl = self.redis.ttl(key)
                sessions.append({
                    "id": session_id,
                    "message_count": len(session_data.get("messages", [])),
                    "updated_at": session_data.get("updated_at"),
                    "expires_in": ttl
                })
        
        return sessions
    
    def delete_session(self, session_id):
        """Delete a session"""
        key = f"{self.prefix}{session_id}"
        return self.redis.delete(key)


def cleanup_messages(messages):
    """Keep last 5 tool results full, summarize older ones"""
    
    if len(messages) <= 10:
        return messages  # Don't clean up short conversations
    
    tool_result_count = 0
    cleaned = []
    
    for msg in reversed(messages):
        if isinstance(msg, dict) and msg.get("role") == "user":
            # Check if this is a tool_result message
            content = msg.get("content", [])
            if isinstance(content, list):
                has_tool_results = any(
                    isinstance(item, dict) and item.get("type") == "tool_result"
                    for item in content
                )
                
                if has_tool_results:
                    tool_result_count += 1
                    
                    if tool_result_count <= 5:
                        cleaned.append(msg)
                    else:
                        # Summarize tool results
                        summarized_content = []
                        for item in content:
                            if isinstance(item, dict) and item.get("type") == "tool_result":
                                result_content = item.get("content", "")
                                summary = result_content[:100] + "..." if len(result_content) > 100 else result_content
                                summarized_content.append({
                                    "type": "tool_result",
                                    "tool_use_id": item.get("tool_use_id"),
                                    "content": f"[Summarized: {summary}]"
                                })
                            else:
                                summarized_content.append(item)
                        
                        cleaned.append({
                            "role": "user",
                            "content": summarized_content
                        })
                else:
                    cleaned.append(msg)
            else:
                cleaned.append(msg)
        else:
            cleaned.append(msg)
    
    return list(reversed(cleaned))


def generate_session_id():
    """Generate a short, readable session ID"""
    timestamp = datetime.now().strftime("%Y%m%d-%H%M%S")
    short_uuid = str(uuid.uuid4())[:8]
    return f"session-{timestamp}-{short_uuid}"
