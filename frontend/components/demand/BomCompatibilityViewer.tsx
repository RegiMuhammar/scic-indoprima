"use client";

import React, { useState } from "react";
import { Cpu, AlertTriangle, CheckCircle2 } from "lucide-react";
import { BomCompatibilityItem } from "@/lib/api/demand";

interface BomCompatibilityViewerProps {
  items?: BomCompatibilityItem[];
}

export function BomCompatibilityViewer({ items = [] }: BomCompatibilityViewerProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("Semua");

  // Build machine category list from data
  const categories = Array.from(new Set(items.map((i) => i.machine_category))).filter(Boolean);

  const filteredItems = selectedCategory === "Semua"
    ? items
    : items.filter((i) => i.machine_category === selectedCategory);

  return (
    <div className="bg-[#000000] border border-white/10 p-6 font-poppins rounded-none">
      {/* Header & Category Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <Cpu className="w-4 h-4 text-white/60" />
            <h3 className="text-white text-sm font-semibold">
              Kesesuaian Suku Cadang per Mesin
            </h3>
          </div>
          <p className="text-white/40 text-xs mt-1">
            Pemetaan suku cadang yang terpasang pada setiap mesin, kesiapan stok gudang, dan estimasi jadwal servis berikutnya.
          </p>
        </div>

        {/* Machine Category Filter */}
        <div className="flex items-center gap-1.5 p-1 bg-[#000711] border border-white/10 text-xs self-start sm:self-auto flex-wrap">
          {["Semua", ...categories].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 text-xs transition-colors whitespace-nowrap ${
                selectedCategory === cat
                  ? "bg-[#0555E0] text-white font-medium"
                  : "text-white/40 hover:text-white hover:bg-white/5"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Cards Grid */}
      {filteredItems.length === 0 ? (
        <div className="py-12 text-center text-white/40 text-xs font-mono">
          Belum ada data kesesuaian suku cadang mesin
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {filteredItems.map((bom, index) => {
            const isUrgent = bom.next_maintenance_days <= 14;
            const borderColor = !bom.is_stock_ready
              ? "border-red-500/30"
              : isUrgent
              ? "border-amber-500/30"
              : "border-white/10";

            return (
              <div
                key={`${bom.bom_id}-${index}`}
                className={`p-4 bg-[#000711] border ${borderColor} hover:border-white/20 transition-colors`}
              >
                {/* Row 1: Machine Name (Primary — Largest Text) */}
                <h4 className="text-white text-[13px] font-semibold leading-snug mb-0.5">
                  {bom.machine_name}
                </h4>
                <div className="text-[11px] text-white/40 font-mono mb-3">
                  {bom.machine_category} &bull; {bom.line_id}
                </div>

                {/* Row 2–4: Key-Value Pairs with Clear Hierarchy */}
                <div className="space-y-2 text-[11px]">
                  {/* Suku Cadang Terpasang */}
                  <div>
                    <span className="text-white/40 block text-[10px] uppercase tracking-wider mb-0.5">Suku Cadang Terpasang</span>
                    <span className="text-white text-xs font-medium">{bom.part_name}</span>
                    <span className="text-white/30 font-mono text-[10px] ml-1.5">({bom.qty_required} unit/mesin)</span>
                  </div>

                  {/* Kesiapan Stok Gudang */}
                  <div className="flex items-center justify-between">
                    <span className="text-white/40 text-[10px] uppercase tracking-wider">Stok Gudang</span>
                    <div className="flex items-center gap-1.5">
                      {bom.is_stock_ready ? (
                        <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                      ) : (
                        <AlertTriangle className="w-3 h-3 text-red-400" />
                      )}
                      <span className={`font-mono font-medium ${bom.is_stock_ready ? "text-emerald-400" : "text-red-400"}`}>
                        {bom.available_stock} unit
                      </span>
                      <span className={`text-[10px] px-1.5 py-0.5 font-medium ${
                        bom.is_stock_ready
                          ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                          : "bg-red-500/10 text-red-400 border border-red-500/20"
                      }`}>
                        {bom.is_stock_ready ? "Siap" : "Kurang"}
                      </span>
                    </div>
                  </div>

                  {/* Jadwal Servis Berikutnya */}
                  <div className="flex items-center justify-between pt-1.5 border-t border-white/5">
                    <span className="text-white/40 text-[10px] uppercase tracking-wider">Servis Berikutnya</span>
                    <span className={`font-mono font-semibold text-xs ${
                      isUrgent ? "text-amber-400" : "text-white/70"
                    }`}>
                      {bom.next_maintenance_days} hari lagi
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
