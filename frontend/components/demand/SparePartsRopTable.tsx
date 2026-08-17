"use client";

import React, { useState } from "react";
import { Package, ShieldAlert, CheckCircle2, ShoppingCart, ArrowUpRight } from "lucide-react";
import { SparePartItem } from "@/lib/api/demand";

interface SparePartsRopTableProps {
  items?: SparePartItem[];
}

export function SparePartsRopTable({ items = [] }: SparePartsRopTableProps) {
  const [filter, setFilter] = useState<"All" | "Reorder Triggered" | "Safe Stock">("All");
  const [selectedPart, setSelectedPart] = useState<SparePartItem | null>(null);
  const [poGenerated, setPoGenerated] = useState<string | null>(null);

  const filteredItems = filter === "All"
    ? items
    : filter === "Reorder Triggered"
    ? items.filter((p) => p.is_reorder_triggered)
    : items.filter((p) => !p.is_reorder_triggered);

  const handleGeneratePo = (part: SparePartItem) => {
    setSelectedPart(part);
    setPoGenerated(`PO-DRAFT-${part.part_id}-${Date.now().toString().slice(-4)}`);
  };

  return (
    <div className="bg-[#000000] border border-white/10 p-6 font-poppins rounded-none flex flex-col justify-between">
      {/* Header & Filter Tabs */}
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2">
              <Package className="w-4 h-4 text-white/60" />
              <h3 className="text-white text-sm font-semibold">
                Smart Reorder Point (ROP) AI Matrix — MRO Spare Parts
              </h3>
              <span className="text-xs text-white/40 font-mono">
                ({items.length} Parts Active)
              </span>
            </div>
            <p className="text-white/40 text-xs mt-1">
              Kalkulasi ROP dinamis berbasis lead time supplier & konsumsi mesin (Quick Win 2).
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 p-1 bg-[#000711] border border-white/10 text-xs self-start sm:self-auto">
            {(["All", "Reorder Triggered", "Safe Stock"] as const).map((status) => {
              const count = status === "All"
                ? items.length
                : status === "Reorder Triggered"
                ? items.filter((p) => p.is_reorder_triggered).length
                : items.filter((p) => !p.is_reorder_triggered).length;
              const isActive = filter === status;

              return (
                <button
                  key={status}
                  onClick={() => setFilter(status)}
                  className={`px-3 py-1 text-xs transition-colors flex items-center gap-1.5 ${
                    isActive
                      ? "bg-[#0555E0] text-white font-medium shadow-sm"
                      : "text-white/40 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <span>{status}</span>
                  <span
                    className={`text-[10px] px-1 font-mono ${
                      isActive ? "bg-white/20 text-white" : "bg-white/5 text-white/40"
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Table / Empty State */}
        {filteredItems.length === 0 ? (
          <div className="py-16 text-center text-white/40 text-xs font-mono">
            Belum ada data suku cadang dari MotherDuck
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-white/10 text-white/40 font-mono text-[11px]">
                  <th className="pb-3 font-normal">PART ID & NAME</th>
                  <th className="pb-3 font-normal">CATEGORY</th>
                  <th className="pb-3 font-normal">CRITICALITY</th>
                  <th className="pb-3 font-normal text-right">CURRENT STOCK</th>
                  <th className="pb-3 font-normal text-right">SMART ROP (AI)</th>
                  <th className="pb-3 font-normal text-center">LEAD TIME</th>
                  <th className="pb-3 font-normal text-right">STATUS</th>
                  <th className="pb-3 font-normal text-right">ACTION</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredItems.map((part, index) => {
                  const isTriggered = part.is_reorder_triggered;
                  const criticalityBadge =
                    part.criticality === "High"
                      ? "text-red-400 border-red-500/30 bg-red-500/10"
                      : part.criticality === "Medium"
                      ? "text-amber-400 border-amber-500/30 bg-amber-500/10"
                      : "text-white/60 border-white/10 bg-white/5";

                  return (
                    <tr
                      key={`${part.part_id}-${index}`}
                      className="hover:bg-white/[0.02] transition-colors group cursor-default"
                    >
                      <td className="py-3 font-medium">
                        <div className="text-white font-mono text-xs">{part.part_id}</div>
                        <div className="text-white/60 text-[11px]">{part.part_name}</div>
                      </td>
                      <td className="py-3 text-white/60 text-xs">
                        {part.category}
                      </td>
                      <td className="py-3">
                        <span className={`px-2 py-0.5 text-[10px] font-medium border ${criticalityBadge}`}>
                          {part.criticality}
                        </span>
                      </td>
                      <td className="py-3 text-right font-mono text-white/90">
                        <span className={part.current_stock <= part.smart_rop ? "text-red-400 font-bold" : "text-white"}>
                          {part.current_stock} pcs
                        </span>
                      </td>
                      <td className="py-3 text-right font-mono text-[#0555E0] font-semibold">
                        {part.smart_rop} pcs
                      </td>
                      <td className="py-3 text-center font-mono text-white/50 text-[11px]">
                        {part.lead_time_days} days
                      </td>
                      <td className="py-3 text-right">
                        <span className={`text-xs ${part.status_color}`}>
                          {part.status}
                        </span>
                      </td>
                      <td className="py-3 text-right">
                        {isTriggered ? (
                          <button
                            onClick={() => handleGeneratePo(part)}
                            className="px-2.5 py-1 bg-[#0555E0] hover:bg-[#0555E0]/80 text-white text-[11px] font-medium transition-colors flex items-center gap-1.5 ml-auto"
                          >
                            <ShoppingCart className="w-3 h-3" />
                            <span>Draft PO ({part.suggested_order_qty})</span>
                          </button>
                        ) : (
                          <span className="text-white/30 text-[11px] font-mono">Stock Adequate</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Human-in-the-Loop Notification Toast / Modal Confirmation */}
      {poGenerated && selectedPart && (
        <div className="mt-4 p-3.5 bg-[#0555E0]/10 border border-[#0555E0]/40 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-4 h-4 text-[#0555E0] shrink-0" />
            <div className="text-xs">
              <span className="text-white font-semibold">Draft Purchase Order Dibuat: </span>
              <span className="text-[#0555E0] font-mono font-medium">{poGenerated}</span>
              <span className="text-white/60 block text-[11px]">
                Kuantitas Rekomendasi: <b>{selectedPart.suggested_order_qty} pcs</b> ({selectedPart.part_name}) &bull; Siap di-review oleh Procurement Manager.
              </span>
            </div>
          </div>
          <button
            onClick={() => {
              setPoGenerated(null);
              setSelectedPart(null);
            }}
            className="text-xs text-white/50 hover:text-white underline font-mono shrink-0"
          >
            Tutup
          </button>
        </div>
      )}

      {/* Footer Info */}
      <div className="mt-4 pt-3 border-t border-white/5 flex flex-col sm:flex-row sm:items-center justify-between text-[11px] text-white/40 gap-2">
        <span>Formula Smart ROP = (Avg Daily Consumption &times; Lead Time) + Dynamic Buffer Safety Stock</span>
        <span>Human-in-the-Loop: AI hanya merekomendasikan, PO membutuhkan approval manusia.</span>
      </div>
    </div>
  );
}
