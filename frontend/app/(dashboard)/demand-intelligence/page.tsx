"use client";

import React, { useState, useEffect } from "react";
import {
  Wrench,
  TrendingUp,
  RefreshCw,
} from "lucide-react";
import { ScoreCard } from "@/components/dashboard/ScoreCard";
import { SparePartsRopTable } from "@/components/demand/SparePartsRopTable";
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
      title: defaultKpis?.critical_stockout?.title || "Risiko Kehabisan Suku Cadang",
      value: String(defaultKpis?.critical_stockout?.value ?? "-"),
      target: defaultKpis?.critical_stockout?.target || "0 Item",
      change: defaultKpis?.critical_stockout?.change ?? null,
      changePeriod: defaultKpis?.critical_stockout?.changePeriod || null,
      isPositiveGood: false,
      status: (defaultKpis?.critical_stockout?.status || "warning") as "critical" | "warning" | "good",
      detailInfo: defaultKpis?.critical_stockout?.detailInfo,
    },
    {
      title: defaultKpis?.forecast_accuracy?.title || "Akurasi Peramalan (MAPE)",
      value: String(defaultKpis?.forecast_accuracy?.value ?? "-"),
      target: defaultKpis?.forecast_accuracy?.target || "90.0%",
      change: defaultKpis?.forecast_accuracy?.change ?? null,
      changePeriod: defaultKpis?.forecast_accuracy?.changePeriod || null,
      isPositiveGood: true,
      status: (defaultKpis?.forecast_accuracy?.status as "good" | "warning" | "critical") || "warning",
      detailInfo: defaultKpis?.forecast_accuracy?.detailInfo,
    },
    {
      title: defaultKpis?.spare_part_readiness?.title || "Kesiapan Suku Cadang MRO",
      value: String(defaultKpis?.spare_part_readiness?.value ?? "-"),
      target: defaultKpis?.spare_part_readiness?.target || "95.0%",
      change: defaultKpis?.spare_part_readiness?.change ?? null,
      changePeriod: defaultKpis?.spare_part_readiness?.changePeriod || null,
      isPositiveGood: true,
      status: (defaultKpis?.spare_part_readiness?.status as "good" | "warning" | "critical") || "warning",
      detailInfo: defaultKpis?.spare_part_readiness?.detailInfo,
    },
    {
      title: defaultKpis?.inventory_imbalance?.title || "Valuasi Ketidakseimbangan Stok",
      value: String(defaultKpis?.inventory_imbalance?.value ?? "-"),
      target: defaultKpis?.inventory_imbalance?.target || "Rp 0 M",
      change: defaultKpis?.inventory_imbalance?.change ?? null,
      changePeriod: defaultKpis?.inventory_imbalance?.changePeriod || null,
      isPositiveGood: false,
      status: (defaultKpis?.inventory_imbalance?.status as "good" | "warning" | "critical") || "warning",
      detailInfo: defaultKpis?.inventory_imbalance?.detailInfo,
    },
  ];

  return (
    <div className="min-h-full bg-[#000711] text-white font-poppins p-6 lg:p-8 space-y-6 pb-24">
      
      {/* ── 1. Page Header (Clean & Minimalist) ───────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-white/10 pb-4">
        <div>
          <h1 className="text-white text-xl lg:text-2xl font-bold tracking-tight font-poppins">
            Demand & Spare Part Intelligence
          </h1>
          <p className="text-white/40 text-xs mt-1 font-poppins">
            Peramalan kebutuhan suku cadang mesin, batas minimum pemesanan, dan penyeimbangan stok antar-gudang.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 self-start md:self-auto">
          <button
            onClick={() => loadData(true)}
            disabled={isRefreshing}
            className="px-3 py-1.5 bg-[#000000] border border-white/10 hover:border-white/20 text-white/70 hover:text-white transition-colors text-xs flex items-center gap-2"
            title="Muat Ulang Data"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin text-[#0555E0]" : ""}`} />
            <span>Segarkan</span>
          </button>
        </div>
      </div>

      {/* ── 2. Top 4 KPI Scorecards Grid (Clean & No Redundant Badges) ── */}
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
          Ketersediaan Suku Cadang Mesin (MRO)
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
          Peramalan Permintaan Produk & Relokasi Gudang
        </button>
      </div>

      {/* ── 4. Main Views (Full Width & Spacious) ───────────────────── */}
      {activeTab === "spare-parts" ? (
        <div className="space-y-6">
          
          {/* Full-Width Smart ROP Table */}
          <div className="w-full">
            <SparePartsRopTable items={data?.spare_parts} />
          </div>

          {/* BOM Machine Compatibility Viewer */}
          <div className="w-full">
            <BomCompatibilityViewer items={data?.bom_compatibility} />
          </div>

        </div>
      ) : (
        <div className="space-y-6">
          
          {/* Demand Forecast Chart with 90% Uncertainty Band */}
          <div className="w-full">
            <DemandForecastChart forecasts={data?.spare_part_forecasts} />
          </div>

          {/* Multi-Warehouse Stock Balancing Matrix */}
          <div className="w-full">
            <StockBalancingMatrix items={data?.stock_balancing} />
          </div>

        </div>
      )}

    </div>
  );
}
