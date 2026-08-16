"use client";

import React from "react";
import { ArrowUpRight, Cpu, Truck, Package, ShieldAlert } from "lucide-react";

export interface RiskEventItem {
  id: string;
  category: "Equipment" | "Logistics" | "Inventory" | "Quality";
  level: "Critical" | "High" | "Medium";
  confidence: number;
  description: string;
  impact: string;
  detectedAt: string;
}

const defaultRiskEvents: RiskEventItem[] = [
  {
    id: "RE-001",
    category: "Equipment",
    level: "Critical",
    confidence: 94,
    description: "Line 3 Stamping Press — Anomali getaran & kegagalan hidrolik",
    impact: "Potensi stop produksi 18h & backlog 1.200 unit",
    detectedAt: "35m ago",
  },
  {
    id: "RE-002",
    category: "Logistics",
    level: "High",
    confidence: 88,
    description: "Tanjung Perak Customs Queue +42h — Antrian kontainer ekspor",
    impact: "Delay pengiriman 8 delivery order OEM ($184k)",
    detectedAt: "2h ago",
  },
  {
    id: "RE-003",
    category: "Inventory",
    level: "High",
    confidence: 91,
    description: "Brake Pad 08 Aluminum — Proyeksi stockout di Gudang Surabaya",
    impact: "Shortfall 3.200 unit pada 18 Agustus 2026",
    detectedAt: "4h ago",
  },
  {
    id: "RE-004",
    category: "Quality",
    level: "Medium",
    confidence: 82,
    description: "Defect rate Shift 3 malam naik 4.8% pada lini Leaf Spring",
    impact: "Rework 120 unit & tambahan biaya lembur",
    detectedAt: "6h ago",
  },
];

interface RiskRadarChartProps {
  items?: RiskEventItem[];
  title?: string;
  subtitle?: string;
}

export function RiskRadarChart({
  items = defaultRiskEvents,
  title = "Early Warning Risk Radar",
  subtitle = "Deteksi dini sinyal kegagalan mesin, logistik, & ketidakseimbangan stok.",
}: RiskRadarChartProps) {
  const categoryIconMap = {
    Equipment: Cpu,
    Logistics: Truck,
    Inventory: Package,
    Quality: ShieldAlert,
  };

  const levelColorMap = {
    Critical: "text-red-400 font-semibold",
    High: "text-amber-400 font-semibold",
    Medium: "text-blue-400 font-semibold",
  };

  return (
    <div className="flex flex-col h-full bg-[#000000] border border-white/10 p-6 rounded-none font-poppins">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-white text-sm font-semibold font-poppins">
              {title}
            </h3>
            <span className="text-xs text-white/40 font-mono">
              ({items.length} Active Risks)
            </span>
          </div>
          <p className="text-white/40 text-xs mt-1">
            {subtitle}
          </p>
        </div>

        <button className="text-white/40 hover:text-white text-xs transition-colors flex items-center gap-1">
          <span>View all</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Risk Event List (Full-Width Responsive) */}
      <div className="divide-y divide-white/10">
        {items.map((risk) => {
          const Icon = categoryIconMap[risk.category];
          return (
            <div
              key={risk.id}
              className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:bg-white/[0.02] px-3 -mx-3 transition-colors cursor-pointer"
            >
              <div className="flex items-start sm:items-center gap-3 flex-1 min-w-0">
                <Icon className="w-4 h-4 text-white/50 shrink-0 mt-0.5 sm:mt-0" />
                <div className="space-y-0.5 flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-white font-medium text-xs">
                      {risk.description}
                    </span>
                  </div>
                  <p className="text-white/60 text-[11px]">
                    Impact: <span className="text-white/90 font-medium">{risk.impact}</span>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 shrink-0 sm:self-center pl-7 sm:pl-0">
                <span className="text-white/40 text-[11px] font-mono">
                  Confidence: {risk.confidence}%
                </span>
                <span className={`text-xs ${levelColorMap[risk.level]}`}>
                  {risk.level}
                </span>
                <span className="text-white/30 text-[10px] w-12 text-right">
                  {risk.detectedAt}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
