"""
Test GET /sessions/{id}/messages endpoint
"""
import os
import sys
import asyncio
from dotenv import load_dotenv

backend_dir = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "backend")
sys.path.insert(0, backend_dir)
load_dotenv(os.path.join(backend_dir, ".env"))

from httpx import AsyncClient, ASGITransport
from app.main import app

async def main():
    print("=== TESTING GET /sessions/{id}/messages ===")
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        sid = "dac90328-d8b8-4d27-be7d-1f056d3dcdb4"
        res = await client.get(f"/api/v1/chat/sessions/{sid}/messages")
        print(f"Status Code: {res.status_code}")
        assert res.status_code == 200
        msgs = res.json().get("messages", [])
        print(f"Total messages returned: {len(msgs)}")
        for m in msgs:
            role = m.get("role")
            content_preview = m.get("content", "")[:60]
            steps = len(m.get("action_steps") or [])
            print(f"  - [{role}] {content_preview}... (Action steps: {steps})")

    print(">>> GET MESSAGES VERIFIED SUCCESSFULLY! <<<")

if __name__ == "__main__":
    asyncio.run(main())
