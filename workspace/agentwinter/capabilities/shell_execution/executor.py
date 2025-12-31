"""Execute shell commands using security policies"""
import subprocess
import os
import re
from .ALLOWED_COMMANDS import ALLOWED_COMMANDS
from .BLOCKED_PATTERNS import BLOCKED_PATTERNS
from .SAFE_FILE_PATTERNS import SAFE_FILE_PATTERNS


def is_command_allowed(command: str) -> bool:
    """Check if command is in explicit whitelist"""
    cmd = command.strip()
    return any(cmd.startswith(allowed) for allowed in ALLOWED_COMMANDS)


def is_safe_file_read(command: str) -> bool:
    """Check if command matches safe file reading patterns"""
    cmd = command.strip()
    return any(re.match(pattern, cmd) for pattern in SAFE_FILE_PATTERNS)


def is_blocked(command: str) -> bool:
    """Check if command contains blocked patterns"""
    return any(re.search(pattern, command) for pattern in BLOCKED_PATTERNS)


def run_shell_command(command: str) -> dict:
    """
    Execute a shell command with security checks.
    
    Returns dict with: command, output, error_output, success, return_code
    OR dict with: error, hint
    """
    
    # Security check 1: Block dangerous patterns
    if is_blocked(command):
        return {
            "error": "Command blocked: contains dangerous pattern",
            "command": command,
            "hint": "See BLOCKED_PATTERNS.py for security restrictions"
        }
    
    # Security check 2: Must be whitelisted OR safe file read
    if not (is_command_allowed(command) or is_safe_file_read(command)):
        return {
            "error": f"Command not allowed: {command}",
            "allowed_commands": ALLOWED_COMMANDS,
            "safe_examples": [
                "cat src/features/auth/components/LoginForm.jsx",
                "cat planning/project-map.md",
                "cat README.md"
            ],
            "hint": "See ALLOWED_COMMANDS.py and SAFE_FILE_PATTERNS.py"
        }
    
    # Execute command
    try:
        result = subprocess.run(
            command,
            shell=True,
            capture_output=True,
            text=True,
            cwd=os.getcwd(),
            timeout=60,
        )
        
        return {
            "command": command,
            "output": result.stdout,
            "error_output": result.stderr,
            "success": result.returncode == 0,
            "return_code": result.returncode,
        }
        
    except subprocess.TimeoutExpired:
        return {"error": "Command timed out (60s limit)"}
    except Exception as e:
        return {"error": f"Execution failed: {str(e)}"}
