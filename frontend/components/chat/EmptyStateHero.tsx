"use client"

import React from "react"
import { Sparkles, ShieldCheck } from "lucide-react"
import { DemoPreset } from "@/types/chat.types"
import { PromptSuggestions } from "./PromptSuggestions"

interface EmptyStateHeroProps {
  presets: DemoPreset[]
  onSelectPrompt: (prompt: string, domain?: string) => void
}

export const EmptyStateHero: React.FC<EmptyStateHeroProps> = ({
  presets = [],
  onSelectPrompt,
}) => {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 text-center max-w-4xl mx-auto w-full my-auto font-poppins animate-in fade-in duration-300">
      {/* 3D Glowing Intelligence Orb Graphic */}
      <div className="relative mb-6 flex items-center justify-center">
        {/* Ambient Glow */}
        <div className="absolute w-24 h-24 rounded-full bg-blue-600/20 blur-2xl animate-pulse" />
        <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-[#0555E0] to-[#011438] border border-blue-400/30 flex items-center justify-center shadow-[0_0_30px_rgba(5,85,224,0.3)]">
          <Sparkles className="w-8 h-8 text-blue-300 animate-pulse" />
        </div>
      </div>

      {/* Headline & Description */}
      <h1 className="text-2xl sm:text-3xl font-semibold text-white tracking-tight mb-2">
        Apa yang ingin Anda analisis hari ini?
      </h1>
      <p className="text-xs sm:text-sm text-white/50 max-w-lg mb-8 leading-relaxed">
        SCIC AI Copilot siap mengekstrak insight dari 34 tabel OLAP MotherDuck secara grounded, akurat, dan zero-mutation.
      </p>

      {/* Suggestions Grid */}
      <PromptSuggestions presets={presets} onSelectPrompt={onSelectPrompt} />

      {/* Safety Badge */}
      <div className="mt-8 flex items-center gap-1.5 text-[11px] text-white/30">
        <ShieldCheck className="w-3.5 h-3.5 text-emerald-400/70" />
        <span>Sandboxed Read-Only Connection • Validasi AST SQLGlot Aktif</span>
      </div>
    </div>
  )
}
