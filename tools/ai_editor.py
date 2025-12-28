import anthropic
import sys
import os
import subprocess
import json
import re
from pathlib import Path

client = anthropic.Anthropic()

class CodeAgent:
    def __init__(self):
        self.conversation_history = []
        self.files_examined = set()
        self.changes_made = []
        self.plan = None
        
    def run_bash(self, command, description):
        """Execute bash command and return output"""
        print(f"🔧 {description}")
        print(f"   $ {command}")
        try:
            result = subprocess.run(
                command,
                shell=True,
                capture_output=True,
                text=True,
                timeout=30
            )
            output = result.stdout + result.stderr
            print(f"   ✓ Done\n")
            return output
        except Exception as e:
            print(f"   ✗ Error: {e}\n")
            return f"Error: {e}"
    
    def view_file(self, filepath, description=""):
        """Read and display file content"""
        desc = description or f"Reading {filepath}"
        print(f"📄 {desc}")
        try:
            with open(filepath, 'r') as f:
                content = f.read()
            self.files_examined.add(filepath)
            lines = len(content.split('\n'))
            print(f"   ✓ Read {lines} lines\n")
            return content
        except FileNotFoundError:
            print(f"   ✗ File not found\n")
            return None
        except Exception as e:
            print(f"   ✗ Error: {e}\n")
            return None
    
    def str_replace(self, filepath, old_str, new_str, description):
        """Replace string in file"""
        print(f"✏️  {description}")
        print(f"   File: {filepath}")
        
        try:
            with open(filepath, 'r') as f:
                content = f.read()
        except Exception as e:
            print(f"   ✗ Could not read file: {e}\n")
            return False
        
        if old_str not in content:
            print(f"   ✗ String not found in file\n")
            return False
        
        if content.count(old_str) > 1:
            print(f"   ✗ String appears {content.count(old_str)} times (must be unique)\n")
            return False
            
        new_content = content.replace(old_str, new_str, 1)
        
        with open(filepath, 'w') as f:
            f.write(new_content)
        
        self.changes_made.append({
            'file': filepath,
            'type': 'edit',
            'description': description
        })
        print(f"   ✓ Replaced\n")
        return True
    
    def create_file(self, filepath, content, description):
        """Create new file"""
        print(f"📝 {description}")
        print(f"   File: {filepath}")
        
        os.makedirs(os.path.dirname(filepath), exist_ok=True)
        
        with open(filepath, 'w') as f:
            f.write(content)
        
        self.changes_made.append({
            'file': filepath,
            'type': 'create',
            'description': description
        })
        lines = len(content.split('\n'))
        print(f"   ✓ Created ({lines} lines)\n")
        return True
    
    def ask_claude(self, prompt, system_prompt):
        """Send prompt to Claude"""
        response = client.messages.create(
            model="MiniMax-M2.1",
            max_tokens=8000,
            system=system_prompt,
            messages=[{"role": "user", "content": prompt}]
        )
        
        result = ""
        for block in response.content:
            if block.type == "text":
                result += block.text
        return result
    
    def create_detailed_plan(self, task, context):
        """Phase 1: Deep planning"""
        print("\n" + "=" * 70)
        print("🧠 PLANNING PHASE")
        print("=" * 70 + "\n")
        
        planning_prompt = f"""You are an expert code architect. You need to create a COMPREHENSIVE, DETAILED PLAN before making any changes.

PROJECT CONTEXT:
{context}

TASK: {task}

Create a detailed plan following this structure:

## 1. ANALYSIS
- What is the current state?
- What files are involved?
- What patterns/architecture does the codebase use?
- What are the constraints?

## 2. FILES TO EXAMINE
List every file you need to read to understand the codebase:
- File path
- Why you need to examine it
- What you're looking for

## 3. IMPLEMENTATION STRATEGY
- Overall approach
- Design decisions
- Why this approach over alternatives
- Potential risks

## 4. DETAILED EXECUTION STEPS
For each step, specify:
- Step number
- Action type (view_file, create_file, str_replace)
- File path
- Exact changes needed
- Why this change
- Dependencies on previous steps

## 5. VERIFICATION PLAN
- How to verify each change worked
- What to test
- Expected outcomes

Be EXTREMELY detailed. Think like you're writing documentation for someone else to execute.
"""

        system_prompt = """You are an expert software architect who plans meticulously before executing.

Your planning must be:
- Comprehensive (consider all edge cases)
- Detailed (specific files, specific changes)
- Ordered (clear dependency chain)
- Verifiable (clear success criteria)

Think step-by-step. Consider:
1. What exists now?
2. What needs to change?
3. How to change it safely?
4. How to verify it worked?

Plan like your reputation depends on it."""

        print("📋 Creating detailed plan...\n")
        plan = self.ask_claude(planning_prompt, system_prompt)
        
        self.plan = plan
        return plan
    
    def execute_plan(self, task):
        """Phase 2: Execute the approved plan"""
        print("\n" + "=" * 70)
        print("🚀 EXECUTION PHASE")
        print("=" * 70 + "\n")
        
        execution_system = """You are a code execution agent. You have a detailed plan and you must execute it step-by-step.

Available tools:
- view_file(filepath, description) - read file contents
- str_replace(filepath, old_str, new_str, description) - edit files (old_str must be unique)
- create_file(filepath, content, description) - create new files
- run_bash(command, description) - execute bash commands

CRITICAL RULES:
1. Work incrementally - one step at a time
2. Always view_file before str_replace
3. Verify each change before moving to the next
4. old_str in str_replace must be UNIQUE in the file
5. If something fails, adapt the plan

Respond with JSON:
{
  "thinking": "current step analysis",
  "action": "view_file|str_replace|create_file|run_bash|complete",
  "params": {...},
  "explanation": "what and why",
  "next_step": "what comes after this"
}"""

        self.conversation_history = []
        
        initial_prompt = f"""APPROVED PLAN:
{self.plan}

TASK: {task}

Execute this plan step by step. Start with the first action from the plan.
Work carefully and verify each change."""

        max_iterations = 30
        iteration = 0
        
        while iteration < max_iterations:
            iteration += 1
            print(f"{'─' * 70}")
            print(f"STEP {iteration}")
            print(f"{'─' * 70}\n")
            
            # Add to conversation
            self.conversation_history.append({
                "role": "user",
                "content": initial_prompt if iteration == 1 else "Continue with the next step from the plan. Previous action completed successfully."
            })
            
            # Get next action
            response = client.messages.create(
                model="MiniMax-M2.1",
                max_tokens=4000,
                system=execution_system,
                messages=self.conversation_history
            )
            
            response_text = ""
            for block in response.content:
                if block.type == "text":
                    response_text += block.text
            
            self.conversation_history.append({
                "role": "assistant",
                "content": response_text
            })
            
            # Parse and execute
            try:
                # Extract JSON
                json_match = re.search(r'```json\s*(\{.*?\})\s*```', response_text, re.DOTALL)
                if json_match:
                    action_data = json.loads(json_match.group(1))
                else:
                    action_data = json.loads(response_text)
                
                # Show thinking
                if 'thinking' in action_data:
                    print("💭 THINKING:")
                    print(f"   {action_data['thinking']}\n")
                
                action = action_data['action']
                params = action_data.get('params', {})
                explanation = action_data.get('explanation', '')
                
                if explanation:
                    print(f"📋 {explanation}\n")
                
                # Execute action
                result = None
                if action == 'view_file':
                    result = self.view_file(params['filepath'], params.get('description', ''))
                elif action == 'str_replace':
                    result = self.str_replace(
                        params['filepath'],
                        params['old_str'],
                        params['new_str'],
                        params.get('description', 'Editing file')
                    )
                elif action == 'create_file':
                    result = self.create_file(
                        params['filepath'],
                        params['content'],
                        params.get('description', 'Creating file')
                    )
                elif action == 'run_bash':
                    result = self.run_bash(
                        params['command'],
                        params.get('description', 'Running command')
                    )
                elif action == 'complete':
                    print("✅ Plan execution complete\n")
                    break
                else:
                    print(f"❌ Unknown action: {action}\n")
                
                # Feed result back
                if result is not None and isinstance(result, str):
                    initial_prompt = f"Result:\n{result[:2000]}"
                    
            except Exception as e:
                print(f"❌ Error parsing action: {e}\n")
                print(f"Response was:\n{response_text[:500]}\n")
                break
            
            if iteration >= max_iterations:
                print("⚠️  Max iterations reached\n")
                break
    
    def run_task(self, task_description):
        """Main workflow: Plan → Approve → Execute"""
        print("=" * 70)
        print(f"🎯 TASK: {task_description}")
        print("=" * 70)
        
        # Gather context
        print("\n📊 Gathering project context...\n")
        tree = self.run_bash(
            "tree src -L 3 --gitignore -I 'node_modules|dist|build' 2>/dev/null || find src -type f | head -50",
            "Getting project structure"
        )
        
        package_json = self.view_file("package.json", "Reading package.json") or ""
        
        context = f"""PROJECT STRUCTURE:
{tree}

PACKAGE.JSON:
{package_json[:1000]}
"""
        
        # PHASE 1: Planning
        plan = self.create_detailed_plan(task_description, context)
        
        print("\n" + "=" * 70)
        print("📋 DETAILED PLAN")
        print("=" * 70)
        print(plan)
        print("=" * 70)
        
        # Get approval
        print("\n⚠️  Review the plan carefully!\n")
        approval = input("Continue with execution? (y/n): ").strip().lower()
        
        if approval != 'y':
            print("\n❌ Execution cancelled.\n")
            return
        
        # PHASE 2: Execution
        self.execute_plan(task_description)
        
        # Summary
        print("\n" + "=" * 70)
        print("📊 SUMMARY")
        print("=" * 70)
        print(f"Files examined: {len(self.files_examined)}")
        for f in sorted(self.files_examined):
            print(f"  📄 {f}")
        print(f"\nChanges made: {len(self.changes_made)}")
        for change in self.changes_made:
            icon = "✏️" if change['type'] == 'edit' else "📝"
            print(f"  {icon} {change['file']}: {change['description']}")
        print("=" * 70 + "\n")

def main():
    if len(sys.argv) < 2:
        print("""
🤖 AI Code Agent - Plan-First Edition

Usage: python tools/ai_editor.py 'describe the task'

Examples:
  python tools/ai_editor.py 'add error boundary to home route'
  python tools/ai_editor.py 'refactor auth store to use signals'
  python tools/ai_editor.py 'fix TypeScript errors in components'

The agent will:
  1. 🧠 Create a detailed plan
  2. ✋ Wait for your approval
  3. 🚀 Execute step-by-step
  4. ✅ Make actual changes to files
""")
        sys.exit(1)
    
    task = ' '.join(sys.argv[1:])
    agent = CodeAgent()
    agent.run_task(task)

if __name__ == "__main__":
    main()
