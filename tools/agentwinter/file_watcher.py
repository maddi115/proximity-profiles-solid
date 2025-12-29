"""Live file watching for automatic re-indexing"""
import time
from watchdog.observers import Observer
from watchdog.events import FileSystemEventHandler
from pathlib import Path
try:
    from .cache import clear_parse_cache
except ImportError:
    clear_parse_cache = lambda: None

class CodeFileHandler(FileSystemEventHandler):
    """Handle code file change events"""
    
    def __init__(self, on_change_callback):
        self.on_change = on_change_callback
        self.last_modified = {}
        self.debounce_seconds = 1  # Ignore rapid successive changes
    
    def should_process(self, file_path):
        """Check if we should process this file"""
        # Only process code files
        if not file_path.endswith(('.ts', '.tsx', '.js', '.jsx')):
            return False
        
        # Debounce - ignore if changed within last second
        now = time.time()
        if file_path in self.last_modified:
            if now - self.last_modified[file_path] < self.debounce_seconds:
                return False
        
        self.last_modified[file_path] = now
        return True
    
    def on_modified(self, event):
        """File was modified"""
        if event.is_directory:
            return
        
        if self.should_process(event.src_path):
            self.on_change(event.src_path, 'modified')
    
    def on_created(self, event):
        """File was created"""
        if event.is_directory:
            return
        
        if self.should_process(event.src_path):
            self.on_change(event.src_path, 'created')
    
    def on_deleted(self, event):
        """File was deleted"""
        if event.is_directory:
            return
        
        if event.src_path.endswith(('.ts', '.tsx', '.js', '.jsx')):
            self.on_change(event.src_path, 'deleted')

class FileWatcher:
    """Watch directory for file changes"""
    
    def __init__(self, watch_path='src/', on_change_callback=None):
        self.watch_path = watch_path
        self.observer = Observer()
        self.on_change = on_change_callback or self.default_callback
        
    def default_callback(self, file_path, event_type):
        """Default callback if none provided"""
        clear_parse_cache()  # Clear cache on any change
        """Default callback if none provided"""
        print(f"📝 {event_type.title()}: {file_path}")
    
    def start(self):
        """Start watching for changes"""
        handler = CodeFileHandler(self.on_change)
        self.observer.schedule(handler, self.watch_path, recursive=True)
        self.observer.start()
        print(f"👀 Watching {self.watch_path} for changes...")
    
    def stop(self):
        """Stop watching"""
        self.observer.stop()
        self.observer.join()
    
    def is_alive(self):
        """Check if watcher is running"""
        return self.observer.is_alive()

def watch_files(watch_path='src/', on_change_callback=None):
    """Convenience function to start watching"""
    watcher = FileWatcher(watch_path, on_change_callback)
    watcher.start()
    return watcher
