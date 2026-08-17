"use client"

import React, { useState } from "react"
import { Sparkles, ChevronDown, CheckCircle2, Loader2 } from "lucide-react"

interface ActionStepProgressProps {
  steps: string[]
  isStreaming?: boolean
}

export const ActionStepProgress: React.FC<ActionStepProgressProps> = ({
  steps = [],
  isStreaming = false,
}) => {
  const [isOpen, setIsOpen] = useState(true)

  if (!steps || steps.length === 0) return null

  const latestStep = steps[steps.length - 1]

  return (
    <div className="my-2 rounded border border-white/10 bg-[#000612]/90 overflow-hidden font-poppins text-xs shadow-md">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-3 py-2 bg-white/[0.02] hover:bg-white/[0.05] transition-colors cursor-pointer text-left"
      >
        <div className="flex items-center gap-2 overflow-hidden">
          {isStreaming ? (
            <Loader2 className="w-3.5 h-3.5 text-blue-400 animate-spin shrink-0" />
          ) : (
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
          )}
          <span className="font-medium text-white/80 shrink-0">
            {isStreaming ? "AI Processing Actions" : "Execution Action Trace"}
          </span>
          <span className="text-[11px] text-white/40 truncate font-mono">
            ({steps.length} langkah selesai)
          </span>
        </div>

        <ChevronDown
          className={`w-3.5 h-3.5 text-white/40 transition-transform duration-200 shrink-0 ${
            isOpen ? "rotate-180 text-white/80" : ""
          }`}
        />
      </button>

      {isOpen && (
        <div className="px-3 py-2.5 border-t border-white/5 bg-black/40 space-y-1.5 font-mono text-[11px]">
          {steps.map((step, idx) => {
            const isLast = idx === steps.length - 1
            return (
              <div
                key={idx}
                className={`flex items-start gap-2 ${
                  isLast && isStreaming
                    ? "text-blue-300 animate-pulse font-medium"
                    : "text-white/60"
                }`}
              >
                <span className="text-white/30 shrink-0">{">"}</span>
                <span className="leading-relaxed break-words">{step.replace(/^->\s*/, "")}</span>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
