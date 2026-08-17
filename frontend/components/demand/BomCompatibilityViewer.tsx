"use client";

import React, { useState } from "react";
import { Cpu } from "lucide-react";
import { BomCompatibilityItem } from "@/lib/api/demand";

interface BomCompatibilityViewerProps {
  items?: BomCompatibilityItem[];
}

export function BomCompatibilityViewer({ items = [] }: BomCompatibilityViewerProps) {
  const [selectedLine, setSelectedLine] = useState<string>("All");

  const lines = Array.from(new Set(items.map((i) => i.line_id))).filter(Boolean);

  const filteredItems = selectedLine === "All"
    ? items
    : items.filter((i) => i.line_id === selectedLine);

  return (
    <div className="bg-[#000000] border border-white/10 p-6 font-poppins rounded-none">
      {/* Header & Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <Cpu className="w-4 h-4 text-white/60" />
            <h3 className="text-white text-sm font-semibold">
              Kesesuaian Suku Cadang Mesin (BOM Compatibility)
            </h3>
            <span className="text-xs text-white/40 font-mono">
              ({items.length} Pemetaan)
            </span>
          </div>
          <p className="text-white/40 text-xs mt-1">
            Daftar suku cadang yang terpasang pada masing-masing mesin dan estimasi siklus pergantian.
          </p>
        </div>

        {/* Line Filter */}
        <div className="flex items-center gap-1.5 p-1 bg-[#000711] border border-white/10 text-xs self-start sm:self-auto">
          {["All", ...lines].map((lineId) => (
            <button
              key={lineId}
              onClick={() => setSelectedLine(lineId)}
              className={`px-3 py-1 text-xs transition-colors ${
                selectedLine === lineId
                  ? "bg-[#0555E0] text-white font-medium"
                  : "text-white/40 hover:text-white hover:bg-white/5"
              }`}
            >
              {lineId}
            </button>
          ))}
        </div>
      </div>

      {/* Grid Cards — Minimalist 4 Key Information Points */}
      {filteredItems.length === 0 ? (
        <div className="py-12 text-center text-white/40 text-xs font-mono">
          Belum ada pemetaan BOM compatibility dari MotherDuck
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {filteredItems.map((bom, index) => (
            <div
              key={`${bom.bom_id}-${index}`}
              className="p-4 bg-[#000711] border border-white/10 hover:border-white/20 transition-colors"
            >
              {/* 1. Mesin & Lini Produksi */}
              <div className="flex items-center justify-between text-[11px] text-white/40 font-mono mb-1">
                <span>{bom.line_id}</span>
                <span>{bom.machine_id}</span>
              </div>
              <h4 className="text-white text-xs font-semibold mb-3">
                {bom.machine_name}
              </h4>

              {/* 2. Suku Cadang Terpasang */}
              <div className="space-y-1.5 text-xs border-t border-white/5 pt-2.5">
                <div className="flex justify-between items-start gap-2">
                  <span className="text-white/50 text-[11px]">Suku Cadang:</span>
                  <span className="text-white font-medium text-right text-[11px]">
                    {bom.part_name}
                  </span>
                </div>

                {/* 3. Kebutuhan Unit */}
                <div className="flex justify-between items-center">
                  <span className="text-white/50 text-[11px]">Kebutuhan:</span>
                  <span className="text-white font-mono font-semibold text-[11px]">
                    {bom.qty_required} unit / mesin
                  </span>
                </div>

                {/* 4. Siklus Penggantian */}
                <div className="flex justify-between items-center">
                  <span className="text-white/50 text-[11px]">Siklus Ganti:</span>
                  <span className="text-white/80 font-mono text-[11px]">
                    Setiap {bom.replacement_freq_days} hari
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
