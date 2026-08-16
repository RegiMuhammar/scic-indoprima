"use client";

import React, { useState } from "react";
import { HealthIndexCard } from "@/components/dashboard/HealthIndexCard";
import { ScoreCard } from "@/components/dashboard/ScoreCard";
import { KpiTrendChart } from "@/components/dashboard/KpiTrendChart";
import { RiskRadarChart } from "@/components/dashboard/RiskRadarChart";
import { AiInsightsPanel } from "@/components/dashboard/AiInsightsPanel";
import { PlantOeeView } from "@/components/dashboard/PlantOeeView";
import { Layers, Factory } from "lucide-react";

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<"control-tower" | "plant-oee">("control-tower");

  const controlTowerScorecards = [
    {
      title: "On-Time Delivery (OTD)",
      value: "84.2%",
      target: "92.0%",
      change: -3.1,
      changePeriod: "vs last month",
      isPositiveGood: true,
      status: "warning" as const,
      badge: "Warning (-7.8% gap)",
      detailInfo: {
        formula: "OTD Rate = (Delivered Orders with actual_date ≤ promised_date / Total Orders) × 100",
        sourceTables: ["delivery_order", "plant_master"],
        underlyingCauses: [
          "19 dari 120 delivery orders mengalami keterlambatan pengiriman",
          "Antrian kepabeanan Tanjung Perak naik 42 jam untuk kontainer ekspor Thailand",
          "Shortfall produksi di Line 3 Stamping Press menunda order OEM Toyota",
        ],
        recommendedAction: "Split batch pengiriman darurat via rute darat & ajukan jalur hijau kepabeanan.",
      },
    },
    {
      title: "Production Achievement",
      value: "88.5%",
      target: "95.0%",
      change: -1.8,
      changePeriod: "vs last month",
      isPositiveGood: true,
      status: "critical" as const,
      badge: "Underperforming",
      detailInfo: {
        formula: "Production Achievement = (Sum of actual_qty / Sum of planned_qty) × 100",
        sourceTables: ["production_order", "dim_machines"],
        underlyingCauses: [
          "14.5 jam downtime kalibrasi hidrolik mesin MCH-LS-01",
          "Defect rate naik 4.8% pada Shift 3 (malam)",
        ],
        recommendedAction: "Lakukan realokasi volume produksi ke Line 1 dan jadwalkan preventive maintenance.",
      },
    },
    {
      title: "At-Risk Delivery Orders",
      value: "8 Orders",
      target: "0 Orders",
      change: 2,
      changePeriod: "vs yesterday",
      isPositiveGood: false,
      status: "critical" as const,
      badge: "Critical ($184.000)",
      detailInfo: {
        formula: "Count of Delivery Orders with delivery_status = 'Delayed' OR estimated_delay ≥ 3 days",
        sourceTables: ["delivery_order", "logistics_telemetry"],
        underlyingCauses: [
          "DO-202501 (PRD-004, 1.000 pcs) tertahan di Pelabuhan Tanjung Perak",
          "DO-202506 (PRD-009, 500 pcs) terdampak delay komponen baja PT Steelindo",
          "Total exposure nilai order terancam denda: $184.000",
        ],
        recommendedAction: "Komunikasikan revisi ETA ke pembeli dan prioritaskan customs clearance.",
      },
    },
    {
      title: "Global Plant OEE",
      value: "82.8%",
      target: "85.0%",
      change: 0.8,
      changePeriod: "vs last month",
      isPositiveGood: true,
      status: "warning" as const,
      badge: "On Track (+0.8%)",
      detailInfo: {
        formula: "OEE = Availability (89.2%) × Performance (94.1%) × Quality (98.6%)",
        sourceTables: ["view_line_oee_summary", "fact_downtime_logs"],
        underlyingCauses: [
          "Availability menjadi pilar terendah (89.2%) akibat unplanned breakdown hidrolik",
          "Quality tetap solid pada 98.6% good count rate",
        ],
        recommendedAction: "Optimalkan jadwal changeover tooling untuk menaikkan Availability ke 91%.",
      },
    },
  ];

  return (
    <div className="min-h-full bg-[#000000] text-white font-poppins pb-16">
      
      {/* ── 1. Page Header (Judul Paling Atas tanpa Badge Realtime) ──── */}
      <div className="p-6 bg-[#000000] border-b border-white/10 font-poppins">
        <h1 className="text-white text-xl lg:text-2xl font-bold tracking-tight font-poppins">
          Supply Chain & Manufacturing Control Tower
        </h1>
        <p className="text-white/40 text-xs mt-1 font-poppins">
          Enterprise Visibility & Decision Intelligence — PT Indoprima Group & PT Indospring Tbk
        </p>
      </div>

      {/* ── 2. Health Index Card (Standalone Card with Gauge Chart) ───── */}
      <div className="border-t border-l border-white/10">
        <HealthIndexCard
          score={78.4}
          status="Needs Attention"
          summaryText="Operasional pabrik & pengiriman terindikasi risiko moderat. Terdeteksi 8 delivery orders ($184.000) berpotensi terlambat akibat 14 jam downtime kalibrasi hidrolik Line 3 di Pabrik Karawang."
          otdScore={84.2}
          prodScore={88.5}
          atRiskPenalty={12.0}
          forecastScore={91.2}
        />
      </div>

      {/* ── 3. Tab Switcher Full-Width Flex/Grid (50% per tab) ─────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-0 border-l border-white/10">
        <button
          onClick={() => setActiveTab("control-tower")}
          className={`flex items-center justify-center gap-2.5 py-3.5 px-6 text-xs font-semibold transition-all border-b border-r border-white/10 ${
            activeTab === "control-tower"
              ? "bg-white text-black shadow-sm"
              : "bg-[#000000] text-white/50 hover:text-white hover:bg-white/[0.02]"
          }`}
        >
          <Layers className="w-4 h-4" />
          Supply Chain Control Tower
        </button>
        
        <button
          onClick={() => setActiveTab("plant-oee")}
          className={`flex items-center justify-center gap-2.5 py-3.5 px-6 text-xs font-semibold transition-all border-b border-r border-white/10 ${
            activeTab === "plant-oee"
              ? "bg-white text-black shadow-sm"
              : "bg-[#000000] text-white/50 hover:text-white hover:bg-white/[0.02]"
          }`}
        >
          <Factory className="w-4 h-4" />
          Plant OEE & Shopfloor Lines
        </button>
      </div>

      {/* ── 4. Main Content Switcher ─────────────────────────────────── */}
      {activeTab === "control-tower" ? (
        <div className="space-y-0">
          
          {/* ── Top Row: 4 KPI Scorecards Grid ─────────────────────────── */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-0 border-l border-white/10">
            {controlTowerScorecards.map((card) => (
              <ScoreCard key={card.title} {...card} />
            ))}
          </div>

          {/* ── Middle Row: Operational Trend & Risk Radar ──────────────── */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 border-l border-white/10">
            <div className="min-h-[380px]">
              <KpiTrendChart />
            </div>
            <div className="min-h-[380px]">
              <RiskRadarChart />
            </div>
          </div>

          {/* ── Bottom Row: AI Priority Insights (Full-Width, Single Unit) ─ */}
          <div className="border-l border-white/10">
            <div className="min-h-[380px]">
              <AiInsightsPanel />
            </div>
          </div>

        </div>
      ) : (
        /* ── Plant OEE & Shopfloor Lines View ───────────────────────── */
        <PlantOeeView />
      )}

    </div>
  );
}
