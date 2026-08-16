"use client";

import React, { useState } from "react";
import { Package } from "lucide-react";

export interface DeliveryOrder {
  id: string;
  customer: string;
  product: string;
  promisedDate: string;
  actualDate: string;
  qty: number;
  value: number;
  plant: string;
  status: "Completed" | "In Transit" | "Delayed";
}

const defaultRecentOrders: DeliveryOrder[] = [
  {
    id: "DO-202500",
    customer: "CUST-0005 (PT Astra Honda Motor)",
    product: "PRD-005 (Leaf Spring Assembly Heavy)",
    promisedDate: "2025-11-10",
    actualDate: "2025-11-10",
    qty: 100,
    value: 15000,
    plant: "PLT-BKS-03",
    status: "Completed",
  },
  {
    id: "DO-202501",
    customer: "CUST-0001 (Toyota Motor Mfg)",
    product: "PRD-004 (Stabilizer Bar 28mm OEM)",
    promisedDate: "2025-11-19",
    actualDate: "-",
    qty: 1000,
    value: 2500,
    plant: "PLT-KRW-02",
    status: "Delayed",
  },
  {
    id: "DO-202502",
    customer: "CUST-0020 (PT Suzuki Indomobil)",
    product: "PRD-011 (Coil Spring Heavy Duty)",
    promisedDate: "2026-08-01",
    actualDate: "2026-07-31",
    qty: 100,
    value: 15000,
    plant: "PLT-KRW-02",
    status: "Completed",
  },
  {
    id: "DO-202506",
    customer: "CUST-0014 (PT Isuzu Astra Motor)",
    product: "PRD-009 (Brake Pad Assembly Semi-Met)",
    promisedDate: "2026-04-16",
    actualDate: "-",
    qty: 500,
    value: 25000,
    plant: "PLT-KRW-02",
    status: "Delayed",
  },
  {
    id: "DO-202507",
    customer: "CUST-0017 (PT Hino Motors Mfg)",
    product: "PRD-006 (Parabolic Leaf Spring)",
    promisedDate: "2026-07-28",
    actualDate: "2026-07-27",
    qty: 500,
    value: 75000,
    plant: "PLT-SBY-01",
    status: "Completed",
  },
  {
    id: "DO-202510",
    customer: "CUST-0007 (PT Mitsubishi Motors)",
    product: "PRD-006 (Parabolic Leaf Spring)",
    promisedDate: "2026-07-03",
    actualDate: "-",
    qty: 800,
    value: 42000,
    plant: "PLT-KRW-02",
    status: "In Transit",
  },
  {
    id: "DO-202511",
    customer: "CUST-0003 (PT Hyundai Motor ID)",
    product: "PRD-009 (Brake Pad Assembly Semi-Met)",
    promisedDate: "2025-11-11",
    actualDate: "-",
    qty: 800,
    value: 25000,
    plant: "PLT-SBY-01",
    status: "Delayed",
  },
  {
    id: "DO-202512",
    customer: "CUST-0003 (PT Hyundai Motor ID)",
    product: "PRD-004 (Stabilizer Bar 28mm OEM)",
    promisedDate: "2026-06-02",
    actualDate: "2026-06-01",
    qty: 800,
    value: 40000,
    plant: "PLT-KRW-02",
    status: "Completed",
  },
];

interface RecentOrdersTableProps {
  orders?: DeliveryOrder[];
}

export function RecentOrdersTable({ orders = defaultRecentOrders }: RecentOrdersTableProps) {
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
            Status pengiriman langsung dari SAP S/4HANA ERP & Indoprima Logistics.
          </p>
        </div>

        {/* Filter Buttons */}
        <div className="flex items-center gap-1 bg-[#000711] border border-white/10 p-0.5">
          {(["All", "Completed", "In Transit", "Delayed"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-3 py-1 text-xs font-medium transition-colors ${
                filter === tab
                  ? "bg-[#0555E0] text-white font-semibold"
                  : "text-white/50 hover:text-white"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-white/10 text-white/40 text-[11px] uppercase tracking-wider">
              <th className="py-3 px-3">Order ID</th>
              <th className="py-3 px-3">Customer & OEM</th>
              <th className="py-3 px-3">Product SKU</th>
              <th className="py-3 px-3">Promised Date</th>
              <th className="py-3 px-3">Actual Date</th>
              <th className="py-3 px-3 text-right">Qty</th>
              <th className="py-3 px-3 text-right">Value ($)</th>
              <th className="py-3 px-3">Plant Origin</th>
              <th className="py-3 px-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {filteredOrders.map((order) => (
              <tr
                key={order.id}
                className="hover:bg-white/[0.02] transition-colors"
              >
                <td className="py-3.5 px-3 text-white font-mono font-medium">
                  {order.id}
                </td>
                <td className="py-3.5 px-3 text-white/80 truncate max-w-[200px]">
                  {order.customer}
                </td>
                <td className="py-3.5 px-3 text-white/70 truncate max-w-[220px]">
                  {order.product}
                </td>
                <td className="py-3.5 px-3 text-white/60 font-mono">
                  {order.promisedDate}
                </td>
                <td className="py-3.5 px-3 text-white/60 font-mono">
                  {order.actualDate}
                </td>
                <td suppressHydrationWarning className="py-3.5 px-3 text-white/90 text-right font-mono font-medium">
                  {order.qty.toLocaleString("en-US")} pcs
                </td>
                <td suppressHydrationWarning className="py-3.5 px-3 text-white text-right font-mono font-semibold">
                  ${order.value.toLocaleString("en-US")}
                </td>
                <td className="py-3.5 px-3 text-white/50 font-mono text-[11px]">
                  {order.plant}
                </td>
                <td className="py-3.5 px-3">
                  <span className={`text-[11px] ${statusColorMap[order.status]}`}>
                    {order.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
