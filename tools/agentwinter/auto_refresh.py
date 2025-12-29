"""Auto-refresh all documentation on startup"""
import os
import subprocess
from pathlib import Path

class AutoRefresh:
    """Manages auto-refresh for CocoIndex and static documentation"""
    
    def __init__(self):
        self.coco_marker = Path('.coco_last_index')
        self.static_marker = Path('tools/docs/.last_generated')
        self.src_dir = 'src/'
    
    def _get_marker_time(self, marker):
        """Get marker file timestamp"""
        if marker.exists():
            return marker.stat().st_mtime
        return 0
    
    def _get_latest_file_mtime(self, directory='src/'):
        """Get newest file modification time in directory"""
        latest = 0
        for root, dirs, files in os.walk(directory):
            # Skip node_modules, venv, etc.
            dirs[:] = [d for d in dirs if d not in ['node_modules', 'venv', '.git', '__pycache__']]
            
            for file in files:
                if file.endswith(('.ts', '.tsx', '.js', '.jsx')):
                    try:
                        path = os.path.join(root, file)
                        mtime = os.path.getmtime(path)
                        if mtime > latest:
                            latest = mtime
                    except:
                        pass
        return latest
    
    def needs_coco_reindex(self):
        """Check if CocoIndex needs refresh"""
        last_index = self._get_marker_time(self.coco_marker)
        latest_file = self._get_latest_file_mtime(self.src_dir)
        return latest_file > last_index
    
    def refresh_coco(self):
        """Reindex CocoIndex embeddings"""
        print("📊 Refreshing CocoIndex (code changed)...")
        try:
            result = subprocess.run(
                ['python3', 'tools/indexing/index_codebase.py'],
                capture_output=True,
                text=True,
                timeout=300  # 5 minute timeout
            )
            if result.returncode == 0:
                self.coco_marker.touch()
                print("✅ CocoIndex updated!")
            else:
                print(f"⚠️  CocoIndex update failed: {result.stderr}")
        except subprocess.TimeoutExpired:
            print("⚠️  CocoIndex update timed out (5 min)")
        except Exception as e:
            print(f"⚠️  CocoIndex update error: {e}")
    
    def needs_static_regeneration(self):
        """Check if static docs need refresh"""
        last_gen = self._get_marker_time(self.static_marker)
        latest_file = self._get_latest_file_mtime(self.src_dir)
        return latest_file > last_gen
    
    def refresh_static(self):
        """Regenerate ARCHITECTURE.md and FLOW.md"""
        print("📊 Refreshing static documentation (code changed)...")
        try:
            result = subprocess.run(
                ['./analyze-project.sh'],
                capture_output=True,
                text=True,
                shell=True,
                timeout=60
            )
            if result.returncode == 0:
                # Create marker
                self.static_marker.parent.mkdir(parents=True, exist_ok=True)
                self.static_marker.touch()
                print("✅ Static docs updated (tools/docs/)!")
            else:
                print(f"⚠️  Static docs update failed: {result.stderr}")
        except subprocess.TimeoutExpired:
            print("⚠️  Static docs update timed out (60s)")
        except Exception as e:
            print(f"⚠️  Static docs update error: {e}")
    
    def refresh_all(self):
        """Refresh everything that needs it"""
        # Check CocoIndex
        if self.needs_coco_reindex():
            self.refresh_coco()
        else:
            print("✅ CocoIndex up-to-date")
        
        # Check static docs
        if self.needs_static_regeneration():
            self.refresh_static()
        else:
            print("✅ Static docs up-to-date")

def auto_refresh():
    """Convenience function for main.py"""
    refresher = AutoRefresh()
    refresher.refresh_all()
