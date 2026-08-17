"use client"

import React, { useState } from "react"
import { Database, ChevronDown, Copy, Check, Clock, Table } from "lucide-react"

interface SqlAccordionProps {
  sql: string
  executionTimeMs?: number
  rowCount?: number
  sourceTables?: string[]
}

export const SqlAccordion: React.FC<SqlAccordionProps> = ({
  sql,
  executionTimeMs = 0,
  rowCount = 0,
  sourceTables = [],
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const [copied, setCopied] = useState(false)

  if (!sql) return null

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation()
    navigator.clipboard.writeText(sql)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="my-3 rounded border border-white/10 bg-[#00050d] overflow-hidden transition-all duration-200 shadow-md">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-3 py-2 bg-white/[0.03] hover:bg-white/[0.06] transition-colors cursor-pointer text-left"
      >
        <div className="flex items-center gap-2">
          <Database className="w-3.5 h-3.5 text-blue-400" />
          <span className="text-xs font-medium text-white/80 font-poppins">
            Transparansi Query DuckDB
          </span>
          {executionTimeMs > 0 && (
            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-[10px] text-white/50 font-mono">
              <Clock className="w-2.5 h-2.5" />
              {executionTimeMs}ms
            </span>
          )}
          {rowCount > 0 && (
            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-[10px] text-white/50 font-mono">
              <Table className="w-2.5 h-2.5" />
              {rowCount} baris
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <ChevronDown
            className={`w-4 h-4 text-white/40 transition-transform duration-200 ${
              isOpen ? "rotate-180 text-white/80" : ""
            }`}
          />
        </div>
      </button>

      {isOpen && (
        <div className="p-3 border-t border-white/10 bg-[#000308] text-xs font-mono">
          <div className="flex items-center justify-between mb-2 pb-1 border-b border-white/5">
            <span className="text-[11px] text-white/40 uppercase tracking-wider">
              Executable Dialect: DuckDB (Read-Only)
            </span>
            <button
              onClick={handleCopy}
              className="flex items-center gap-1 text-[11px] text-white/60 hover:text-white transition-colors cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="w-3 h-3 text-emerald-400" />
                  <span className="text-emerald-400">Tersalin</span>
                </>
              ) : (
                <>
                  <Copy className="w-3 h-3" />
                  <span>Salin SQL</span>
                </>
              )}
            </button>
          </div>

          <pre className="p-2.5 rounded bg-black/60 border border-white/5 text-blue-300/90 overflow-x-auto leading-relaxed thin-scrollbar">
            <code>{sql}</code>
          </pre>

          {sourceTables && sourceTables.length > 0 && (
            <div className="mt-2 pt-2 border-t border-white/5 flex items-center gap-1.5 flex-wrap">
              <span className="text-[10px] text-white/40">Tabel Sumber:</span>
              {sourceTables.map((t, idx) => (
                <span
                  key={idx}
                  className="px-1.5 py-0.5 rounded bg-blue-500/10 border border-blue-500/20 text-blue-300 text-[10px]"
                >
                  {t}
                </span>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
