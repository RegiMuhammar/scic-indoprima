"use client"

import React, { useState, useRef, useEffect } from "react"
import { ArrowUp, Eye, Sparkles, Loader2 } from "lucide-react"
import { DemoPreset } from "@/types/chat.types"

interface ChatInputBarProps {
  onSendMessage: (content: string) => void
  isLoading?: boolean
  presets?: DemoPreset[]
  onSelectPreset?: (prompt: string, domain?: string) => void
}

export const ChatInputBar: React.FC<ChatInputBarProps> = ({
  onSendMessage,
  isLoading = false,
  presets = [],
  onSelectPreset,
}) => {
  const [input, setInput] = useState("")
  const [showPresetsMenu, setShowPresetsMenu] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`
    }
  }, [input])

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    if (!input.trim() || isLoading) return
    onSendMessage(input.trim())
    setInput("")
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"
    }
    setShowPresetsMenu(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
  }

  return (
    <div className="w-full max-w-4xl mx-auto px-4 pb-4 pt-2 font-poppins relative">
      {/* Presets Popup Dropup */}
      {showPresetsMenu && presets && presets.length > 0 && (
        <div className="absolute bottom-20 left-4 right-4 max-w-2xl mx-auto rounded-lg border border-white/10 bg-[#000814]/95 backdrop-blur-md p-3 shadow-2xl z-50 animate-in fade-in slide-in-from-bottom-2 duration-150">
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-white/10 text-xs text-white/70">
            <span className="font-medium flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-blue-400" />
              Pilih Pertanyaan Cepat
            </span>
            <button
              onClick={() => setShowPresetsMenu(false)}
              className="text-white/40 hover:text-white text-[11px] cursor-pointer"
            >
              Tutup
            </button>
          </div>
          <div className="space-y-1.5 max-h-56 overflow-y-auto thin-scrollbar">
            {presets.map((p) => (
              <button
                key={p.id}
                onClick={() => {
                  setInput(p.prompt)
                  setShowPresetsMenu(false)
                  if (textareaRef.current) textareaRef.current.focus()
                }}
                className="w-full text-left p-2 rounded hover:bg-white/5 border border-transparent hover:border-white/5 transition-colors cursor-pointer text-xs text-white/80 hover:text-white"
              >
                <div className="font-medium truncate">{p.prompt}</div>
                <div className="text-[10px] text-white/40">{p.category}</div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Main Floating Input Box */}
      <div className="relative rounded-2xl border border-white/10 bg-[#00050e]/95 backdrop-blur-md shadow-2xl focus-within:border-blue-500/50 transition-all duration-200">
        <textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ketik pertanyaan analitik (misal: 'Berapa OEE lini 1?') atau pilih contoh pertanyaan..."
          disabled={isLoading}
          rows={1}
          className="w-full bg-transparent px-4 pt-3.5 pb-10 text-xs sm:text-sm text-white placeholder-white/30 focus:outline-none resize-none leading-relaxed"
        />

        {/* Bottom Toolbar inside Input Card */}
        <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between pointer-events-auto">
          <div className="flex items-center gap-2">
            {/* Read Only Status Pill */}
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-[11px] text-white/50">
              <Eye className="w-3 h-3 text-emerald-400/80" />
              <span>Read only</span>
            </span>

            {/* Quick Template Preset Trigger Button */}
            {presets.length > 0 && (
              <button
                type="button"
                onClick={() => setShowPresetsMenu(!showPresetsMenu)}
                className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/20 text-[11px] text-blue-300 transition-colors cursor-pointer"
              >
                <Sparkles className="w-2.5 h-2.5" />
                <span>Contoh Pertanyaan</span>
              </button>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="button"
            onClick={() => handleSubmit()}
            disabled={!input.trim() || isLoading}
            className={`w-7 h-7 rounded-full flex items-center justify-center transition-all duration-150 cursor-pointer ${
              input.trim() && !isLoading
                ? "bg-[#0555E0] hover:bg-blue-600 text-white shadow-md"
                : "bg-white/10 text-white/30 cursor-not-allowed"
            }`}
          >
            {isLoading ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <ArrowUp className="w-4 h-4 stroke-[2.5]" />
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
