import anthropic
import sys
import os
import subprocess

client = anthropic.Anthropic()

def get_tree_structure():
    """Get the tree structure of src directory"""
    try:
        result = subprocess.run(
            ['tree', 'src', '-L', '3', '--gitignore'],
            capture_output=True,
            text=True
        )
        return result.stdout
    except:
        # Fallback if tree command not available
        structure = []
        for root, dirs, files in os.walk('src'):
            level = root.replace('src', '').count(os.sep)
            indent = ' ' * 2 * level
            structure.append(f'{indent}{os.path.basename(root)}/')
            subindent = ' ' * 2 * (level + 1)
            for file in files[:10]:  # Limit files shown
                structure.append(f'{subindent}{file}')
        return '\n'.join(structure)

def read_file(filepath):
    """Read file content"""
    with open(filepath, 'r') as f:
        return f.read()

def write_file(filepath, content):
    """Write content to file"""
    with open(filepath, 'w') as f:
        f.write(content)

def ask_ai(prompt, context=""):
    """Send prompt to AI and get response"""
    response = client.messages.create(
        model="MiniMax-M2.1",
        max_tokens=8000,
        system="You are an expert code architect. Always think step-by-step and plan meticulously before making changes.",
        messages=[
            {
                "role": "user",
                "content": f"{context}\n\n{prompt}"
            }
        ]
    )
    
    result = ""
    for block in response.content:
        if block.type == "text":
            result += block.text
    return result

def plan_and_execute(task):
    """Main workflow: analyze structure, plan, then execute"""
    
    print("🔍 Reading project structure...\n")
    tree = get_tree_structure()
    
    print("🧠 AI is analyzing your codebase and creating a plan...\n")
    print("=" * 60)
    
    # Step 1: Create plan
    plan_prompt = f"""Here is the src directory structure:

{tree}

Task: {task}

Before doing anything, create a DETAILED PLAN with:
1. Which files need to be examined
2. Which files need to be modified
3. What changes are needed for each file
4. The order of operations
5. Any risks or considerations

Format your plan clearly with numbered steps."""

    plan = ask_ai(plan_prompt)
    print(plan)
    print("=" * 60)
    
    # Ask for approval
    approval = input("\n✋ Review this plan. Continue? (y/n): ").strip().lower()
    if approval != 'y':
        print("❌ Aborted.")
        return
    
    # Step 2: Execute each step
    print("\n🚀 Executing plan...\n")
    
    execution_prompt = f"""Based on this plan:

{plan}

Now provide the ACTUAL CODE CHANGES needed.

For each file that needs modification:
1. State the filename
2. Show the complete new content for that file
3. Explain what changed

Format each file like:
### FILE: path/to/file.jsx
```javascript
// complete new file content here
```
Explanation: what changed and why
"""

    changes = ask_ai(execution_prompt, context=f"Project structure:\n{tree}")
    print(changes)
    print("\n" + "=" * 60)
    
    apply = input("\n✋ Apply these changes? (y/n): ").strip().lower()
    if apply == 'y':
        print("✅ Changes approved. (Manual application required - see output above)")
    else:
        print("❌ Changes rejected.")

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python tools/ai_editor.py 'describe the task'")
        print("Example: python tools/ai_editor.py 'add error boundaries to all components'")
        print("Example: python tools/ai_editor.py 'refactor proximity store to use signals'")
        sys.exit(1)
    
    task = ' '.join(sys.argv[1:])
    plan_and_execute(task)
