"use client";

import React, { useState } from "react";
import { Sliders, Sparkles, AlertTriangle, CheckCircle2, RotateCcw } from "lucide-react";
import { simulateScenario, ScenarioResult } from "@/lib/api/demand";

interface ScenarioSimulatorProps {
  initialPartsCount?: number;
}

export function ScenarioSimulator({ initialPartsCount = 10 }: ScenarioSimulatorProps) {
  const [demandSurge, setDemandSurge] = useState<number>(0);
  const [leadTimeDelay, setLeadTimeDelay] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [result, setResult] = useState<ScenarioResult | null>(null);

  const handleSimulate = async (surge: number, delay: number) => {
    setLoading(true);
    const res = await simulateScenario(surge, delay);
    if (res) {
      setResult(res);
    }
    setLoading(false);
  };

  const handleReset = () => {
    setDemandSurge(0);
    setLeadTimeDelay(0);
    setResult(null);
  };

  const isSimulated = demandSurge !== 0 || leadTimeDelay !== 0 || result !== null;

  return (
    <div className="bg-[#000000] border border-white/10 p-6 font-poppins rounded-none flex flex-col justify-between h-full">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-[#0555E0]" />
            <h3 className="text-white text-sm font-semibold">
              Interactive What-If Scenario Simulator
            </h3>
          </div>
          {isSimulated && (
            <button
              onClick={handleReset}
              className="flex items-center gap-1 text-xs text-white/40 hover:text-white transition-colors"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          )}
        </div>
        <p className="text-white/40 text-xs mb-6">
          Simulasikan lonjakan permintaan atau keterlambatan supplier untuk mengkalkulasi ulang safety stock buffer secara presisi.
        </p>

        {/* Sliders Grid */}
        <div className="space-y-5">
          {/* Slider 1: Demand Surge */}
          <div className="p-4 bg-[#000711] border border-white/10">
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs text-white/80 font-medium">
                Demand Surge / Volatilitas Permintaan
              </label>
              <span className={`text-xs font-mono font-bold ${demandSurge > 0 ? "text-[#0555E0]" : demandSurge < 0 ? "text-amber-400" : "text-white"}`}>
                {demandSurge > 0 ? `+${demandSurge}%` : `${demandSurge}%`}
              </span>
            </div>
            <input
              type="range"
              min={-20}
              max={40}
              step={5}
              value={demandSurge}
              onChange={(e) => {
                const val = Number(e.target.value);
                setDemandSurge(val);
                handleSimulate(val, leadTimeDelay);
              }}
              className="w-full h-1.5 bg-white/10 appearance-none cursor-pointer accent-[#0555E0]"
            />
            <div className="flex justify-between text-[10px] text-white/30 font-mono mt-1.5">
              <span>-20% (Kontraksi)</span>
              <span>0% (Normal Baseline)</span>
              <span>+40% (Surge Maksimal)</span>
            </div>
          </div>

          {/* Slider 2: Supplier Lead Time Delay */}
          <div className="p-4 bg-[#000711] border border-white/10">
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs text-white/80 font-medium">
                Supplier Lead Time Delay (Logistics Bottleneck)
              </label>
              <span className={`text-xs font-mono font-bold ${leadTimeDelay > 0 ? "text-red-400" : "text-white"}`}>
                {leadTimeDelay > 0 ? `+${leadTimeDelay} Hari` : "0 Hari (On-Time)"}
              </span>
            </div>
            <input
              type="range"
              min={0}
              max={14}
              step={1}
              value={leadTimeDelay}
              onChange={(e) => {
                const val = Number(e.target.value);
                setLeadTimeDelay(val);
                handleSimulate(demandSurge, val);
              }}
              className="w-full h-1.5 bg-white/10 appearance-none cursor-pointer accent-[#0555E0]"
            />
            <div className="flex justify-between text-[10px] text-white/30 font-mono mt-1.5">
              <span>0 Hari</span>
              <span>+7 Hari (1 Minggu)</span>
              <span>+14 Hari (2 Minggu)</span>
            </div>
          </div>
        </div>

        {/* Simulation Output Cards */}
        <div className="mt-6 grid grid-cols-2 gap-3">
          <div className="p-3.5 bg-white/[0.02] border border-white/10">
            <span className="text-[11px] text-white/50 block mb-1">Part Terpicu Reorder ROP:</span>
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold font-mono text-white">
                {result ? result.impacted_parts_count : 3}
              </span>
              <span className="text-xs text-white/40">/ {initialPartsCount} Part</span>
            </div>
          </div>

          <div className="p-3.5 bg-white/[0.02] border border-white/10">
            <span className="text-[11px] text-white/50 block mb-1">Estimasi Tambahan Biaya Buffer:</span>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold font-mono text-[#0555E0]">
                {result ? result.additional_buffer_cost_idr : "Rp 0"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Prescriptive Callout */}
      <div className="mt-6 p-3 bg-white/[0.02] border border-white/5 text-[11px] text-white/50 flex items-start gap-2">
        <Sparkles className="w-3.5 h-3.5 text-[#0555E0] shrink-0 mt-0.5" />
        <span>
          {demandSurge > 20 || leadTimeDelay > 7
            ? "Peringatan: Volatilitas tinggi meningkatkan risiko stockout sebesar 42%. Disarankan menerbitkan PO buffer ekstra untuk kategori High Criticality."
            : "Kondisi operasional normal: Parameter ROP saat ini memadai untuk menjaga target ketersediaan MRO >= 95%."}
        </span>
      </div>
    </div>
  );
}
