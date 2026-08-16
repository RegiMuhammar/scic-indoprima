"use client";

import React from "react";
import { ArrowUpRight, Cpu, Truck, Package, ShieldAlert } from "lucide-react";

export interface RiskEventItem {
  id: string;
  category: "Equipment" | "Logistics" | "Inventory" | "Quality" | string;
  level: "Critical" | "High" | "Medium" | "Low" | string;
  confidence: number;
  description: string;
  impact: string;
  detectedAt: string;
}

interface RiskRadarChartProps {
  items?: RiskEventItem[];
  title?: string;
  subtitle?: string;
}

export function RiskRadarChart({
  items = [],
  title = "Early Warning Risk Radar",
  subtitle = "Deteksi dini sinyal kegagalan mesin, logistik, & ketidakseimbangan stok.",
}: RiskRadarChartProps) {
  const categoryIconMap: Record<string, React.ElementType> = {
    Equipment: Cpu,
    Logistics: Truck,
    Inventory: Package,
    Quality: ShieldAlert,
  };

  const levelColorMap: Record<string, string> = {
    Critical: "text-red-400 font-semibold",
    High: "text-amber-400 font-semibold",
    Medium: "text-blue-400 font-semibold",
    Low: "text-emerald-400 font-semibold",
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

      {/* Risk Event List or Blank Fallback */}
      {items.length === 0 ? (
        <div className="py-12 text-center text-white/40 text-xs font-mono">
          Tidak ada event risiko anomali aktif dari MotherDuck
        </div>
      ) : (
        <div className="divide-y divide-white/10">
          {items.map((risk) => {
            const Icon = categoryIconMap[risk.category] || ShieldAlert;
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
                  <span className={`text-xs ${levelColorMap[risk.level] || "text-white/60"}`}>
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
      )}
    </div>
  );
}
