"use client"

import React, { useState } from "react"
import { Plus, Search, MessageSquare, Trash2, ChevronLeft, ChevronRight, Sparkles } from "lucide-react"
import { ChatSession } from "@/types/chat.types"

interface SessionSidebarProps {
  sessions: ChatSession[]
  activeSessionId: string | null
  onSelectSession: (id: string) => void
  onNewChat: () => void
  onDeleteSession: (id: string, e: React.MouseEvent) => void
  isOpen: boolean
  onToggleOpen: () => void
}

export const SessionSidebar: React.FC<SessionSidebarProps> = ({
  sessions = [],
  activeSessionId,
  onSelectSession,
  onNewChat,
  onDeleteSession,
  isOpen,
  onToggleOpen,
}) => {
  const [searchQuery, setSearchQuery] = useState("")

  const filteredSessions = sessions.filter((s) =>
    s.title.toLowerCase().includes(searchQuery.toLowerCase())
  )

  // Group sessions by date
  const now = new Date()
  const todayStr = now.toDateString()
  const yesterday = new Date(now)
  yesterday.setDate(yesterday.getDate() - 1)
  const yesterdayStr = yesterday.toDateString()

  const todaySessions: ChatSession[] = []
  const yesterdaySessions: ChatSession[] = []
  const olderSessions: ChatSession[] = []

  filteredSessions.forEach((s) => {
    const sDate = s.created_at ? new Date(s.created_at).toDateString() : todayStr
    if (sDate === todayStr) {
      todaySessions.push(s)
    } else if (sDate === yesterdayStr) {
      yesterdaySessions.push(s)
    } else {
      olderSessions.push(s)
    }
  })

  if (!isOpen) {
    return (
      <div className="w-14 border-r border-white/10 bg-[#00050d] flex flex-col items-center py-4 justify-between shrink-0 font-poppins">
        <div className="flex flex-col items-center gap-4">
          <button
            onClick={onToggleOpen}
            className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-white/60 hover:text-white transition-colors cursor-pointer"
            title="Buka Sidebar"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
          <button
            onClick={onNewChat}
            className="w-8 h-8 rounded-lg bg-[#0555E0] hover:bg-blue-600 flex items-center justify-center text-white shadow-md transition-colors cursor-pointer"
            title="Chat Baru"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>
    )
  }

  return (
    <aside className="w-64 sm:w-72 border-r border-white/10 bg-[#00050d] flex flex-col justify-between shrink-0 font-poppins transition-all duration-200">
      {/* Header */}
      <div className="p-3.5 border-b border-white/10">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-[#0555E0] flex items-center justify-center shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="text-xs font-bold text-white tracking-wide">SCIC AI Copilot</span>
          </div>

          <button
            onClick={onToggleOpen}
            className="p-1 rounded hover:bg-white/5 text-white/40 hover:text-white transition-colors cursor-pointer"
            title="Tutup Sidebar"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
        </div>

        {/* New Chat Button */}
        <button
          onClick={onNewChat}
          className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-[#0555E0] hover:bg-blue-600 text-white text-xs font-medium shadow-md transition-all cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Chat</span>
        </button>

        {/* Search Bar */}
        <div className="relative mt-2.5">
          <Search className="w-3.5 h-3.5 text-white/30 absolute left-2.5 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari percakapan..."
            className="w-full bg-white/[0.04] border border-white/10 rounded-md pl-8 pr-2.5 py-1.5 text-xs text-white placeholder-white/30 focus:outline-none focus:border-blue-500/50"
          />
        </div>
      </div>

      {/* Session Groups List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-4 thin-scrollbar">
        {/* Today */}
        {todaySessions.length > 0 && (
          <div>
            <div className="text-[10px] font-semibold text-white/40 uppercase tracking-wider px-2 mb-1.5">
              Hari Ini
            </div>
            <div className="space-y-0.5">
              {todaySessions.map((session) => (
                <SessionItem
                  key={session.id}
                  session={session}
                  isActive={session.id === activeSessionId}
                  onSelect={() => onSelectSession(session.id)}
                  onDelete={(e) => onDeleteSession(session.id, e)}
                />
              ))}
            </div>
          </div>
        )}

        {/* Yesterday */}
        {yesterdaySessions.length > 0 && (
          <div>
            <div className="text-[10px] font-semibold text-white/40 uppercase tracking-wider px-2 mb-1.5">
              Kemarin
            </div>
            <div className="space-y-0.5">
              {yesterdaySessions.map((session) => (
                <SessionItem
                  key={session.id}
                  session={session}
                  isActive={session.id === activeSessionId}
                  onSelect={() => onSelectSession(session.id)}
                  onDelete={(e) => onDeleteSession(session.id, e)}
                />
              ))}
            </div>
          </div>
        )}

        {/* Older */}
        {olderSessions.length > 0 && (
          <div>
            <div className="text-[10px] font-semibold text-white/40 uppercase tracking-wider px-2 mb-1.5">
              7 Hari Terakhir
            </div>
            <div className="space-y-0.5">
              {olderSessions.map((session) => (
                <SessionItem
                  key={session.id}
                  session={session}
                  isActive={session.id === activeSessionId}
                  onSelect={() => onSelectSession(session.id)}
                  onDelete={(e) => onDeleteSession(session.id, e)}
                />
              ))}
            </div>
          </div>
        )}

        {filteredSessions.length === 0 && (
          <div className="text-center py-8 text-xs text-white/30">
            {searchQuery ? "Tidak ada percakapan cocok." : "Belum ada riwayat percakapan."}
          </div>
        )}
      </div>

      {/* Footer Info */}
      <div className="p-3 border-t border-white/10 text-[10px] text-white/30 text-center">
        MotherDuck OLAP • PT Indoprima
      </div>
    </aside>
  )
}

function SessionItem({
  session,
  isActive,
  onSelect,
  onDelete,
}: {
  session: ChatSession
  isActive: boolean
  onSelect: () => void
  onDelete: (e: React.MouseEvent) => void
}) {
  return (
    <div
      onClick={onSelect}
      className={`group flex items-center justify-between px-2.5 py-2 rounded-md text-xs cursor-pointer transition-colors ${
        isActive
          ? "bg-white/[0.08] text-white font-medium border border-white/10"
          : "text-white/70 hover:bg-white/[0.04] hover:text-white border border-transparent"
      }`}
    >
      <div className="flex items-center gap-2 truncate pr-2">
        <MessageSquare className={`w-3.5 h-3.5 shrink-0 ${isActive ? "text-blue-400" : "text-white/40"}`} />
        <span className="truncate">{session.title}</span>
      </div>

      <button
        onClick={onDelete}
        className="opacity-0 group-hover:opacity-100 p-1 hover:text-red-400 text-white/30 transition-all cursor-pointer shrink-0"
        title="Hapus Sesi"
      >
        <Trash2 className="w-3 h-3" />
      </button>
    </div>
  )
}
