"""
Test LangGraph Multi-Tier Pipeline End-to-End
"""
import os
import sys
from dotenv import load_dotenv

if sys.stdout.encoding != 'utf-8':
    try:
        sys.stdout.reconfigure(encoding='utf-8')
    except Exception:
        pass

backend_dir = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "backend")
sys.path.insert(0, backend_dir)
load_dotenv(os.path.join(backend_dir, ".env"))

from app.ai.graphs.sql_agent_graph import sql_agent_graph

def main():
    print("=== TESTING LANGGRAPH PIPELINE WITH REAL QUERY ===")
    query = "Tampilkan 3 penyebab downtime terbesar pada fact_downtime_logs beserta total menitnya."
    print(f"User Query: {query}\n")

    initial_state = {
        "messages": [],
        "session_id": "test_verification_01",
        "user_query": query,
        "sql_retry_count": 0,
        "expert_retry_count": 0,
        "action_steps_trace": []
    }

    result = sql_agent_graph.invoke(initial_state)

    print("--- EXECUTION ACTION TRACE ---")
    for step in result.get("action_steps_trace", []):
        print(f"  {step}")

    final_p = result.get("final_payload", {})
    print("\n--- SYNTHESIZED EXECUTIVE ANSWER ---")
    print(final_p.get("direct_answer"))

    print("\n--- EXECUTED SQL ---")
    print(final_p.get("sql_query"))

    print("\n--- ROWS RETRIEVED ---")
    print(f"Total Rows: {len(final_p.get('sql_result') or [])}")
    if final_p.get("sql_result"):
        print(f"Sample Record: {final_p.get('sql_result')[0]}")

    print("\n--- EXPLAINABILITY & SENIOR CRITIC ---")
    print(f"Confidence Score: {final_p.get('explainability', {}).get('confidence_score')}")
    print(f"Recommended Action: {final_p.get('explainability', {}).get('recommended_action')}")

    print("\n--- VISUALIZATION ---")
    print(f"Chart Type: {final_p.get('visualization', {}).get('chart_type')}")
    print(f"Chart Title: {final_p.get('visualization', {}).get('title')}")

    assert final_p.get("sql_query") is not None
    assert len(final_p.get("sql_result") or []) > 0
    print("\n>>> LANGGRAPH PIPELINE VERIFICATION 100% SUCCESSFUL! <<<")

if __name__ == "__main__":
    main()
