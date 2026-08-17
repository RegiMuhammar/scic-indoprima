"use client";

import React, { useState } from "react";
import { Cpu, Layers, ArrowRight, ShieldCheck } from "lucide-react";
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
              BOM Machine Compatibility Explorer
            </h3>
            <span className="text-xs text-white/40 font-mono">
              ({items.length} Mappings)
            </span>
          </div>
          <p className="text-white/40 text-xs mt-1">
            Pemetaan kecocokan suku cadang terhadap aset mesin & frekuensi penggantian (dim_bom_compatibility).
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
                  ? "bg-[#0555E0] text-white font-medium shadow-sm"
                  : "text-white/40 hover:text-white hover:bg-white/5"
              }`}
            >
              {lineId}
            </button>
          ))}
        </div>
      </div>

      {/* Grid Cards / Fallback */}
      {filteredItems.length === 0 ? (
        <div className="py-16 text-center text-white/40 text-xs font-mono">
          Belum ada pemetaan BOM compatibility dari MotherDuck
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {filteredItems.map((bom, index) => (
            <div
              key={`${bom.bom_id}-${index}`}
              className="p-4 bg-[#000711] border border-white/10 hover:border-white/20 transition-colors flex flex-col justify-between"
            >
              <div>
                {/* Line & Machine Header */}
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-mono px-1.5 py-0.5 bg-white/5 text-white/60 border border-white/10">
                    {bom.line_id}
                  </span>
                  <span className="text-[11px] font-mono text-white/40">
                    {bom.machine_id}
                  </span>
                </div>

                <h4 className="text-white text-xs font-semibold mb-1">
                  {bom.machine_name}
                </h4>

                {/* Compatibility Link Arrow */}
                <div className="my-2.5 p-2 bg-white/[0.02] border border-white/5 flex items-center justify-between">
                  <div className="min-w-0 flex-1">
                    <span className="text-[10px] text-white/40 font-mono block">PART INSTALLED</span>
                    <span className="text-xs text-[#0555E0] font-medium truncate block">
                      {bom.part_name}
                    </span>
                    <span className="text-[10px] text-white/40 font-mono">
                      {bom.part_id} &bull; {bom.part_category}
                    </span>
                  </div>
                  <div className="text-right pl-2 shrink-0">
                    <span className="text-xs font-bold font-mono text-white block">
                      {bom.qty_required} pcs
                    </span>
                    <span className="text-[10px] text-white/40">per mesin</span>
                  </div>
                </div>
              </div>

              {/* Replacement Cycle Footer */}
              <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[10px] text-white/40 font-mono">
                <span>Siklus Ganti: <b className="text-white">{bom.replacement_freq_days} Hari</b></span>
                <span className="text-emerald-400 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" /> Compatible
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
