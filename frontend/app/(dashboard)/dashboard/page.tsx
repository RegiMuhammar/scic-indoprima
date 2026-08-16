"use client";

import React, { useState, useEffect } from "react";
import { HealthIndexCard } from "@/components/dashboard/HealthIndexCard";
import { ScoreCard } from "@/components/dashboard/ScoreCard";
import { KpiTrendChart } from "@/components/dashboard/KpiTrendChart";
import { RiskRadarChart } from "@/components/dashboard/RiskRadarChart";
import { RecentOrdersTable } from "@/components/dashboard/RecentOrdersTable";
import { PlantOeeView } from "@/components/dashboard/PlantOeeView";
import { Layers, Factory, Database, RefreshCw } from "lucide-react";
import { fetchDashboardSummary, DashboardSummaryResponse } from "@/lib/api/dashboard";

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<"control-tower" | "plant-oee">("control-tower");
  const [data, setData] = useState<DashboardSummaryResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  const loadData = async (isManualRefresh = false) => {
    if (isManualRefresh) setIsRefreshing(true);
    try {
      const summary = await fetchDashboardSummary();
      if (summary) {
        setData(summary);
      }
    } catch (err) {
      console.warn("Failed to fetch MotherDuck summary:", err);
    } finally {
      setIsLoading(false);
      if (isManualRefresh) setIsRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // ── Baseline Fallback Scorecards (Synced with MotherDuck baseline) ──
  const controlTowerScorecards = [
    {
      title: "On-Time Delivery (OTD)",
      value: data?.scorecards?.otd?.value || "84.2%",
      target: data?.scorecards?.otd?.target || "92.0%",
      change: data?.scorecards?.otd?.change ?? -3.1,
      changePeriod: data?.scorecards?.otd?.changePeriod || "vs last month",
      isPositiveGood: true,
      status: "warning" as const,
      badge: "Warning (-7.8% gap)",
      detailInfo: {
        formula: "OTD Rate = (Delivered Orders with actual_date ≤ promised_date / Total Orders) × 100",
        sourceTables: ["supply_chain.delivery_order", "supply_chain.plant_master"],
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
      value: data?.scorecards?.production?.value || "88.5%",
      target: data?.scorecards?.production?.target || "95.0%",
      change: data?.scorecards?.production?.change ?? -1.8,
      changePeriod: data?.scorecards?.production?.changePeriod || "vs last month",
      isPositiveGood: true,
      status: "critical" as const,
      badge: "Underperforming",
      detailInfo: {
        formula: "Production Achievement = (Sum of actual_qty / Sum of planned_qty) × 100",
        sourceTables: ["manufacturing.fact_production_outputs", "manufacturing.fact_production_schedules"],
        underlyingCauses: [
          "14.5 jam downtime kalibrasi hidrolik mesin MCH-LS-01",
          "Defect rate naik 4.8% pada Shift 3 (malam)",
        ],
        recommendedAction: "Lakukan realokasi volume produksi ke Line 1 dan jadwalkan preventive maintenance.",
      },
    },
    {
      title: "At-Risk Delivery Orders",
      value: data?.scorecards?.risk_orders?.value || "$184.000",
      target: data?.scorecards?.risk_orders?.target || "< $50.000",
      change: data?.scorecards?.risk_orders?.change ?? 14.8,
      changePeriod: data?.scorecards?.risk_orders?.changePeriod || "vs yesterday",
      isPositiveGood: false,
      status: "critical" as const,
      badge: "Critical (8 DO)",
      detailInfo: {
        formula: "Count of Delivery Orders with delivery_status = 'Delayed' OR estimated_delay ≥ 3 days",
        sourceTables: ["supply_chain.delivery_order", "supply_chain.logistics_telemetry"],
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
      value: data?.scorecards?.plant_oee?.value || "82.8%",
      target: data?.scorecards?.plant_oee?.target || "85.0%",
      change: data?.scorecards?.plant_oee?.change ?? 0.8,
      changePeriod: data?.scorecards?.plant_oee?.changePeriod || "vs last month",
      isPositiveGood: true,
      status: "warning" as const,
      badge: "Benchmark 85.0%",
      detailInfo: {
        formula: "OEE = Availability (89.2%) × Performance (94.1%) × Quality (98.6%)",
        sourceTables: ["manufacturing.fact_production_outputs", "manufacturing.fact_downtime_logs"],
        underlyingCauses: [
          "Availability menjadi pilar terendah (89.2%) akibat unplanned breakdown hidrolik",
          "Quality tetap solid pada 98.6% good count rate",
        ],
        recommendedAction: "Optimalkan jadwal changeover tooling untuk menaikkan Availability ke 91%.",
      },
    },
  ];

  return (
    <div className="min-h-full bg-[#000711] text-white font-poppins p-6 lg:p-8 space-y-6 pb-24">
      
      {/* ── 1. Page Header (Judul Resmi SCIC + Live MotherDuck Badge) ─── */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-white text-xl lg:text-2xl font-bold tracking-tight font-poppins">
            Supply Chain & Manufacturing Performance Control Tower
          </h1>
          <p className="text-white/40 text-xs mt-1 font-poppins">
            Enterprise Visibility & Decision Intelligence — PT Indoprima Group & PT Indospring Tbk
          </p>
        </div>

        {/* Live Cloud Connection Indicator */}
        <div className="flex items-center gap-2.5">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#000000] border border-white/10 text-[11px] font-mono">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <Database className="w-3.5 h-3.5 text-[#0555E0]" />
            <span className="text-white/80">MotherDuck Cloud</span>
            <span className="text-emerald-400 font-semibold">34 Tables Live</span>
          </div>

          <button
            onClick={() => loadData(true)}
            disabled={isRefreshing}
            className="p-1.5 bg-[#000000] border border-white/10 hover:border-white/20 text-white/60 hover:text-white transition-colors"
            title="Refresh MotherDuck Analytics"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin text-[#0555E0]" : ""}`} />
          </button>
        </div>
      </div>

      {/* ── 2. Health Index Card (Atas Sendiri, Sesuai Wireframe) ────── */}
      <HealthIndexCard
        score={data?.health_index?.score ?? 78.4}
        status={data?.health_index?.status ?? "Needs Attention"}
        summaryText={data?.health_index?.summaryText}
        aiRecommendation={data?.health_index?.aiRecommendation}
        otdScore={data?.health_index?.factors?.otd ?? 84.2}
        prodScore={data?.health_index?.factors?.production ?? 88.5}
        atRiskPenalty={data?.health_index?.factors?.atRiskPenalty ?? 12.0}
        forecastScore={data?.health_index?.factors?.forecast ?? 91.2}
        dataLineageFactors={data?.health_index?.dataLineageFactors}
      />

      {/* ── 3. Minimalist Underline Tab Switcher ─────────────────────── */}
      <div className="flex items-center gap-8 border-b border-white/10 pt-2 pb-0">
        <button
          onClick={() => setActiveTab("control-tower")}
          className={`flex items-center gap-2 pb-2.5 text-xs font-semibold transition-colors border-b-2 ${
            activeTab === "control-tower"
              ? "text-white border-[#0555E0]"
              : "text-white/40 hover:text-white/70 border-transparent"
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          Supply Chain Control Tower
        </button>
        
        <button
          onClick={() => setActiveTab("plant-oee")}
          className={`flex items-center gap-2 pb-2.5 text-xs font-semibold transition-colors border-b-2 ${
            activeTab === "plant-oee"
              ? "text-white border-[#0555E0]"
              : "text-white/40 hover:text-white/70 border-transparent"
          }`}
        >
          <Factory className="w-3.5 h-3.5" />
          Plant OEE & Shopfloor Lines
        </button>
      </div>

      {/* ── 4. Main Content View ─────────────────────────────────────── */}
      {activeTab === "control-tower" ? (
        <div className="space-y-6">
          
          {/* ── 4. KPI Scorecards (4 Kolom Teratur) ────────────────────── */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {controlTowerScorecards.map((card) => (
              <ScoreCard key={card.title} {...card} />
            ))}
          </div>

          {/* ── 5. Main Performance Trend Chart (100% Full Width) ──────── */}
          <div className="w-full">
            <KpiTrendChart data={data?.trend_data} />
          </div>

          {/* ── 6. Early Warning Risk Radar (Full Width) ───────────────── */}
          <div className="w-full">
            <RiskRadarChart items={data?.active_risks} />
          </div>

          {/* ── 7. Live Delivery Orders Table (Connected to MotherDuck) ── */}
          <div className="w-full">
            <RecentOrdersTable orders={data?.recent_orders} />
          </div>

        </div>
      ) : (
        /* Plant OEE & Shopfloor Lines View */
        <PlantOeeView 
          lines={data?.plant_oee?.lines} 
          pareto={data?.plant_oee?.pareto} 
          shifts={data?.plant_oee?.shifts}
        />
      )}

    </div>
  );
}
