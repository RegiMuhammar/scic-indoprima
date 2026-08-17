"""
Chat Service — Orchestrates LangGraph agent execution, SSE event streaming, and session persistence.
"""
import asyncio
import json
from typing import AsyncGenerator, Dict, Any, Optional
from langchain_core.messages import HumanMessage, AIMessage

from app.ai.graphs.sql_agent_graph import sql_agent_graph
from app.repositories.chat_repository import chat_repository
from app.schemas.chat import ActionStepItem


class ChatService:
    @staticmethod
    async def stream_agent_execution(
        session_id: str,
        user_prompt: str,
        domain_override: Optional[str] = None
    ) -> AsyncGenerator[str, None]:
        """
        Executes the LangGraph Multi-Tier SQL Agent and yields SSE formatted event chunks:
        - data: {"type": "step", "content": "..."}
        - data: {"type": "sql", "content": "..."}
        - data: {"type": "token", "content": "..."}
        - data: {"type": "complete", "payload": {...}}
        - data: {"type": "error", "message": "..."}
        """
        # 1. Save User Message to Supabase
        try:
            chat_repository.create_message(
                session_id=session_id,
                role="user",
                content=user_prompt
            )
            
            # Auto update session title if default
            session = chat_repository.get_session(session_id)
            if session and session.get("title") in ("Percakapan Baru", "New Chat", None, ""):
                clean_title = (user_prompt[:45] + "...") if len(user_prompt) > 45 else user_prompt
                chat_repository.update_session_title(session_id, clean_title)
        except Exception as e:
            print(f"Warning: Failed to save initial user message: {e}")

        initial_state = {
            "messages": [HumanMessage(content=user_prompt)],
            "session_id": session_id,
            "user_query": user_prompt,
            "selected_domain": domain_override or "general",
            "sql_retry_count": 0,
            "expert_retry_count": 0,
            "action_steps_trace": []
        }

        # 2. Yield initial start event
        yield f"data: {json.dumps({'type': 'step', 'content': '-> Memulai analisis SCIC AI Copilot...'}, default=str)}\n\n"
        await asyncio.sleep(0.05)

        # 3. Stream graph node steps
        final_state: Dict[str, Any] = {}
        last_step_count = 0

        try:
            # Stream node updates asynchronously
            async for chunk in sql_agent_graph.astream(initial_state):
                for node_name, node_output in chunk.items():
                    steps = node_output.get("action_steps_trace", [])
                    if steps and len(steps) > last_step_count:
                        new_steps = steps[last_step_count:]
                        for step_str in new_steps:
                            yield f"data: {json.dumps({'type': 'step', 'content': step_str}, default=str)}\n\n"
                            await asyncio.sleep(0.01)
                        last_step_count = len(steps)

                    # If SQL was generated in this node
                    if "generated_sql" in node_output and node_output["generated_sql"]:
                        yield f"data: {json.dumps({'type': 'sql', 'content': node_output['generated_sql']}, default=str)}\n\n"
                        await asyncio.sleep(0.01)

                    final_state.update(node_output)

            # Extract final payload
            final_payload = final_state.get("final_payload", {})
            direct_answer = final_payload.get("direct_answer", "")

            # 4. IMMEDIATELY Persist Assistant Response to Supabase
            try:
                chat_repository.create_message(
                    session_id=session_id,
                    role="assistant",
                    content=direct_answer,
                    sql_query=final_payload.get("sql_query"),
                    sql_result=final_payload.get("sql_result"),
                    action_steps=final_payload.get("action_steps", []),
                    expert_critique=final_payload.get("expert_critique"),
                    explainability=final_payload.get("explainability"),
                    visualization=final_payload.get("visualization")
                )
            except Exception as e:
                print(f"Warning: Failed to persist assistant response: {e}")

            # 5. Stream narrative text in token chunks for smooth typing effect
            words = direct_answer.split(" ")
            chunk_size = 4
            for i in range(0, len(words), chunk_size):
                sub_chunk = " ".join(words[i:i+chunk_size]) + " "
                yield f"data: {json.dumps({'type': 'token', 'content': sub_chunk}, default=str)}\n\n"
                await asyncio.sleep(0.01)

            # 6. Yield Final Complete Payload
            yield f"data: {json.dumps({'type': 'complete', 'payload': final_payload}, default=str)}\n\n"

        except Exception as e:
            error_msg = f"Terjadi kesalahan saat memproses pertanyaan: {str(e)}"
            print(f"Graph execution error: {e}")
            yield f"data: {json.dumps({'type': 'error', 'message': error_msg}, default=str)}\n\n"


chat_service = ChatService()
