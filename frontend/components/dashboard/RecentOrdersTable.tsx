"use client";

import React, { useState } from "react";
import { Package } from "lucide-react";

export interface DeliveryOrder {
  id: string;
  customer: string;
  product?: string;
  partName?: string;
  promisedDate?: string;
  actualDate?: string;
  etd?: string;
  qty?: number;
  quantity?: number;
  value: string | number;
  plant?: string;
  status: "Completed" | "In Transit" | "Delayed";
}

interface RecentOrdersTableProps {
  orders?: DeliveryOrder[];
}

export function RecentOrdersTable({ orders = [] }: RecentOrdersTableProps) {
  const [filter, setFilter] = useState<"All" | "Completed" | "In Transit" | "Delayed">("All");

  const filteredOrders = filter === "All"
    ? orders
    : orders.filter((order) => order.status === filter);

  const statusColorMap = {
    Completed: "text-emerald-400 font-medium",
    "In Transit": "text-blue-400 font-medium",
    Delayed: "text-red-400 font-medium",
  };

  return (
    <div className="bg-[#000000] border border-white/10 rounded-none p-6 font-poppins">
      {/* Header & Filter Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <Package className="w-4 h-4 text-white/60" />
            <h3 className="text-white text-sm font-semibold font-poppins">
              Recent Delivery & Fulfillment Orders
            </h3>
            <span className="text-xs text-white/40 font-mono">
              ({orders.length} records)
            </span>
          </div>
          <p className="text-white/40 text-xs mt-1">
            Status pengiriman DO real-time terhadap SLA komitmen OEM.
          </p>
        </div>

        {/* Minimalist Filter Tabs with #0555E0 active highlight */}
        <div className="flex items-center gap-1.5 p-1 bg-[#000711] border border-white/10 text-xs self-start sm:self-auto">
          {(["All", "Completed", "In Transit", "Delayed"] as const).map((status) => {
            const count = status === "All" 
              ? orders.length 
              : orders.filter((o) => o.status === status).length;
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
      {filteredOrders.length === 0 ? (
        <div className="py-16 text-center text-white/40 text-xs font-mono">
          Belum ada data pesanan pengiriman dari MotherDuck
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-white/10 text-white/40 font-mono text-[11px]">
                <th className="pb-3 font-normal">DO NUMBER</th>
                <th className="pb-3 font-normal">CUSTOMER</th>
                <th className="pb-3 font-normal">PART NAME</th>
                <th className="pb-3 font-normal text-right">QTY (PCS)</th>
                <th className="pb-3 font-normal text-right">VALUE</th>
                <th className="pb-3 font-normal text-center">ETD / PROMISED</th>
                <th className="pb-3 font-normal text-right">STATUS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredOrders.map((order, index) => {
                const qtyVal = order.quantity ?? order.qty ?? 0;
                const valueStr = typeof order.value === "number" ? `$${order.value.toLocaleString()}` : order.value;
                const etdStr = order.etd || order.promisedDate || "-";
                const partStr = order.partName || order.product || "-";

                return (
                  <tr
                    key={`${order.id}-${partStr}-${index}`}
                    className="hover:bg-white/[0.02] transition-colors group cursor-default"
                  >
                    <td className="py-3 font-mono font-medium text-white group-hover:text-white">
                      {order.id}
                    </td>
                    <td className="py-3 text-white/70">
                      {order.customer}
                    </td>
                    <td className="py-3 text-white/60">
                      {partStr}
                    </td>
                    <td className="py-3 text-right font-mono text-white/80">
                      {qtyVal.toLocaleString()}
                    </td>
                    <td className="py-3 text-right font-mono text-white/80">
                      {valueStr}
                    </td>
                    <td className="py-3 text-center font-mono text-white/50">
                      {etdStr}
                    </td>
                    <td className="py-3 text-right">
                      <span className={statusColorMap[order.status] || "text-white/60"}>
                        {order.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
