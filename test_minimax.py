import anthropic

client = anthropic.Anthropic()

response = client.messages.create(
    model="MiniMax-M2.1",
    max_tokens=200,
    system="You are a calm assistant.",
    messages=[
        {
            "role": "user",
            "content": [{"type": "text", "text": "Say hello in one sentence."}],
        }
    ],
)

for block in response.content:
    if block.type == "text":
        print(block.text)
