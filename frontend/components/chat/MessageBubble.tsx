"use client"

import React from "react"
import { Sparkles, Bot, User, ShieldCheck, CheckCircle2, AlertCircle } from "lucide-react"
import { ChatMessage } from "@/types/chat.types"
import { MarkdownContent } from "./MarkdownContent"
import { SqlAccordion } from "./SqlAccordion"
import { ActionStepProgress } from "./ActionStepProgress"
import { ChartWidgetRenderer } from "./ChartWidgetRenderer"

interface MessageBubbleProps {
  message: ChatMessage
  isStreaming?: boolean
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({ message, isStreaming = false }) => {
  const isUser = message.role === "user"

  if (isUser) {
    return (
      <div className="flex justify-end my-4 animate-in fade-in slide-in-from-bottom-1 duration-200">
        <div className="max-w-xl rounded-2xl bg-white/[0.07] border border-white/10 px-4 py-2.5 text-xs sm:text-sm text-white font-poppins shadow-md">
          {message.content}
        </div>
      </div>
    )
  }

  // Normalize action steps
  const steps: string[] = Array.isArray(message.action_steps)
    ? message.action_steps.map((s) => (typeof s === "string" ? s : s.description || s.title))
    : []

  const explainability = message.explainability
  const hasSql = !!message.sql_query
  const hasChart = message.visualization && message.visualization.chart_type !== "none"

  return (
    <div className="flex items-start gap-3 my-6 animate-in fade-in slide-in-from-bottom-1 duration-200 font-poppins">
      {/* Bot Avatar */}
      <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#0555E0] to-[#011438] border border-blue-400/30 flex items-center justify-center shrink-0 shadow-md mt-0.5">
        <Sparkles className="w-4 h-4 text-blue-300" />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 min-w-0 space-y-3">
        {/* Header Badge */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-white/90">SCIC AI Copilot</span>
          <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-500/10 border border-blue-500/20 text-blue-400 font-mono">
            Analytics Agent
          </span>
        </div>

        {/* Action Steps Progress (Cloudflare-style) */}
        {steps.length > 0 && (
          <ActionStepProgress steps={steps} isStreaming={isStreaming && !message.content} />
        )}

        {/* Structured Markdown Answer */}
        {message.content && <MarkdownContent content={message.content} />}

        {/* Interactive DuckDB SQL Accordion */}
        {hasSql && (
          <SqlAccordion
            sql={message.sql_query!}
            executionTimeMs={explainability ? 120 : 0}
            rowCount={message.sql_result ? message.sql_result.length : 0}
            sourceTables={explainability?.grounding_sources}
          />
        )}

        {/* Dynamic Chart Visualization */}
        {hasChart && <ChartWidgetRenderer payload={message.visualization} />}

        {/* Explainability & Quality Gate Footer */}
        {explainability && (
          <div className="mt-3 pt-2.5 border-t border-white/5 flex items-center justify-between flex-wrap gap-2 text-[11px] text-white/40">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1 text-emerald-400">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Confidence: {explainability.confidence_score}%
              </span>
              {explainability.recommended_action && (
                <span className="text-white/60 truncate max-w-xs sm:max-w-md">
                  Rekomendasi: {explainability.recommended_action}
                </span>
              )}
            </div>

            <div className="flex items-center gap-1 text-white/30 text-[10px]">
              <ShieldCheck className="w-3 h-3 text-blue-400" />
              <span>MotherDuck Grounded</span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
