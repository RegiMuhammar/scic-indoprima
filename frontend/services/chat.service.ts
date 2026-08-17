// AI Chat API Client & EventStream Reader
import { ChatSession, ChatMessage, DemoPreset } from "@/types/chat.types"

const RAW_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"
const API_BASE_URL = RAW_URL.endsWith("/api/v1") ? RAW_URL : `${RAW_URL.replace(/\/+$/, "")}/api/v1`

export const chatService = {
  async getPresets(domain?: string): Promise<DemoPreset[]> {
    try {
      const url = domain
        ? `${API_BASE_URL}/chat/presets?domain=${encodeURIComponent(domain)}`
        : `${API_BASE_URL}/chat/presets`
      const res = await fetch(url)
      if (!res.ok) throw new Error("Failed to fetch presets")
      const json = await res.json()
      return json.presets || []
    } catch (e) {
      console.error("Error fetching presets:", e)
      return []
    }
  },

  async listSessions(): Promise<ChatSession[]> {
    try {
      const res = await fetch(`${API_BASE_URL}/chat/sessions`)
      if (!res.ok) throw new Error("Failed to list sessions")
      const json = await res.json()
      return json.sessions || []
    } catch (e) {
      console.error("Error listing sessions:", e)
      return []
    }
  },

  async createSession(title?: string, domain: string = "general"): Promise<ChatSession> {
    const res = await fetch(`${API_BASE_URL}/chat/sessions`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: title || "Percakapan Baru", domain }),
    })
    if (!res.ok) throw new Error("Failed to create session")
    return await res.json()
  },

  async deleteSession(sessionId: string): Promise<boolean> {
    try {
      const res = await fetch(`${API_BASE_URL}/chat/sessions/${sessionId}`, {
        method: "DELETE",
      })
      return res.ok
    } catch (e) {
      console.error("Error deleting session:", e)
      return false
    }
  },

  async getMessages(sessionId: string): Promise<ChatMessage[]> {
    try {
      const res = await fetch(`${API_BASE_URL}/chat/sessions/${sessionId}/messages`)
      if (!res.ok) throw new Error("Failed to get messages")
      const json = await res.json()
      return json.messages || []
    } catch (e) {
      console.error("Error fetching messages:", e)
      return []
    }
  },

  async streamMessage(
    sessionId: string,
    content: string,
    onEvent: (event: { type: string; content?: string; payload?: any; message?: string }) => void,
    domainOverride?: string
  ): Promise<void> {
    const res = await fetch(`${API_BASE_URL}/chat/sessions/${sessionId}/messages`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content, domain_override: domainOverride }),
    })

    if (!res.ok || !res.body) {
      throw new Error(`Streaming failed: HTTP ${res.status}`)
    }

    const reader = res.body.getReader()
    const decoder = new TextDecoder()
    let buffer = ""

    while (true) {
      const { done, value } = await reader.read()
      if (done) break

      buffer += decoder.decode(value, { stream: true })
      const lines = buffer.split("\n")
      buffer = lines.pop() || ""

      for (const line of lines) {
        const trimmed = line.trim()
        if (trimmed.startsWith("data: ")) {
          const jsonStr = trimmed.slice(6)
          try {
            const parsed = JSON.parse(jsonStr)
            onEvent(parsed)
          } catch (err) {
            console.warn("Could not parse SSE JSON:", jsonStr, err)
          }
        }
      }
    }
  },
}
