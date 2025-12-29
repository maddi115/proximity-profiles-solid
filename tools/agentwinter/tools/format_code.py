"""Code formatting tool"""
import subprocess
import os


def format_code(formatter="all", target_path="tools/agentwinter/"):
    """Format Python code with specified formatter
    
    Args:
        formatter: "black", "autopep8", "ruff", or "all"
        target_path: Path to format (default: tools/agentwinter/)
    
    Returns:
        dict with status and output
    """
    script_map = {
        "black": "format-black",
        "autopep8": "format-autopep8",
        "ruff": "format-ruff",
        "all": "format-all",
    }
    
    if formatter not in script_map:
        return {
            "error": f"Unknown formatter: {formatter}",
            "available": list(script_map.keys()),
        }
    
    script_name = script_map[formatter]
    script_path = f"tools/scripts/{script_name}"
    
    if not os.path.exists(script_path):
        return {"error": f"Script not found: {script_path}"}
    
    try:
        result = subprocess.run(
            [script_path, target_path],
            capture_output=True,
            text=True,
            timeout=60,
        )
        
        return {
            "formatter": formatter,
            "target": target_path,
            "output": result.stdout,
            "errors": result.stderr if result.stderr else None,
            "success": result.returncode == 0,
        }
    except subprocess.TimeoutExpired:
        return {"error": "Formatting timed out (>60s)"}
    except Exception as e:
        return {"error": str(e)}
