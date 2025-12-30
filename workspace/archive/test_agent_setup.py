"""
Safe test to verify MiniMax M2.1 + Cognee are configured correctly
Does NOT modify any files
"""

import anthropic
import asyncio
import cognee
import os
from dotenv import load_dotenv

# Load .env file
load_dotenv()

print("\n" + "=" * 70)
print("🧪 TESTING AGENT SETUP (NO CODE CHANGES)")
print("=" * 70 + "\n")

# Test 1: Check config
print("1️⃣ Checking configuration...")
api_key = os.environ.get("ANTHROPIC_API_KEY")
base_url = os.environ.get("ANTHROPIC_BASE_URL", "https://api.minimax.io/anthropic")

if api_key:
    print(f"   ✅ API key found")
    print(f"   ✅ Base URL: {base_url}\n")
else:
    print("   ❌ No API key in .env\n")
    exit(1)

# Test 2: Test MiniMax M2.1
print("2️⃣ Testing MiniMax M2.1 connection...")
try:
    client = anthropic.Anthropic(
        api_key=api_key,
        base_url=base_url
    )
    
    response = client.messages.create(
        model="MiniMax-M2.1",
        max_tokens=100,
        system="You are helpful.",
        messages=[{"role": "user", "content": "Say hello"}]
    )
    
    result = ""
    for block in response.content:
        if block.type == "text":
            result += block.text
    
    print(f"   ✅ MiniMax responded: {result[:100]}\n")
except Exception as e:
    print(f"   ❌ MiniMax failed: {str(e)[:200]}\n")
    exit(1)

# Test 3: Cognee
print("3️⃣ Testing Cognee...")
async def test_cognee():
    try:
        os.environ["LLM_PROVIDER"] = "anthropic"
        os.environ["LLM_MODEL"] = "MiniMax-M2.1"
        os.environ["LLM_ENDPOINT"] = base_url
        
        await cognee.add("Test")
        print("   ✅ Cognee works\n")
    except Exception as e:
        print(f"   ⚠️  Cognee: {str(e)[:100]} (optional)\n")

asyncio.run(test_cognee())

# Test 4: LangGraph
print("4️⃣ Testing LangGraph...")
try:
    from langgraph.graph import StateGraph
    print("   ✅ LangGraph ready\n")
except Exception as e:
    print(f"   ❌ LangGraph failed\n")
    exit(1)

print("=" * 70)
print("✅ ALL TESTS PASSED!")
print("=" * 70 + "\n")
