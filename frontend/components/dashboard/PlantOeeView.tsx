"use client";

import React, { useState } from "react";
import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  LabelList,
} from "recharts";
import { Factory, Cpu } from "lucide-react";
import { ScoreCard } from "@/components/dashboard/ScoreCard";

export interface LineOeeItem {
  line_id: string;
  line_name: string;
  plant: string;
  target_oee: number;
  availability: number;
  performance: number;
  quality: number;
  overall_oee: number;
  status: string;
  statusColor: string;
  barColor: string;
}

export interface ParetoLossItem {
  category: string;
  fullCategory?: string;
  minutes: number;
  pct: number;
  cumulativePct: number;
}

export interface ShiftManpowerItem {
  shift: string;
  output: number;
  defect_pct: number;
  utilization: number;
}

interface PlantOeeViewProps {
  lines?: LineOeeItem[];
  pareto?: ParetoLossItem[];
  shifts?: ShiftManpowerItem[];
}

export function PlantOeeView({ lines, pareto, shifts }: PlantOeeViewProps) {
  const [selectedLine, setSelectedLine] = useState<string>("LINE-LS-01");

  const lineOeeData = lines || [];
  const paretoLosses = pareto || [];
  const activeShifts = shifts || [];

  const oeeScorecards = [
    {
      title: "Availability Rate",
      value: lineOeeData.length > 0 ? `${(lineOeeData.reduce((acc, curr) => acc + curr.availability, 0) / lineOeeData.length).toFixed(1)}%` : "0%",
      target: "90.0%",
      change: -1.2,
      changePeriod: "vs last month",
      isPositiveGood: true,
      status: "warning" as const,
      badge: "Target 90.0%",
      detailInfo: {
        formula: "Availability = (Planned Production Time - Total Downtime) / Planned Time × 100",
        sourceTables: ["fact_production_schedules", "fact_downtime_logs"],
        underlyingCauses: [
          "Downtime 14.5 jam akibat kalibrasi hidrolik Line 3",
          "Keterlambatan penggantian die tool 2 jam pada shift 2",
        ],
        recommendedAction: "Jadwalkan preventive maintenance die tooling secara berkala sebelum shift pagi.",
      },
    },
    {
      title: "Performance Rate",
      value: lineOeeData.length > 0 ? `${(lineOeeData.reduce((acc, curr) => acc + curr.performance, 0) / lineOeeData.length).toFixed(1)}%` : "0%",
      target: "95.0%",
      change: 0.5,
      changePeriod: "vs last month",
      isPositiveGood: true,
      status: "good" as const,
      badge: "Target 95.0%",
      detailInfo: {
        formula: "Performance = (Ideal Cycle Time × Total Output Quantity) / Operating Time × 100",
        sourceTables: ["fact_production_outputs", "dim_skus"],
        underlyingCauses: [
          "Actual cycle time rata-rata 5.1s vs ideal standard 4.8s",
          "Micro-stops pada feeder stamping press Line 1",
        ],
        recommendedAction: "Kalibrasi sensor optical feeder untuk meminimalisir delay micro-stop.",
      },
    },
    {
      title: "Quality Rate (Good Count %)",
      value: lineOeeData.length > 0 ? `${(lineOeeData.reduce((acc, curr) => acc + curr.quality, 0) / lineOeeData.length).toFixed(1)}%` : "0%",
      target: "99.0%",
      change: -0.4,
      changePeriod: "vs last month",
      isPositiveGood: true,
      status: "good" as const,
      badge: "Target 99.0%",
      detailInfo: {
        formula: "Quality = Good Units Produced / Total Units Inspected × 100",
        sourceTables: ["fact_quality_inspections"],
        underlyingCauses: [
          "Lonjakan defect pada Shift 3 malam akibat operator fatigue",
          "Total reject tercatat pada lini perakitan",
        ],
        recommendedAction: "Terapkan rotasi shift berkala dan double-check kalibrasi suhu furnace shift malam.",
      },
    },
    {
      title: "Composite Plant OEE",
      value: lineOeeData.length > 0 ? `${(lineOeeData.reduce((acc, curr) => acc + curr.overall_oee, 0) / lineOeeData.length).toFixed(1)}%` : "0%",
      target: "85.0%",
      change: 0.8,
      changePeriod: "vs last month",
      isPositiveGood: true,
      status: "warning" as const,
      badge: "World Class: ≥ 85%",
      detailInfo: {
        formula: "OEE = Availability × Performance × Quality",
        sourceTables: ["view_line_oee_summary", "dim_production_lines"],
        underlyingCauses: [
          "Line 1 dan Line 4 menarik turun rata-rata keseluruhan pabrik",
          "Line 3 Coil Spring mencatatkan performa terbaik",
        ],
        recommendedAction: "Fokuskan perbaikan OEE pada reduksi downtime hidrolik Line 1 dan Line 4.",
      },
    },
  ];

  return (
    <div className="space-y-6 font-poppins">
      
      {/* ── Top OEE Scorecards (4 Columns Grid with gap-4) ──────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {oeeScorecards.map((card) => (
          <ScoreCard key={card.title} {...card} />
        ))}
      </div>

      {/* ── Middle Row: Enhanced Visual Line Breakdown & Standard 80:20 Pareto ───────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        
        {/* Left: Visual Bullet Bar OEE Breakdown (~50% / 6 Cols) */}
        <div className="lg:col-span-6 p-6 bg-[#000000] border border-white/10 rounded-none flex flex-col justify-between min-h-[420px]">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Factory className="w-4 h-4 text-white/60" />
                <h3 className="text-white text-sm font-semibold">
                  Production Lines OEE Breakdown
                </h3>
              </div>
              <span className="text-white/40 text-xs font-mono">Target: 85.0%</span>
            </div>

            {/* Visual Micro-Bullet Bar Cards or Blank Fallback */}
            {lineOeeData.length === 0 ? (
              <div className="py-16 text-center text-white/40 text-xs font-mono">
                Belum ada data lini produksi dari MotherDuck
              </div>
            ) : (
              <div className="space-y-3">
                {lineOeeData.map((line) => (
                  <div
                    key={line.line_id}
                    className="p-3.5 bg-white/[0.02] border border-white/10 hover:border-white/20 transition-colors"
                  >
                    {/* Header: Line Title + Status + Big OEE Value */}
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-white font-semibold text-xs">{line.line_name}</span>
                          <span className="text-white/40 text-[10px] font-mono">({line.plant})</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2.5">
                        <span className={`text-[11px] font-medium ${line.statusColor}`}>
                          {line.status}
                        </span>
                        <span className="text-white text-sm font-bold font-mono">
                          {line.overall_oee}%
                        </span>
                      </div>
                    </div>

                    {/* Progress Bar with Target 85% Marker */}
                    <div className="relative w-full h-2 bg-white/10 my-2 overflow-hidden">
                      <div
                        className={`h-full ${line.barColor} transition-all duration-500`}
                        style={{ width: `${line.overall_oee}%` }}
                      />
                      {/* Target 85% Dashed Marker */}
                      <div
                        className="absolute top-0 bottom-0 w-0.5 bg-white z-10"
                        style={{ left: "85%" }}
                        title="Target OEE 85%"
                      />
                    </div>

                    {/* 3-Factor Micro Breakdown (A × P × Q) */}
                    <div className="flex items-center justify-between pt-1.5 text-[10px] font-mono text-white/50">
                      <span>
                        A (Avail): <b className={`font-semibold ${line.availability < 90 ? "text-amber-400" : "text-white/80"}`}>{line.availability}%</b>
                      </span>
                      <span>
                        P (Perf): <b className="font-semibold text-white/80">{line.performance}%</b>
                      </span>
                      <span>
                        Q (Qual): <b className="font-semibold text-white/80">{line.quality}%</b>
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-[11px] text-white/40">
            <span>Benchmark Standar OEE: <b className="text-white">World Class &ge;85.0%</b></span>
            <span>Cakupan: {lineOeeData.length} Lini Aktif</span>
          </div>
        </div>

        {/* Right: Standard Looker/BI 80:20 Pareto Chart (~50% / 6 Cols) */}
        <div className="lg:col-span-6 p-6 bg-[#000000] border border-white/10 rounded-none flex flex-col justify-between min-h-[420px]">
          <div>
            <div className="flex items-center justify-between mb-1">
              <h3 className="text-white text-sm font-semibold">
                Big Losses & Downtime
              </h3>
              <span className="text-red-400 text-xs font-semibold font-mono">
                Total: {paretoLosses.reduce((acc, curr) => acc + curr.minutes, 0).toLocaleString()} Min
              </span>
            </div>
            <p className="text-white/40 text-xs mb-2">
              Bar (Menit Downtime) & Garis Kumulatif % dengan garis batas 80% Pareto.
            </p>
          </div>

          {/* Pareto Chart Container or Blank Fallback */}
          {paretoLosses.length === 0 ? (
            <div className="py-16 text-center text-white/40 text-xs font-mono">
              Belum ada data downtime pareto dari MotherDuck
            </div>
          ) : (
            <div className="w-full h-[330px] my-1">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart
                  data={paretoLosses}
                  barCategoryGap="14%"
                  margin={{ top: 25, right: 5, left: -22, bottom: 15 }}
                >
                  <XAxis
                    dataKey="category"
                    interval={0}
                    tick={{ fill: "rgba(255,255,255,0.7)", fontSize: 10, fontFamily: "Poppins, sans-serif" }}
                    axisLine={{ stroke: "rgba(255,255,255,0.1)" }}
                    tickLine={false}
                  />
                  <YAxis
                    yAxisId="left"
                    orientation="left"
                    tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 10 }}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(v) => `${v}m`}
                  />
                  <YAxis
                    yAxisId="right"
                    orientation="right"
                    domain={[0, 100]}
                    tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 10 }}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(v) => `${v}%`}
                  />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (!active || !payload?.length) return null;
                      const d = payload[0].payload;
                      return (
                        <div className="bg-[#000711] border border-white/20 p-2.5 text-xs text-white shadow-2xl">
                          <p className="font-semibold text-white text-xs border-b border-white/10 pb-1 mb-1">
                            {d.fullCategory || d.category}
                          </p>
                          <div className="space-y-0.5 text-[11px]">
                            <p className="text-white/70">Downtime: <b className="text-white">{d.minutes} menit</b> ({d.pct}%)</p>
                            <p className="text-[#0555E0] font-mono font-semibold">Kumulatif Pareto: {d.cumulativePct}%</p>
                          </div>
                        </div>
                      );
                    }}
                  />
                  {/* 80% Pareto Cutoff Reference Line */}
                  <ReferenceLine
                    y={80}
                    yAxisId="right"
                    stroke="#ef4444"
                    strokeDasharray="3 3"
                    label={{
                      value: "80% Pareto Cutoff",
                      fill: "#ef4444",
                      fontSize: 10,
                      position: "insideTopLeft",
                    }}
                  />
                  {/* Tall Bars with Uniform Primary Color #0555E0 & Individual % Labels */}
                  <Bar yAxisId="left" dataKey="minutes" fill="#0555E0" radius={[0, 0, 0, 0]}>
                    <LabelList
                      dataKey="pct"
                      position="top"
                      formatter={(v) => `${v}%`}
                      fill="#ffffff"
                      fontSize={11}
                      fontWeight="600"
                      fontFamily="monospace"
                    />
                  </Bar>
                  {/* Cumulative % Line (Rising Left-to-Right) */}
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="cumulativePct"
                    stroke="#ffffff"
                    strokeWidth={2}
                    dot={{ r: 4, fill: "#0555E0", stroke: "#ffffff", strokeWidth: 1.5 }}
                    activeDot={{ r: 6 }}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          )}

          <div className="flex items-center justify-between text-[11px] text-white/40 pt-3 border-t border-white/5">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 bg-[#0555E0]" />
                <span className="text-white/60">Downtime (Menit)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-white" />
                <span className="text-white/60">Kumulatif %</span>
              </div>
            </div>
            <span>80% Masalah: <b className="text-red-400">Breakdown & Setup</b></span>
          </div>
        </div>

      </div>

      {/* ── Bottom Row: Shift Analysis & Machine IoT Waveform ──────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        
        {/* Shift Manpower Analysis */}
        <div className="p-6 bg-[#000000] border border-white/10 rounded-none lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-white text-sm font-semibold">
                Shift Manpower & Fatigue Analysis (Shift 1, 2, 3)
              </h3>
              <p className="text-white/40 text-xs mt-0.5">
                Korelasi performa kerja shift malam terhadap lonjakan defect QC.
              </p>
            </div>
            <span className="text-xs text-amber-400 font-medium">
              Shift 3 Fatigue Alert
            </span>
          </div>

          {activeShifts.length === 0 ? (
            <div className="py-8 text-center text-white/40 text-xs font-mono">
              Belum ada data shift manpower dari MotherDuck
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {activeShifts.map((s) => (
                <div key={s.shift} className="p-4 bg-[#000711] border border-white/10">
                  <span className="text-white/70 text-xs font-semibold block mb-2">{s.shift}</span>
                  <div className="space-y-1.5 text-xs">
                    <div className="flex justify-between text-white/50">
                      <span>Output:</span>
                      <span className="text-white font-medium">{s.output} unit</span>
                    </div>
                    <div className="flex justify-between text-white/50">
                      <span>Defect Rate:</span>
                      <span className={`font-semibold ${s.defect_pct > 3 ? "text-red-400" : "text-emerald-400"}`}>
                        {s.defect_pct}%
                      </span>
                    </div>
                    <div className="flex justify-between text-white/50">
                      <span>Labor Utilization:</span>
                      <span className="text-white font-medium">{s.utilization}%</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Machine IoT Waveform Mini-Viewer */}
        <div className="p-6 bg-[#000000] border border-white/10 rounded-none flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Cpu className="w-4 h-4 text-emerald-400" />
                <h3 className="text-white text-sm font-semibold">Live Machine Telemetry</h3>
              </div>
              <span className="flex items-center gap-1.5 text-[10px] text-emerald-400 font-mono">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                ONLINE
              </span>
            </div>
            <p className="text-white/40 text-xs mb-4">
              Real-time vibration sensor (SCADA IoT Stream).
            </p>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between p-2 bg-[#000711] border border-white/5">
                <span className="text-white/60">Vibration (mm/s):</span>
                <span className="font-mono text-emerald-400 font-semibold">1.42 mm/s (Normal)</span>
              </div>
              <div className="flex justify-between p-2 bg-[#000711] border border-white/5">
                <span className="text-white/60">Temperature (°C):</span>
                <span className="font-mono text-white font-semibold">68.4 °C</span>
              </div>
              <div className="flex justify-between p-2 bg-[#000711] border border-white/5">
                <span className="text-white/60">Pressure (bar):</span>
                <span className="font-mono text-white font-semibold">142.8 bar</span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-white/5 text-[10px] text-white/40 font-mono">
            Sensor ID: <b className="text-white">SCADA-VIB-092 (Line 1)</b>
          </div>
        </div>

      </div>

    </div>
  );
}
