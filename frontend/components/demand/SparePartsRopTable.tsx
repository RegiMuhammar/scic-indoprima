"use client";

import React, { useState } from "react";
import { Package, ShoppingCart, CheckCircle2 } from "lucide-react";
import { SparePartItem } from "@/lib/api/demand";

interface SparePartsRopTableProps {
  items?: SparePartItem[];
}

export function SparePartsRopTable({ items = [] }: SparePartsRopTableProps) {
  const [filter, setFilter] = useState<"All" | "Perlu Pesan Ulang" | "Stok Aman">("All");
  const [selectedPart, setSelectedPart] = useState<SparePartItem | null>(null);
  const [poGenerated, setPoGenerated] = useState<string | null>(null);

  const filteredItems = filter === "All"
    ? items
    : filter === "Perlu Pesan Ulang"
    ? items.filter((p) => p.is_reorder_triggered)
    : items.filter((p) => !p.is_reorder_triggered);

  const handleGeneratePo = (part: SparePartItem) => {
    setSelectedPart(part);
    setPoGenerated(`PO-DRAFT-${part.part_id}-${Date.now().toString().slice(-4)}`);
  };

  return (
    <div className="bg-[#000000] border border-white/10 p-6 font-poppins rounded-none flex flex-col justify-between w-full">
      {/* Header & Filter Tabs */}
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2">
              <Package className="w-4 h-4 text-white/60" />
              <h3 className="text-white text-sm font-semibold">
                Status Ketersediaan & Batas Pemesanan Suku Cadang
              </h3>
              <span className="text-xs text-white/40 font-mono">
                ({items.length} Suku Cadang)
              </span>
            </div>
            <p className="text-white/40 text-xs mt-1">
              Pantau jumlah stok suku cadang mesin, batas minimum pemesanan (Reorder Point), dan estimasi waktu kirim supplier.
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 p-1 bg-[#000711] border border-white/10 text-xs self-start sm:self-auto">
            {(["All", "Perlu Pesan Ulang", "Stok Aman"] as const).map((statusLabel) => {
              const count = statusLabel === "All"
                ? items.length
                : statusLabel === "Perlu Pesan Ulang"
                ? items.filter((p) => p.is_reorder_triggered).length
                : items.filter((p) => !p.is_reorder_triggered).length;
              const isActive = filter === statusLabel;

              return (
                <button
                  key={statusLabel}
                  onClick={() => setFilter(statusLabel)}
                  className={`px-3 py-1 text-xs transition-colors flex items-center gap-1.5 ${
                    isActive
                      ? "bg-[#0555E0] text-white font-medium"
                      : "text-white/40 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <span>{statusLabel}</span>
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
          <div className="overflow-x-auto w-full">
            <table className="w-full text-left text-xs border-collapse min-w-[900px]">
              <thead>
                <tr className="border-b border-white/10 text-white/40 font-mono text-[11px]">
                  <th className="pb-3 font-normal">KODE & NAMA SUKU CADANG</th>
                  <th className="pb-3 font-normal">KATEGORI</th>
                  <th className="pb-3 font-normal text-center">TINGKAT KRITIS</th>
                  <th className="pb-3 font-normal text-right">STOK SAAT INI</th>
                  <th className="pb-3 font-normal text-right">BATAS MINIMUM</th>
                  <th className="pb-3 font-normal text-center">WAKTU KIRIM</th>
                  <th className="pb-3 font-normal text-right">TINDAKAN</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredItems.map((part, index) => {
                  const isTriggered = part.is_reorder_triggered;
                  const criticalityLabel =
                    part.criticality === "High" ? "Tinggi" : part.criticality === "Medium" ? "Sedang" : "Normal";

                  return (
                    <tr
                      key={`${part.part_id}-${index}`}
                      className="hover:bg-white/[0.02] transition-colors group cursor-default"
                    >
                      {/* 1. Part Code & Name */}
                      <td className="py-3.5 pr-4">
                        <div className="text-white font-mono font-medium text-xs">{part.part_id}</div>
                        <div className="text-white/60 text-[11px] mt-0.5">{part.part_name}</div>
                      </td>

                      {/* 2. Category */}
                      <td className="py-3.5 pr-4 text-white/60 text-xs">
                        {part.category}
                      </td>

                      {/* 3. Criticality */}
                      <td className="py-3.5 px-2 text-center">
                        <span className="text-[10px] font-mono text-white/70 px-2 py-0.5 border border-white/10 bg-white/5">
                          {criticalityLabel}
                        </span>
                      </td>

                      {/* 4. Current Stock */}
                      <td className="py-3.5 px-4 text-right font-mono text-xs">
                        <span className={isTriggered ? "text-red-400 font-bold" : "text-white"}>
                          {part.current_stock} pcs
                        </span>
                      </td>

                      {/* 5. Minimum Buffer / ROP */}
                      <td className="py-3.5 px-4 text-right font-mono text-xs text-white/70">
                        {part.smart_rop} pcs
                      </td>

                      {/* 6. Lead Time */}
                      <td className="py-3.5 px-4 text-center font-mono text-white/50 text-[11px]">
                        {part.lead_time_days} hari
                      </td>

                      {/* 7. Action */}
                      <td className="py-3.5 pl-4 text-right">
                        {isTriggered ? (
                          <button
                            onClick={() => handleGeneratePo(part)}
                            className="px-3 py-1.5 bg-[#0555E0] hover:bg-[#0555E0]/85 text-white text-[11px] font-medium transition-colors inline-flex items-center gap-1.5 shadow-sm"
                          >
                            <ShoppingCart className="w-3 h-3" />
                            <span>Pesan ({part.suggested_order_qty} pcs)</span>
                          </button>
                        ) : (
                          <span className="text-white/30 text-[11px] font-mono">Stok Cukup</span>
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

      {/* Human-in-the-Loop Notification Toast */}
      {poGenerated && selectedPart && (
        <div className="mt-4 p-3.5 bg-[#0555E0]/10 border border-[#0555E0]/30 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-4 h-4 text-[#0555E0] shrink-0" />
            <div className="text-xs">
              <span className="text-white font-semibold">Draft Pemesanan (PO) Dibuat: </span>
              <span className="text-[#0555E0] font-mono font-medium">{poGenerated}</span>
              <span className="text-white/60 block text-[11px] mt-0.5">
                Kuantitas: <b>{selectedPart.suggested_order_qty} pcs</b> ({selectedPart.part_name}) &bull; Siap untuk ditinjau oleh tim Procurement.
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
        <span>Batas Minimum (ROP) = Konsumsi Harian &times; Waktu Pengiriman Supplier + Cadangan Keamanan</span>
        <span>Human-in-the-Loop: Sistem hanya merekomendasikan, pesanan memerlukan persetujuan manual.</span>
      </div>
    </div>
  );
}
