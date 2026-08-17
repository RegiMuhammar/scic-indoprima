"use client"

import React, { useState, useEffect, useRef } from "react"
import { ChatSession, ChatMessage, DemoPreset } from "@/types/chat.types"
import { chatService } from "@/services/chat.service"
import { SessionSidebar } from "./SessionSidebar"
import { EmptyStateHero } from "./EmptyStateHero"
import { MessageBubble } from "./MessageBubble"
import { ChatInputBar } from "./ChatInputBar"
import { Menu } from "lucide-react"

export const ChatPanel: React.FC = () => {
  // State
  const [sessions, setSessions] = useState<ChatSession[]>([])
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [presets, setPresets] = useState<DemoPreset[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)

  // Live Streaming Temp State
  const [streamingSteps, setStreamingSteps] = useState<string[]>([])
  const [streamingContent, setStreamingContent] = useState<string>("")
  const [streamingSql, setStreamingSql] = useState<string | undefined>(undefined)

  const messagesEndRef = useRef<HTMLDivElement>(null)

  // 1. Initial Load: Presets & Sessions
  useEffect(() => {
    async function loadInitData() {
      const [loadedPresets, loadedSessions] = await Promise.all([
        chatService.getPresets(),
        chatService.listSessions(),
      ])
      setPresets(loadedPresets)
      setSessions(loadedSessions)

      if (loadedSessions.length > 0 && !activeSessionId) {
        setActiveSessionId(loadedSessions[0].id)
      }
    }
    loadInitData()
  }, [])

  // 2. Load Messages when Active Session changes
  useEffect(() => {
    async function loadMessages() {
      if (!activeSessionId) {
        setMessages([])
        return
      }
      const msgs = await chatService.getMessages(activeSessionId)
      setMessages(msgs)
    }
    loadMessages()
  }, [activeSessionId])

  // 3. Scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, streamingContent, streamingSteps])

  // 4. Handle Create New Chat Session
  const handleNewChat = async () => {
    try {
      const newSession = await chatService.createSession("Percakapan Baru")
      setSessions([newSession, ...sessions])
      setActiveSessionId(newSession.id)
      setMessages([])
      setStreamingSteps([])
      setStreamingContent("")
    } catch (e) {
      console.error("Failed to create session:", e)
    }
  }

  // 5. Handle Delete Session
  const handleDeleteSession = async (sessionId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    const ok = await chatService.deleteSession(sessionId)
    if (ok) {
      const remaining = sessions.filter((s) => s.id !== sessionId)
      setSessions(remaining)
      if (activeSessionId === sessionId) {
        if (remaining.length > 0) {
          setActiveSessionId(remaining[0].id)
        } else {
          setActiveSessionId(null)
          setMessages([])
        }
      }
    }
  }

  // 6. Handle Send Message & SSE Streaming
  const handleSendMessage = async (promptText: string, domainOverride?: string) => {
    if (!promptText.trim() || isLoading) return

    let currentSessionId = activeSessionId

    // If no active session, create one first
    if (!currentSessionId) {
      try {
        const title = promptText.length > 40 ? promptText.slice(0, 40) + "..." : promptText
        const newSession = await chatService.createSession(title, domainOverride || "general")
        setSessions([newSession, ...sessions])
        setActiveSessionId(newSession.id)
        currentSessionId = newSession.id
      } catch (e) {
        console.error("Failed to auto-create session:", e)
        return
      }
    }

    // Add Optimistic User Message
    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      session_id: currentSessionId,
      role: "user",
      content: promptText,
      created_at: new Date().toISOString(),
    }
    setMessages((prev) => [...prev, userMsg])
    setIsLoading(true)
    setStreamingSteps([])
    setStreamingContent("")
    setStreamingSql(undefined)

    try {
      await chatService.streamMessage(
        currentSessionId,
        promptText,
        (event) => {
          if (event.type === "step" && event.content) {
            setStreamingSteps((prev) => [...prev, event.content!])
          } else if (event.type === "sql" && event.content) {
            setStreamingSql(event.content)
          } else if (event.type === "token" && event.content) {
            setStreamingContent((prev) => prev + event.content)
          } else if (event.type === "complete" && event.payload) {
            const p = event.payload
            const assistantMsg: ChatMessage = {
              id: `assistant-${Date.now()}`,
              session_id: currentSessionId!,
              role: "assistant",
              content: p.direct_answer || streamingContent,
              sql_query: p.sql_query,
              sql_result: p.sql_result,
              action_steps: p.action_steps || streamingSteps,
              explainability: p.explainability,
              visualization: p.visualization,
              created_at: new Date().toISOString(),
            }
            setMessages((prev) => [...prev, assistantMsg])
            setStreamingSteps([])
            setStreamingContent("")
            setStreamingSql(undefined)
          } else if (event.type === "error") {
            const errorMsg: ChatMessage = {
              id: `error-${Date.now()}`,
              session_id: currentSessionId!,
              role: "assistant",
              content: `⚠️ ${event.message || "Terjadi kesalahan saat mengeksekusi analisis."}`,
              created_at: new Date().toISOString(),
            }
            setMessages((prev) => [...prev, errorMsg])
          }
        },
        domainOverride
      )
    } catch (e: any) {
      console.error("Stream error:", e)
      const errorMsg: ChatMessage = {
        id: `error-${Date.now()}`,
        session_id: currentSessionId,
        role: "assistant",
        content: `⚠️ Gagal terhubung ke AI Service: ${e.message}`,
        created_at: new Date().toISOString(),
      }
      setMessages((prev) => [...prev, errorMsg])
    } finally {
      setIsLoading(false)
      // Refresh session title
      const refreshed = await chatService.listSessions()
      setSessions(refreshed)
    }
  }

  // Active Session title lookup
  const activeSession = sessions.find((s) => s.id === activeSessionId)

  return (
    <div className="flex h-[calc(100vh-4rem)] w-full bg-[#000711] overflow-hidden text-white font-poppins">
      {/* Session Sidebar */}
      <SessionSidebar
        sessions={sessions}
        activeSessionId={activeSessionId}
        onSelectSession={(id) => setActiveSessionId(id)}
        onNewChat={handleNewChat}
        onDeleteSession={handleDeleteSession}
        isOpen={isSidebarOpen}
        onToggleOpen={() => setIsSidebarOpen(!isSidebarOpen)}
      />

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden bg-[#000711] relative">
        {/* Top Chat Bar */}
        <header className="h-12 border-b border-white/10 px-4 flex items-center justify-between bg-[#00050d]/80 backdrop-blur shrink-0">
          <div className="flex items-center gap-3">
            {!isSidebarOpen && (
              <button
                onClick={() => setIsSidebarOpen(true)}
                className="p-1 rounded hover:bg-white/5 text-white/50 hover:text-white transition-colors"
                title="Buka Sidebar"
              >
                <Menu className="w-4 h-4" />
              </button>
            )}
            <h2 className="text-xs sm:text-sm font-semibold text-white/90 truncate max-w-sm">
              {activeSession ? activeSession.title : "Percakapan Baru"}
            </h2>
          </div>

          <div className="flex items-center gap-2 text-[11px] text-white/40 font-mono">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>MotherDuck OLAP Live</span>
          </div>
        </header>

        {/* Chat Messages Body */}
        <div className="flex-1 overflow-y-auto px-4 sm:px-8 py-6 thin-scrollbar flex flex-col">
          {messages.length === 0 && !isLoading ? (
            <EmptyStateHero
              presets={presets}
              onSelectPrompt={(prompt, domain) => handleSendMessage(prompt, domain)}
            />
          ) : (
            <div className="w-full max-w-4xl mx-auto flex-1">
              {/* Existing Messages */}
              {messages.map((msg) => (
                <MessageBubble key={msg.id} message={msg} />
              ))}

              {/* Streaming Assistant Card */}
              {isLoading && (
                <MessageBubble
                  message={{
                    id: "temp-streaming",
                    session_id: activeSessionId || "temp",
                    role: "assistant",
                    content: streamingContent,
                    sql_query: streamingSql,
                    action_steps: streamingSteps,
                    created_at: new Date().toISOString(),
                  }}
                  isStreaming={true}
                />
              )}

              <div ref={messagesEndRef} className="h-4" />
            </div>
          )}
        </div>

        {/* Bottom Floating Input Bar */}
        <div className="shrink-0 bg-gradient-to-t from-[#000711] via-[#000711]/90 to-transparent pt-4">
          <ChatInputBar
            onSendMessage={handleSendMessage}
            isLoading={isLoading}
            presets={presets}
            onSelectPreset={(prompt, domain) => handleSendMessage(prompt, domain)}
          />
        </div>
      </div>
    </div>
  )
}
