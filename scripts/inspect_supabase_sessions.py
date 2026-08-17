"""
Inspect Supabase sessions and messages
"""
import os
import sys
from dotenv import load_dotenv

backend_dir = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "backend")
sys.path.insert(0, backend_dir)
load_dotenv(os.path.join(backend_dir, ".env"))

from app.repositories.chat_repository import chat_repository

def main():
    sessions = chat_repository.list_sessions()
    print(f"Total sessions: {len(sessions)}")
    for s in sessions:
        sid = str(s['id'])
        title = s.get('title', '')
        print(f"\n--- SESSION: {sid} ({title}) ---")
        msgs = chat_repository.get_messages(sid)
        print(f"Messages count: {len(msgs)}")
        for m in msgs:
            print(f"  Role: {m.get('role')} | ID: {m.get('id')} | Content: {m.get('content')[:60]}...")
            print(f"    Has SQL: {bool(m.get('sql_query'))} | Has Actions: {len(m.get('action_steps') or [])} | Has Explainability: {bool(m.get('explainability'))}")

if __name__ == "__main__":
    main()
