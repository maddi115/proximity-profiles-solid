"""Execute shell commands using smart security policies"""
import subprocess
import os
import re
from .ALLOWED_COMMANDS import ALLOWED_COMMANDS
from .BLOCKED_PATTERNS import BLOCKED_PATTERNS
from .SAFE_FILE_PATTERNS import SAFE_FILE_PATTERNS


# Read-only commands that are safe to pipe/chain
READ_ONLY_COMMANDS = [
    'ls', 'cat', 'head', 'tail', 'wc', 'grep', 'find', 'tree',
    'git log', 'git diff', 'git status', 'git show', 'git branch',
    'pwd', 'which', 'echo', 'date', 'du', 'df'
]

# Dangerous operations that override read-only safety
DANGEROUS_OPERATIONS = [
    'rm', 'mv', 'cp', 'chmod', 'chown', 'sudo', 'su',
    '/etc', '/usr', '../', 'eval', 'exec'
]

# Security block visual template
SECURITY_BLOCK_TEMPLATE = """
╔══════════════════════════════════════════════════════════════╗
║  🚨 SECURITY BLOCK - DANGEROUS COMMAND PREVENTED 🚨          ║
╔══════════════════════════════════════════════════════════════╗
║                                                               ║
║  Command: {command:<54} ║
║  Reason:  {reason:<54} ║
║  Type:    {violation_type:<54} ║
║                                                               ║
╚══════════════════════════════════════════════════════════════╝
"""


def is_command_allowed(command: str) -> bool:
    """Check if command is in explicit whitelist"""
    cmd = command.strip()
    return any(cmd.startswith(allowed) for allowed in ALLOWED_COMMANDS)


def is_safe_file_read(command: str) -> bool:
    """Check if command matches safe file reading patterns"""
    cmd = command.strip()
    return any(re.match(pattern, cmd) for pattern in SAFE_FILE_PATTERNS)


def is_read_only_command(command: str) -> bool:
    """Check if command is read-only (safe for pipes/chains)"""
    cmd = command.strip().lower()
    return any(cmd.startswith(safe.lower()) for safe in READ_ONLY_COMMANDS)


def contains_dangerous_operation(command: str) -> bool:
    """Check if command contains dangerous operations"""
    cmd = command.lower()
    return any(danger in cmd for danger in DANGEROUS_OPERATIONS)


def is_safe_pipe_or_chain(command: str) -> bool:
    """
    Check if piped/chained command is safe.
    Safe = all parts are read-only AND no dangerous operations
    """
    # Check for dangerous operations first
    if contains_dangerous_operation(command):
        return False
    
    # Split by pipe, &&, or ;
    parts = re.split(r'\||&&|;', command)
    
    # All parts must be read-only
    return all(is_read_only_command(part.strip()) for part in parts if part.strip())


def is_blocked(command: str) -> bool:
    """
    Check if command contains blocked patterns.
    Smart blocking: allows safe pipes/chains even if pattern matches.
    """
    # If it's a safe pipe/chain, allow it even if patterns match
    if '|' in command or '&&' in command or ';' in command:
        if is_safe_pipe_or_chain(command):
            return False
    
    # Check remaining blocked patterns
    for pattern in BLOCKED_PATTERNS:
        # Skip pipe/chain patterns (handled above)
        if pattern in [r'\|', r'&&', r';']:
            continue
        
        if re.search(pattern, command):
            return True
    
    return False


def run_shell_command(command: str) -> dict:
    """
    Execute a shell command with smart security checks.

    Security order:
    1. Check whitelist/safe patterns (ALLOW if match)
    2. Check for dangerous operations (BLOCK if found)
    3. Check blocked patterns with smart pipe/chain handling
    
    Returns dict with: command, output, error_output, success, return_code
    OR dict with: error, hint, blocked, visual_alert
    """

    # Security check 1: Whitelist takes priority
    if is_command_allowed(command) or is_safe_file_read(command):
        # Whitelisted - skip all other checks
        pass
    # Security check 2: Smart blocking with pipe/chain awareness
    elif is_blocked(command):
        return {
            "error": "SECURITY_BLOCK",
            "blocked": True,
            "security_violation": "DESTRUCTIVE_OPERATION",
            "command": command,
            "reason": "Contains dangerous pattern (rm/mv/cp/chmod/etc)",
            "hint": "See BLOCKED_PATTERNS.py for security restrictions",
            "visual_alert": SECURITY_BLOCK_TEMPLATE.format(
                command=command[:54] if len(command) <= 54 else command[:51] + "...",
                reason="Contains dangerous pattern",
                violation_type="DESTRUCTIVE_OPERATION"
            )
        }
    # Security check 3: Not whitelisted and not explicitly safe
    else:
        # Check if it's a safe pipe/chain that should be allowed
        if ('|' in command or '&&' in command or ';' in command) and is_safe_pipe_or_chain(command):
            # Allow safe read-only pipes/chains
            pass
        else:
            return {
                "error": "SECURITY_BLOCK",
                "blocked": True,
                "security_violation": "NOT_WHITELISTED",
                "command": command,
                "reason": "Command not in whitelist",
                "hint": "See ALLOWED_COMMANDS.py and SAFE_FILE_PATTERNS.py",
                "visual_alert": SECURITY_BLOCK_TEMPLATE.format(
                    command=command[:54] if len(command) <= 54 else command[:51] + "...",
                    reason="Command not in whitelist",
                    violation_type="NOT_WHITELISTED"
                )
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
