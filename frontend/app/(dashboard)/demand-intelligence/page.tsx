"use client";

import React, { useState, useEffect } from "react";
import {
  Wrench,
  TrendingUp,
  RefreshCw,
  Layers,
  Sparkles,
  Sliders,
  Cpu,
  Package,
} from "lucide-react";
import { ScoreCard } from "@/components/dashboard/ScoreCard";
import { SparePartsRopTable } from "@/components/demand/SparePartsRopTable";
import { ScenarioSimulator } from "@/components/demand/ScenarioSimulator";
import { BomCompatibilityViewer } from "@/components/demand/BomCompatibilityViewer";
import { DemandForecastChart } from "@/components/demand/DemandForecastChart";
import { StockBalancingMatrix } from "@/components/demand/StockBalancingMatrix";
import { fetchDemandSummary, DemandSummaryResponse } from "@/lib/api/demand";

export default function DemandIntelligencePage() {
  const [data, setData] = useState<DemandSummaryResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<"spare-parts" | "finished-goods">("spare-parts");

  const loadData = async (showRefresh = false) => {
    if (showRefresh) setIsRefreshing(true);
    try {
      const summary = await fetchDemandSummary();
      if (summary) {
        setData(summary);
      }
    } catch (e) {
      console.error("Failed to load demand intelligence data:", e);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const defaultKpis = data?.kpis;

  const scorecards = [
    {
      title: defaultKpis?.critical_stockout?.title || "Critical Stockout Risk",
      value: String(defaultKpis?.critical_stockout?.value || "0 Suku Cadang"),
      target: defaultKpis?.critical_stockout?.target || "0 Item",
      change: defaultKpis?.critical_stockout?.change ?? -2,
      changePeriod: defaultKpis?.critical_stockout?.changePeriod || "vs last week",
      isPositiveGood: false,
      status: (defaultKpis?.critical_stockout?.status || "critical") as "critical" | "warning" | "good",
      badge: defaultKpis?.critical_stockout?.badge || "Action Required",
      detailInfo: defaultKpis?.critical_stockout?.detailInfo,
    },
    {
      title: defaultKpis?.forecast_accuracy?.title || "Forecast Accuracy (MAPE)",
      value: String(defaultKpis?.forecast_accuracy?.value || "92.4%"),
      target: defaultKpis?.forecast_accuracy?.target || "90.0%",
      change: defaultKpis?.forecast_accuracy?.change ?? 1.4,
      changePeriod: defaultKpis?.forecast_accuracy?.changePeriod || "vs last month",
      isPositiveGood: true,
      status: (defaultKpis?.forecast_accuracy?.status as "good" | "warning" | "critical") || "good",
      badge: defaultKpis?.forecast_accuracy?.badge || "Target >= 90%",
      detailInfo: defaultKpis?.forecast_accuracy?.detailInfo,
    },
    {
      title: defaultKpis?.spare_part_readiness?.title || "MRO Spare Part Readiness",
      value: String(defaultKpis?.spare_part_readiness?.value || "94.2%"),
      target: defaultKpis?.spare_part_readiness?.target || "95.0%",
      change: defaultKpis?.spare_part_readiness?.change ?? 0.8,
      changePeriod: defaultKpis?.spare_part_readiness?.changePeriod || "vs last month",
      isPositiveGood: true,
      status: (defaultKpis?.spare_part_readiness?.status as "good" | "warning" | "critical") || "good",
      badge: defaultKpis?.spare_part_readiness?.badge || "Target >= 95%",
      detailInfo: defaultKpis?.spare_part_readiness?.detailInfo,
    },
    {
      title: defaultKpis?.inventory_imbalance?.title || "Stock Imbalance Valuation",
      value: String(defaultKpis?.inventory_imbalance?.value || "Rp 23,3 M"),
      target: defaultKpis?.inventory_imbalance?.target || "Rp 0 M",
      change: defaultKpis?.inventory_imbalance?.change ?? -1.2,
      changePeriod: defaultKpis?.inventory_imbalance?.changePeriod || "vs last month",
      isPositiveGood: false,
      status: (defaultKpis?.inventory_imbalance?.status as "good" | "warning" | "critical") || "warning",
      badge: defaultKpis?.inventory_imbalance?.badge || "Balancing Potential",
      detailInfo: defaultKpis?.inventory_imbalance?.detailInfo,
    },
  ];

  return (
    <div className="min-h-full bg-[#000711] text-white font-poppins p-6 lg:p-8 space-y-6 pb-24">
      
      {/* ── 1. Page Header (Judul Resmi SCIC + Live MotherDuck Badge) ─── */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-white/10 pb-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-white text-xl lg:text-2xl font-bold tracking-tight font-poppins">
              Demand & Spare Part Decision Intelligence
            </h1>
            <span className="px-2 py-0.5 text-[10px] font-medium bg-[#0555E0]/10 text-[#0555E0] border border-[#0555E0]/30 font-mono">
              Quick Win 2
            </span>
          </div>
          <p className="text-white/40 text-xs mt-1 font-poppins">
            Peramalan kebutuhan suku cadang MRO, Dynamic Reorder Point AI (ROP), mitigasi stockout, & transfer balancing multi-gudang.
          </p>
        </div>

        {/* Live Cloud Connection Pill + Refresh */}
        <div className="flex items-center gap-2.5 self-start md:self-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#000000] border border-white/10 text-[11px] font-mono">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-white/60">MotherDuck Cloud:</span>
            <span className="text-emerald-400 font-semibold">34 Tables Live</span>
          </div>

          <button
            onClick={() => loadData(true)}
            disabled={isRefreshing}
            className="p-1.5 bg-[#000000] border border-white/10 hover:border-white/20 text-white/60 hover:text-white transition-colors"
            title="Refresh Analytics"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin text-[#0555E0]" : ""}`} />
          </button>
        </div>
      </div>

      {/* ── 2. Top 4 KPI Scorecards Grid ────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {scorecards.map((card) => (
          <ScoreCard key={card.title} {...card} />
        ))}
      </div>

      {/* ── 3. Minimalist Tab Switcher ──────────────────────────────── */}
      <div className="flex items-center gap-8 border-b border-white/10 pt-2 pb-0">
        <button
          onClick={() => setActiveTab("spare-parts")}
          className={`flex items-center gap-2 pb-2.5 text-xs font-semibold transition-colors border-b-2 ${
            activeTab === "spare-parts"
              ? "text-white border-[#0555E0]"
              : "text-white/40 hover:text-white/70 border-transparent"
          }`}
        >
          <Wrench className="w-3.5 h-3.5" />
          Spare Part Readiness & MRO (Quick Win 2)
        </button>

        <button
          onClick={() => setActiveTab("finished-goods")}
          className={`flex items-center gap-2 pb-2.5 text-xs font-semibold transition-colors border-b-2 ${
            activeTab === "finished-goods"
              ? "text-white border-[#0555E0]"
              : "text-white/40 hover:text-white/70 border-transparent"
          }`}
        >
          <TrendingUp className="w-3.5 h-3.5" />
          Finished Goods Demand & Stock Balancing
        </button>
      </div>

      {/* ── 4. Main Views ───────────────────────────────────────────── */}
      {activeTab === "spare-parts" ? (
        <div className="space-y-6">
          
          {/* Middle Row: Smart ROP Table (~65%) + Interactive Scenario Simulator (~35%) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            <div className="lg:col-span-8">
              <SparePartsRopTable items={data?.spare_parts} />
            </div>
            <div className="lg:col-span-4">
              <ScenarioSimulator initialPartsCount={data?.spare_parts?.length ?? 10} />
            </div>
          </div>

          {/* Bottom Row: BOM Machine Compatibility Viewer (Full Width) */}
          <div className="w-full">
            <BomCompatibilityViewer items={data?.bom_compatibility} />
          </div>

        </div>
      ) : (
        <div className="space-y-6">
          
          {/* Demand Forecast Chart with 90% Uncertainty Band (Full Width) */}
          <div className="w-full">
            <DemandForecastChart data={data?.demand_forecast} />
          </div>

          {/* Multi-Warehouse Stock Balancing Matrix (Full Width) */}
          <div className="w-full">
            <StockBalancingMatrix items={data?.stock_balancing} />
          </div>

        </div>
      )}

    </div>
  );
}
