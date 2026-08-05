"use client";

/**
 * Dashboard Page — Supply Chain Control Tower
 *
 * Design Precision matching Reference Image:
 * - Font: Poppins everywhere
 * - Margin: ZERO margin between cards (gap-0 contiguous grid table layout)
 * - Borders: 1px subtle white borders separating cells (border-b, border-r)
 * - Background: Completely pitch dark (#000000)
 * - 4 Scorecards in top grid row
 * - 2 Charts in middle grid row
 * - Bottom row panels (Recent Invoices, Billing Health, Activity)
 */

import { ScoreCard } from "@/components/dashboard/ScoreCard";
import { KpiTrendChart } from "@/components/dashboard/KpiTrendChart";
import { RiskRadarChart } from "@/components/dashboard/RiskRadarChart";
import { AiInsightsPanel } from "@/components/dashboard/AiInsightsPanel";

const scorecards = [
  {
    title: "Active users",
    value: "847",
    change: 3.1,
    changePeriod: "vs last week",
    isPositiveGood: true,
  },
  {
    title: "Revenue",
    value: "$18,290",
    change: 12.4,
    changePeriod: "vs last week",
    isPositiveGood: true,
  },
  {
    title: "Conversion Rate",
    value: "3.28%",
    change: -0.4,
    changePeriod: "vs last week",
    isPositiveGood: false,
  },
  {
    title: "New signups",
    value: "142",
    change: 8.7,
    changePeriod: "vs last week",
    isPositiveGood: true,
  },
];

export default function DashboardPage() {
  return (
    <div className="min-h-full bg-[#000000] text-white font-poppins">

      {/* ── Top Row: 4 Scorecards Grid (gap-0 contiguous borders) ────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-0 border-t border-l border-white/10">
        {scorecards.map((card) => (
          <ScoreCard key={card.title} {...card} />
        ))}
      </div>

      {/* ── Middle Row: 2 Graphs Grid (gap-0 contiguous borders) ─────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 border-l border-white/10">
        <div className="h-[340px]">
          <KpiTrendChart />
        </div>
        <div className="h-[340px]">
          <RiskRadarChart />
        </div>
      </div>

      {/* ── Bottom Row: Activity & Health Grid (gap-0 contiguous borders) ─ */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-0 border-l border-white/10">
        <div className="lg:col-span-2">
          <AiInsightsPanel />
        </div>

        {/* Billing health / Activity right panel matching reference */}
        <div className="flex flex-col justify-between p-6 bg-[#000000] border-b border-r border-white/10 rounded-none font-poppins">
          <div>
            <h3 className="text-white text-sm font-semibold font-poppins mb-1">
              Billing health
            </h3>
            <p className="text-white/40 text-xs font-poppins mb-4">
              Operational & invoice reconciliation metrics.
            </p>

            <div className="space-y-3">
              <div className="flex items-center justify-between py-2 border-b border-white/10 text-xs font-poppins">
                <span className="text-white/70">Matching Accuracy</span>
                <span className="text-emerald-400 font-medium">98.4%</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-white/10 text-xs font-poppins">
                <span className="text-white/70">Pending Discrepancies</span>
                <span className="text-amber-400 font-medium">3 items</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-white/10 text-xs font-poppins">
                <span className="text-white/70">ERP Connector</span>
                <span className="text-emerald-400 font-medium font-mono text-[11px]">Synced</span>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-white/10 flex items-center justify-between text-[11px] font-poppins text-white/30">
            <span>Human-in-the-loop</span>
            <span>© 2026 SCIC</span>
          </div>
        </div>
      </div>

    </div>
  );
}
