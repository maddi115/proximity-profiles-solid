"""Build context from project files and directory structure"""
import subprocess
import os
import json

def get_git_status():
    """Get uncommitted changes in src/"""
    try:
        result = subprocess.run(['git', 'status', '--porcelain', 'src/'], 
                              capture_output=True, text=True)
        return result.stdout.strip()
    except:
        return ""

def get_project_info():
    """Read package.json, tsconfig.json, etc."""
    info = []
    
    # Root directory listing
    try:
        root_ls = subprocess.run(['ls', '-la'], capture_output=True, text=True)
        info.append(f"PROJECT ROOT FILES:\n{root_ls.stdout}")
    except:
        pass
    
    # package.json
    if os.path.exists('package.json'):
        try:
            with open('package.json', 'r') as f:
                pkg = json.load(f)
                info.append(f"""
PACKAGE.JSON:
Name: {pkg.get('name', 'N/A')}
Version: {pkg.get('version', 'N/A')}
Dependencies: {', '.join(list(pkg.get('dependencies', {}).keys())[:10])}
DevDependencies: {', '.join(list(pkg.get('devDependencies', {}).keys())[:10])}
Scripts: {', '.join(pkg.get('scripts', {}).keys())}
""")
        except:
            pass
    
    # tsconfig.json
    if os.path.exists('tsconfig.json'):
        try:
            with open('tsconfig.json', 'r') as f:
                ts = json.load(f)
                compiler = ts.get('compilerOptions', {})
                info.append(f"""
TYPESCRIPT CONFIG:
Target: {compiler.get('target', 'N/A')}
JSX: {compiler.get('jsx', 'N/A')}
Module: {compiler.get('module', 'N/A')}
Strict: {compiler.get('strict', False)}
""")
        except:
            pass
    
    # Detect build tool
    vite_configs = ['vite.config.js', 'vite.config.ts']
    for config_file in vite_configs:
        if os.path.exists(config_file):
            info.append(f"\nBUILD TOOL: Vite (config: {config_file})")
            break
    
    return "\n".join(info)

def get_directory_tree():
    """Get src/ directory structure"""
    ls_result = subprocess.run(['ls', 'src/'], capture_output=True, text=True)
    tree_result = subprocess.run(['tree', 'src/'], capture_output=True, text=True)
    
    return f"""SRC DIRECTORY STRUCTURE:

$ ls src/
{ls_result.stdout.strip()}

$ tree src/
{tree_result.stdout.strip()}
"""

def build_full_context():
    """Build complete context string"""
    project_info = get_project_info()
    directory_tree = get_directory_tree()
    git_status = get_git_status()
    
    context = f"""{project_info}

{'='*70}

{directory_tree}
"""
    
    if git_status:
        context += f"\n\n📝 UNCOMMITTED CHANGES:\n{git_status}\n"
    
    return context
