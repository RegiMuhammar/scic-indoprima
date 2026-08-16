"use client";

import React, { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { Factory, Cpu } from "lucide-react";
import { ScoreCard } from "@/components/dashboard/ScoreCard";

const lineOeeData = [
  {
    line_id: "LINE-LS-01",
    line_name: "Leaf Spring Line 01 (Gresik)",
    target_oee: 85.0,
    availability: 89.2,
    performance: 94.1,
    quality: 98.6,
    overall_oee: 82.8,
    status: "Warning",
    statusColor: "text-amber-400",
  },
  {
    line_id: "LINE-LS-02",
    line_name: "Leaf Spring Line 02 (Gresik)",
    target_oee: 85.0,
    availability: 91.5,
    performance: 95.0,
    quality: 97.2,
    overall_oee: 84.5,
    status: "On Track",
    statusColor: "text-emerald-400",
  },
  {
    line_id: "LINE-CS-01",
    line_name: "Coil Spring Line 01 (Nganjuk)",
    target_oee: 85.0,
    availability: 94.0,
    performance: 96.2,
    quality: 96.5,
    overall_oee: 87.2,
    status: "Healthy",
    statusColor: "text-emerald-400",
  },
  {
    line_id: "LINE-SB-01",
    line_name: "Stabilizer Bar Line 01 (Gresik)",
    target_oee: 85.0,
    availability: 86.4,
    performance: 93.8,
    quality: 99.1,
    overall_oee: 80.3,
    status: "Warning",
    statusColor: "text-amber-400",
  },
];

const paretoLosses = [
  { category: "Unplanned Breakdown", minutes: 840, pct: 42.5, fill: "#ef4444" },
  { category: "Changeover & Setup", minutes: 480, pct: 24.3, fill: "#f59e0b" },
  { category: "Planned Maintenance", minutes: 320, pct: 16.2, fill: "#3b82f6" },
  { category: "Tooling / Die Adjust", minutes: 210, pct: 10.6, fill: "#8b5cf6" },
  { category: "Speed Loss / Idle", minutes: 125, pct: 6.4, fill: "#64748b" },
];

const shiftData = [
  { shift: "Shift 1 (Pagi)", output: 2450, defect_pct: 1.2, utilization: 94.5 },
  { shift: "Shift 2 (Sore)", output: 2310, defect_pct: 1.8, utilization: 91.2 },
  { shift: "Shift 3 (Malam)", output: 1980, defect_pct: 4.8, utilization: 82.0 },
];

export function PlantOeeView() {
  const [selectedLine, setSelectedLine] = useState<string>("LINE-LS-01");

  const oeeScorecards = [
    {
      title: "Availability Rate",
      value: "89.2%",
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
      value: "94.1%",
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
      value: "98.6%",
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
          "Lonjakan defect 4.8% pada Shift 3 (malam) akibat operator fatigue",
          "Total reject 180 unit dari 12.800 unit yang diinspeksi",
        ],
        recommendedAction: "Terapkan rotasi shift berkala dan double-check kalibrasi suhu furnace shift malam.",
      },
    },
    {
      title: "Composite Plant OEE",
      value: "82.8%",
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
          "Line 1 (82.8%) dan Line 4 (80.3%) menarik turun rata-rata keseluruhan pabrik",
          "Line 3 Coil Spring mencatatkan performa terbaik di 87.2%",
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

      {/* ── Middle Row: Line Breakdown & 6 Big Losses Pareto ───────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        
        {/* Left: Lines OEE Matrix */}
        <div className="p-6 bg-[#000000] border border-white/10 rounded-none flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Factory className="w-4 h-4 text-white/60" />
                <h3 className="text-white text-sm font-semibold">
                  Production Lines OEE Breakdown
                </h3>
              </div>
              <span className="text-white/40 text-xs">Gresik & Nganjuk Plants</span>
            </div>

            <div className="divide-y divide-white/10 border-t border-b border-white/10">
              {lineOeeData.map((line) => (
                <div
                  key={line.line_id}
                  onClick={() => setSelectedLine(line.line_id)}
                  className={`p-3 flex items-center justify-between cursor-pointer transition-colors ${
                    selectedLine === line.line_id ? "bg-white/5" : "hover:bg-white/[0.02]"
                  }`}
                >
                  <div>
                    <span className="text-white font-medium text-xs block">{line.line_name}</span>
                    <span className="text-white/40 text-[11px]">
                      Avail: {line.availability}% • Perf: {line.performance}% • Qual: {line.quality}%
                    </span>
                  </div>

                  <div className="text-right">
                    <span className="text-white text-sm font-bold block">{line.overall_oee}%</span>
                    <span className={`text-[11px] font-medium ${line.statusColor}`}>
                      {line.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-[11px] text-white/40">
            <span>Selected Line: <b className="text-white">{selectedLine}</b></span>
            <span>Target OEE: 85.0%</span>
          </div>
        </div>

        {/* Right: 6 Big Losses Pareto Chart */}
        <div className="p-6 bg-[#000000] border border-white/10 rounded-none flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-white text-sm font-semibold">
                6 Big Losses & Downtime Pareto
              </h3>
              <span className="text-red-400 text-xs font-semibold">Total: 1.975 Min</span>
            </div>
            <p className="text-white/40 text-xs mb-4">
              Distribusi akar penyebab waktu henti mesin (30 hari terakhir).
            </p>

            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={paretoLosses} layout="vertical" margin={{ top: 0, right: 20, left: 40, bottom: 0 }}>
                  <XAxis type="number" tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 10 }} axisLine={false} tickLine={false} />
                  <YAxis type="category" dataKey="category" tick={{ fill: "rgba(255,255,255,0.7)", fontSize: 11 }} axisLine={false} tickLine={false} />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (!active || !payload?.length) return null;
                      const d = payload[0].payload;
                      return (
                        <div className="bg-[#000711] border border-white/20 p-2 text-xs text-white">
                          <p className="font-semibold">{d.category}</p>
                          <p className="text-white/70">{d.minutes} menit ({d.pct}%)</p>
                        </div>
                      );
                    }}
                  />
                  <Bar dataKey="minutes" radius={[0, 0, 0, 0]}>
                    {paretoLosses.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="flex items-center justify-between text-[11px] text-white/40 pt-3 border-t border-white/5">
            <span>Primary Loss Driver: <b className="text-red-400">Unplanned Hydraulic Breakdown (42.5%)</b></span>
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

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {shiftData.map((s) => (
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
        </div>

        {/* Machine IoT Waveform Mini-Viewer */}
        <div className="p-6 bg-[#000000] border border-white/10 rounded-none flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Cpu className="w-4 h-4 text-emerald-400" />
              <h3 className="text-white text-sm font-semibold">
                IoT Sensor Telemetry Live
              </h3>
            </div>
            <p className="text-white/40 text-xs mb-4">
              Real-time feed MCH-LS-01 Stamping Press.
            </p>

            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between p-2 bg-[#000711] border border-white/5">
                <span className="text-white/70">Vibration:</span>
                <span className="text-amber-400 font-mono font-semibold">4.82 mm/s (Warning)</span>
              </div>
              <div className="flex items-center justify-between p-2 bg-[#000711] border border-white/5">
                <span className="text-white/70">Temperature:</span>
                <span className="text-emerald-400 font-mono font-semibold">68.4 °C (Normal)</span>
              </div>
              <div className="flex items-center justify-between p-2 bg-[#000711] border border-white/5">
                <span className="text-white/70">Motor Current:</span>
                <span className="text-white font-mono font-semibold">142.5 Ampere</span>
              </div>
              <div className="flex items-center justify-between p-2 bg-[#000711] border border-white/5">
                <span className="text-white/70">Machine State:</span>
                <span className="text-emerald-400 font-semibold uppercase text-[10px]">Running</span>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-white/10 text-[10px] text-white/30 flex justify-between">
            <span>Sampling: Edge SCADA 10s</span>
            <span>Sensor Status: Synced</span>
          </div>
        </div>

      </div>

    </div>
  );
}
