"""
Test FastAPI Chat Endpoints & SSE Streaming
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
    print("=== TESTING FASTAPI CHAT ENDPOINTS ===")
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        # 1. Presets endpoint
        r_preset = await client.get("/api/v1/chat/presets")
        assert r_preset.status_code == 200
        presets = r_preset.json().get("presets", [])
        print(f"1. GET /presets: OK ({len(presets)} presets)")

        # 2. Create session
        r_session = await client.post("/api/v1/chat/sessions", json={"title": "Test API Session", "domain": "manufacturing"})
        assert r_session.status_code == 200
        session_data = r_session.json()
        session_id = session_data["id"]
        print(f"2. POST /sessions: Created session ID: {session_id}")

        # 3. List sessions
        r_list = await client.get("/api/v1/chat/sessions")
        assert r_list.status_code == 200
        sessions_count = len(r_list.json().get("sessions", []))
        print(f"3. GET /sessions: Found {sessions_count} sessions")

        # 4. Stream message
        print("4. POST /sessions/{id}/messages (Testing SSE stream)...")
        events_received = []
        async with client.stream("POST", f"/api/v1/chat/sessions/{session_id}/messages", json={"content": "Berapa total menit downtime per kategori?"}) as stream_res:
            assert stream_res.status_code == 200
            async for line in stream_res.aiter_lines():
                if line.startswith("data: "):
                    events_received.append(line)

        print(f"  SSE Stream completed! Total event chunks received: {len(events_received)}")
        assert len(events_received) > 0

        # 5. Clean up session
        r_del = await client.delete(f"/api/v1/chat/sessions/{session_id}")
        assert r_del.status_code == 200
        print("5. DELETE /sessions/{id}: Cleaned up session.")

    print("\n>>> FASTAPI CHAT API & SSE STREAMING 100% VERIFIED! <<<")

if __name__ == "__main__":
    asyncio.run(main())
