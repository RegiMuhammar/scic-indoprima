"use client";

import React from "react";
import { Activity, Sparkles, RefreshCw, Layers, Factory } from "lucide-react";

interface ExecutiveHeaderProps {
  activeTab: "control-tower" | "plant-oee";
  onTabChange: (tab: "control-tower" | "plant-oee") => void;
  onOpenChat?: () => void;
}

export function ExecutiveHeader({
  activeTab,
  onTabChange,
  onOpenChat,
}: ExecutiveHeaderProps) {
  return (
    <div className="bg-[#000000] border-t border-l border-white/10 font-poppins">
      {/* Top Bar: Title, Health Score & Action Buttons */}
      <div className="p-6 border-b border-r border-white/10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
        
        {/* Left: Product Title & Executive AI Summary */}
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <span className="px-2.5 py-0.5 text-[11px] font-semibold tracking-wider uppercase border border-amber-500/30 bg-amber-500/10 text-amber-400">
              Needs Attention • Health Index 78.4 / 100
            </span>
            <span className="flex items-center gap-1 text-[11px] text-white/40">
              <RefreshCw className="w-3 h-3 text-emerald-400 animate-spin-slow" />
              Live Sync: 2m ago
            </span>
          </div>

          <h1 className="text-white text-xl lg:text-2xl font-bold tracking-tight">
            Supply Chain & Manufacturing Control Tower
          </h1>

          <p className="text-white/60 text-xs mt-1.5 leading-relaxed max-w-4xl">
            <span className="text-white font-medium">AI Executive Summary:</span> Operasional pabrik & pengiriman terindikasi risiko moderat. Terdeteksi <span className="text-amber-400 font-semibold">8 delivery orders ($184.000)</span> berpotensi terlambat akibat <span className="text-red-400 font-semibold">14 jam downtime kalibrasi hidrolik Line 3</span> di Pabrik Karawang. Diperlukan tindakan mitigasi pengalihan jadwal.
          </p>
        </div>

        {/* Right: View Mode Toggle Tabs & AI Quick Launch */}
        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <div className="flex items-center border border-white/10 bg-[#0a0a0a] p-0.5">
            <button
              onClick={() => onTabChange("control-tower")}
              className={`flex items-center gap-2 px-3.5 py-1.5 text-xs font-medium transition-all ${
                activeTab === "control-tower"
                  ? "bg-white text-black font-semibold shadow-sm"
                  : "text-white/60 hover:text-white"
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              Control Tower
            </button>
            <button
              onClick={() => onTabChange("plant-oee")}
              className={`flex items-center gap-2 px-3.5 py-1.5 text-xs font-medium transition-all ${
                activeTab === "plant-oee"
                  ? "bg-white text-black font-semibold shadow-sm"
                  : "text-white/60 hover:text-white"
              }`}
            >
              <Factory className="w-3.5 h-3.5" />
              Plant OEE & Lines
            </button>
          </div>

          {onOpenChat && (
            <button
              onClick={onOpenChat}
              className="flex items-center gap-2 px-3.5 py-2 text-xs font-medium text-white bg-white/5 border border-white/20 hover:bg-white/10 hover:border-white/40 transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5 text-blue-400" />
              <span>Ask AI Copilot</span>
            </button>
          )}
        </div>

      </div>
    </div>
  );
}
