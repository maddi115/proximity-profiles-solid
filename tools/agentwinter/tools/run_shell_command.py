"""Execute safe shell commands"""
import subprocess
import os

# Safe commands allowlist
ALLOWED_COMMANDS = [
    './analyze-project.sh',
    'analyze-project.sh',
    'cat TOOLS.md',
    'cat ARCHITECTURE.md',
    'cat FLOW.md',
    'ls',
    'tree src',
    'git status',
    'git diff',
]

def is_command_allowed(command):
    """Check if command starts with any allowed command"""
    cmd = command.strip()
    for allowed in ALLOWED_COMMANDS:
        if cmd.startswith(allowed):
            return True
    return False

def run_shell_command(command):
    """Execute a safe shell command
    
    Args:
        command: Shell command to execute
    
    Returns:
        dict with output and status
    """
    
    if not is_command_allowed(command):
        return {
            "error": f"Command not allowed: {command}",
            "allowed_commands": ALLOWED_COMMANDS,
            "hint": "Only whitelisted safe commands can be executed"
        }
    
    try:
        result = subprocess.run(
            command,
            shell=True,
            capture_output=True,
            text=True,
            cwd=os.getcwd(),
            timeout=60
        )
        
        return {
            "command": command,
            "output": result.stdout,
            "error_output": result.stderr,
            "success": result.returncode == 0,
            "return_code": result.returncode
        }
    
    except subprocess.TimeoutExpired:
        return {"error": "Command timed out (60s limit)"}
    except Exception as e:
        return {"error": f"Execution failed: {str(e)}"}
