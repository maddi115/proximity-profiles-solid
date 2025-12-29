"""Git history and analysis tools"""

import subprocess
from datetime import datetime


def git_log(file_path, limit=10):
    """Get git commit history for a file

    Args:
        file_path: Path to file relative to repo root
        limit: Number of commits to return

    Returns:
        List of commits with author, date, message
    """
    try:
        result = subprocess.run(
            [
                "git",
                "log",
                f"-{limit}",
                "--format=%H|%an|%ae|%ad|%s",
                "--date=short",
                "--",
                file_path,
            ],
            capture_output=True,
            text=True,
            timeout=10,
        )

        if result.returncode != 0:
            return {"error": f"Git log failed: {result.stderr}"}

        commits = []
        for line in result.stdout.strip().split("\n"):
            if not line:
                continue
            parts = line.split("|")
            if len(parts) >= 5:
                commits.append(
                    {
                        "hash": parts[0][:8],
                        "author": parts[1],
                        "email": parts[2],
                        "date": parts[3],
                        "message": parts[4],
                    }
                )

        return {"file": file_path, "commits": commits, "total": len(commits)}

    except Exception as e:
        return {"error": str(e)}


def git_blame(file_path, start_line=None, end_line=None):
    """Show who last modified each line

    Args:
        file_path: Path to file
        start_line: Optional start line number
        end_line: Optional end line number

    Returns:
        Line-by-line blame information
    """
    try:
        cmd = ["git", "blame", "--line-porcelain"]

        if start_line and end_line:
            cmd.extend([f"-L{start_line},{end_line}"])

        cmd.append(file_path)

        result = subprocess.run(cmd, capture_output=True, text=True, timeout=10)

        if result.returncode != 0:
            return {"error": f"Git blame failed: {result.stderr}"}

        # Parse blame output
        lines = []
        current = {}

        for line in result.stdout.split("\n"):
            if line.startswith("\t"):
                # This is the actual code line
                current["code"] = line[1:]
                lines.append(current.copy())
                current = {}
            elif " " in line:
                key, value = line.split(" ", 1)
                if key == "author":
                    current["author"] = value
                elif key == "author-time":
                    current["date"] = datetime.fromtimestamp(int(value)).strftime(
                        "%Y-%m-%d"
                    )
                elif key == "summary":
                    current["commit_msg"] = value

        return {
            "file": file_path,
            "lines": (
                lines[:50] if not start_line else lines
            ),  # Limit to 50 lines if full file
        }

    except Exception as e:
        return {"error": str(e)}


def git_recent_changes(since="1 week", path=None):
    """Get recent commits

    Args:
        since: Time period ("1 week", "3 days", "1 month")
        path: Optional path to filter (e.g., "src/features/auth")

    Returns:
        Recent commits
    """
    try:
        cmd = [
            "git",
            "log",
            f"--since={since}",
            "--format=%H|%an|%ad|%s",
            "--date=short",
        ]

        if path:
            cmd.extend(["--", path])

        result = subprocess.run(cmd, capture_output=True, text=True, timeout=10)

        if result.returncode != 0:
            return {"error": f"Git log failed: {result.stderr}"}

        commits = []
        for line in result.stdout.strip().split("\n"):
            if not line:
                continue
            parts = line.split("|")
            if len(parts) >= 4:
                commits.append(
                    {
                        "hash": parts[0][:8],
                        "author": parts[1],
                        "date": parts[2],
                        "message": parts[3],
                    }
                )

        return {
            "since": since,
            "path": path or "entire repository",
            "commits": commits,
            "total": len(commits),
        }

    except Exception as e:
        return {"error": str(e)}


def git_contributors(path=None):
    """Get list of contributors

    Args:
        path: Optional path to filter

    Returns:
        Contributors with commit counts
    """
    try:
        cmd = ["git", "shortlog", "-sn", "--all"]

        if path:
            cmd.extend(["--", path])

        result = subprocess.run(cmd, capture_output=True, text=True, timeout=10)

        if result.returncode != 0:
            return {"error": f"Git shortlog failed: {result.stderr}"}

        contributors = []
        for line in result.stdout.strip().split("\n"):
            if not line:
                continue
            parts = line.strip().split("\t")
            if len(parts) >= 2:
                contributors.append({"commits": int(parts[0]), "author": parts[1]})

        return {
            "path": path or "entire repository",
            "contributors": contributors,
            "total": len(contributors),
        }

    except Exception as e:
        return {"error": str(e)}


def git_diff(file_path, commit1="HEAD~1", commit2="HEAD"):
    """Show diff between two commits

    Args:
        file_path: Path to file
        commit1: First commit (default: previous commit)
        commit2: Second commit (default: current commit)

    Returns:
        Diff output
    """
    try:
        result = subprocess.run(
            ["git", "diff", commit1, commit2, "--", file_path],
            capture_output=True,
            text=True,
            timeout=10,
        )

        if result.returncode != 0:
            return {"error": f"Git diff failed: {result.stderr}"}

        return {
            "file": file_path,
            "commit1": commit1,
            "commit2": commit2,
            "diff": result.stdout,
        }

    except Exception as e:
        return {"error": str(e)}
