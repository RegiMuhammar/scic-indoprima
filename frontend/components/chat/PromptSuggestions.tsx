"use client"

import React, { useState } from "react"
import { Factory, Wrench, Truck, Package, DollarSign, Sparkles, ArrowUpRight } from "lucide-react"
import { DemoPreset } from "@/types/chat.types"

interface PromptSuggestionsProps {
  presets: DemoPreset[]
  onSelectPrompt: (prompt: string, domain?: string) => void
}

const CATEGORIES = [
  { id: "all", label: "Semua Kategori", icon: Sparkles },
  { id: "manufacturing", label: "Manufaktur & OEE", icon: Factory },
  { id: "inventory_mro", label: "Suku Cadang & MRO", icon: Wrench },
  { id: "supply_chain", label: "Logistik & OTD", icon: Truck },
  { id: "finance", label: "Rekonsiliasi Faktur", icon: DollarSign },
]

export const PromptSuggestions: React.FC<PromptSuggestionsProps> = ({
  presets = [],
  onSelectPrompt,
}) => {
  const [activeCategory, setActiveCategory] = useState("all")

  const filteredPresets =
    activeCategory === "all"
      ? presets
      : presets.filter((p) => p.domain === activeCategory)

  return (
    <div className="w-full max-w-4xl mx-auto space-y-4 font-poppins">
      {/* Category Pills Switcher */}
      <div className="flex items-center justify-center gap-1.5 flex-wrap">
        {CATEGORIES.map((cat) => {
          const Icon = cat.icon
          const isActive = activeCategory === cat.id
          return (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-150 cursor-pointer ${
                isActive
                  ? "bg-blue-600/20 text-blue-400 border border-blue-500/40 shadow-sm"
                  : "bg-white/[0.03] hover:bg-white/[0.07] text-white/60 border border-white/5 hover:text-white"
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{cat.label}</span>
            </button>
          )
        })}
      </div>

      {/* Preset Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
        {filteredPresets.map((preset) => {
          return (
            <button
              key={preset.id}
              onClick={() => onSelectPrompt(preset.prompt, preset.domain)}
              className="group relative flex flex-col justify-between p-3.5 rounded border border-white/10 bg-[#00050d] hover:bg-white/[0.04] hover:border-blue-500/30 transition-all duration-200 text-left cursor-pointer shadow-md"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <span className="text-[10px] uppercase font-semibold tracking-wider text-blue-400/90 bg-blue-500/10 px-1.5 py-0.5 rounded">
                    {preset.category}
                  </span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-white/30 group-hover:text-blue-400 transition-colors" />
                </div>
                <h4 className="text-xs font-medium text-white/90 group-hover:text-white line-clamp-2 leading-relaxed">
                  "{preset.prompt}"
                </h4>
              </div>
              <p className="text-[11px] text-white/40 mt-2 line-clamp-1">
                {preset.subtitle}
              </p>
            </button>
          )
        })}
      </div>
    </div>
  )
}
