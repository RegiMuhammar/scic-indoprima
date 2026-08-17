"use client";

import React, { useState } from "react";
import { ArrowRight, ArrowLeftRight, CheckCircle2, ShieldAlert } from "lucide-react";
import { StockBalancingItem } from "@/lib/api/demand";

interface StockBalancingMatrixProps {
  items?: StockBalancingItem[];
}

export function StockBalancingMatrix({ items = [] }: StockBalancingMatrixProps) {
  const [transfersApproved, setTransfersApproved] = useState<string[]>([]);

  const handleApproveTransfer = (skuId: string) => {
    setTransfersApproved((prev) => [...prev, skuId]);
  };

  const totalSavingsFormatted = React.useMemo(() => {
    let total = 0;
    for (const item of items) {
      const raw = item.estimated_savings_idr?.replace(/[^0-9]/g, "");
      if (raw) total += parseInt(raw, 10);
    }
    if (total === 0) return "-";
    if (total >= 1_000_000_000) {
      return `Rp ${(total / 1_000_000_000).toLocaleString("id-ID", { maximumFractionDigits: 1 })} Miliar`;
    }
    if (total >= 1_000_000) {
      return `Rp ${(total / 1_000_000).toLocaleString("id-ID", { maximumFractionDigits: 1 })} Juta`;
    }
    return `Rp ${total.toLocaleString("id-ID")}`;
  }, [items]);

  return (
    <div className="bg-[#000000] border border-white/10 p-6 font-poppins rounded-none flex flex-col justify-between">
      <div>
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2">
              <ArrowLeftRight className="w-4 h-4 text-white/60" />
              <h3 className="text-white text-sm font-semibold">
                Multi-Warehouse Stock Balancing Matrix
              </h3>
              <span className="text-xs text-white/40 font-mono">
                ({items.length} Pasang Mismatch)
              </span>
            </div>
            <p className="text-white/40 text-xs mt-1">
              Rekomendasi relokasi stok dari gudang surplus ke gudang kritis untuk menghemat pengadaan baru.
            </p>
          </div>

          <div className="text-right">
            <span className="text-xs text-white/40 block">Total Potensi Efisiensi:</span>
            <span className="text-sm font-bold font-mono text-[#0555E0]">
              {totalSavingsFormatted}
            </span>
          </div>
        </div>

        {/* Table / Empty State */}
        {items.length === 0 ? (
          <div className="py-16 text-center text-white/40 text-xs font-mono">
            Tidak ada ketidakseimbangan stok antar-gudang (Semua gudang dalam level sehat)
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-white/10 text-white/40 font-mono text-[11px]">
                  <th className="pb-3 font-normal">SKU CODE</th>
                  <th className="pb-3 font-normal">SOURCE GUDANG (OVERSTOCK)</th>
                  <th className="pb-3 font-normal text-center">TRANSFER ACTION</th>
                  <th className="pb-3 font-normal">DESTINATION GUDANG (CRITICAL)</th>
                  <th className="pb-3 font-normal text-right">SUGGESTED TRANSFER</th>
                  <th className="pb-3 font-normal text-right">SAVINGS VALUE</th>
                  <th className="pb-3 font-normal text-right">APPROVAL</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {items.map((item, index) => {
                  const isApproved = transfersApproved.includes(item.sku_id);

                  return (
                    <tr
                      key={`${item.sku_id}-${index}`}
                      className="hover:bg-white/[0.02] transition-colors group cursor-default"
                    >
                      <td className="py-3 font-mono font-medium text-white">
                        {item.sku_id}
                      </td>

                      {/* Source Warehouse */}
                      <td className="py-3">
                        <div className="text-white text-xs font-medium">{item.source_warehouse}</div>
                        <div className="text-amber-400 font-mono text-[11px]">
                          {item.source_qty} pcs &bull; DOS {item.source_dos} hari (Surplus)
                        </div>
                      </td>

                      {/* Arrow Indicator */}
                      <td className="py-3 text-center">
                        <ArrowRight className="w-3.5 h-3.5 text-[#0555E0] mx-auto" />
                      </td>

                      {/* Destination Warehouse */}
                      <td className="py-3">
                        <div className="text-white text-xs font-medium">{item.destination_warehouse}</div>
                        <div className="text-red-400 font-mono text-[11px]">
                          {item.destination_qty} pcs &bull; DOS {item.destination_dos} hari (Kritis)
                        </div>
                      </td>

                      {/* Transfer Qty */}
                      <td className="py-3 text-right font-mono font-bold text-white">
                        {item.suggested_transfer_qty.toLocaleString()} pcs
                      </td>

                      {/* Savings */}
                      <td className="py-3 text-right font-mono text-emerald-400 font-semibold">
                        {item.estimated_savings_idr}
                      </td>

                      {/* Approval Button */}
                      <td className="py-3 text-right">
                        {isApproved ? (
                          <span className="text-emerald-400 flex items-center gap-1 text-[11px] font-medium justify-end">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Transfer Approved
                          </span>
                        ) : (
                          <button
                            onClick={() => handleApproveTransfer(item.sku_id)}
                            className="px-2.5 py-1 bg-[#0555E0] hover:bg-[#0555E0]/80 text-white text-[11px] font-medium transition-colors ml-auto"
                          >
                            Approve Transfer
                          </button>
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

      {/* Footer Summary */}
      <div className="mt-4 pt-3 border-t border-white/5 flex flex-col sm:flex-row sm:items-center justify-between text-[11px] text-white/40 gap-2">
        <span>Kriteria Balancing: Source DOS &gt; 60 hari & Destination DOS &lt; 30 hari</span>
        <span>Mencegah dead stock sekaligus mengatasi potensi stockout di area pemasaran timur.</span>
      </div>
    </div>
  );
}
