import os
from dotenv import load_dotenv
from groq import Groq

load_dotenv()
api_key = os.getenv("GROQ_API_KEY")

print(f"Loaded API Key: {api_key[:8]}... (length: {len(api_key) if api_key else 0})")

try:
    client = Groq(api_key=api_key)
    models = client.models.list()
    print("\n Available models on your Groq account:")
    for m in models.data:
        print(f" - {m.id}")
except Exception as e:
    print(f"\n Error testing Groq: {e}")