"use client";

import React, { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";

interface DataPoint {
  period: string;
  otd_rate: number;
  production_achievement: number;
  anomaly_event?: string;
}

const trendData: DataPoint[] = [
  { period: "10 Aug", otd_rate: 93.5, production_achievement: 96.0 },
  { period: "11 Aug", otd_rate: 91.8, production_achievement: 95.2 },
  { period: "12 Aug", otd_rate: 89.4, production_achievement: 92.0 },
  { period: "13 Aug", otd_rate: 82.0, production_achievement: 78.5, anomaly_event: "Line 3 Stamping Hydraulic Calibration (14h)" },
  { period: "14 Aug", otd_rate: 84.1, production_achievement: 85.0 },
  { period: "15 Aug", otd_rate: 83.8, production_achievement: 88.5, anomaly_event: "Tanjung Perak Port Customs Backlog (+42h)" },
  { period: "16 Aug", otd_rate: 84.2, production_achievement: 88.5 },
];

interface TooltipProps {
  active?: boolean;
  payload?: Array<{
    value: number;
    dataKey: string;
    name: string;
    color: string;
  }>;
  label?: string;
}

function CustomTooltip({ active, payload, label }: TooltipProps) {
  if (!active || !payload?.length) return null;

  const currentItem = trendData.find((d) => d.period === label);

  return (
    <div className="bg-[#121212] border border-white/10 p-3 text-xs font-poppins text-white shadow-2xl rounded-none min-w-[200px]">
      <p className="text-white/40 text-[11px] font-medium mb-1.5 border-b border-white/10 pb-1">
        Periode: {label} 2026
      </p>
      {payload.map((item) => (
        <div key={item.dataKey} className="flex items-center justify-between py-0.5">
          <span className="text-white/70 text-[11px]">{item.name}</span>
          <span className="font-semibold text-white text-xs">{item.value}%</span>
        </div>
      ))}
      {currentItem?.anomaly_event && (
        <div className="mt-2 pt-2 border-t border-red-500/20 text-[10px] text-red-400 bg-red-500/10 p-1.5">
          <span className="font-semibold block">⚠️ Anomaly Detected:</span>
          {currentItem.anomaly_event}
        </div>
      )}
    </div>
  );
}

export function KpiTrendChart() {
  const [metricFilter, setMetricFilter] = useState<"all" | "otd" | "production">("all");

  return (
    <div className="flex flex-col h-full bg-[#000000] border-b border-r border-white/10 p-6 rounded-none font-poppins">
      {/* Header with Title and Filter Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-white text-sm font-semibold font-poppins">
              Operational Performance Trend vs Targets
            </h3>
            <span className="px-2 py-0.5 text-[10px] font-medium text-amber-400 bg-amber-400/10 border border-amber-400/20">
              2 Anomalies Logged
            </span>
          </div>
          <p className="text-white/40 text-xs mt-1">
            Tracking harian On-Time Delivery % & Produksi vs Target (92% & 95%).
          </p>
        </div>

        {/* Filter Buttons */}
        <div className="flex items-center gap-1 bg-[#0a0a0a] border border-white/10 p-0.5 self-start sm:self-auto">
          <button
            onClick={() => setMetricFilter("all")}
            className={`px-2.5 py-1 text-[11px] font-medium transition-colors ${
              metricFilter === "all" ? "bg-white text-black font-semibold" : "text-white/60 hover:text-white"
            }`}
          >
            All Metrics
          </button>
          <button
            onClick={() => setMetricFilter("otd")}
            className={`px-2.5 py-1 text-[11px] font-medium transition-colors ${
              metricFilter === "otd" ? "bg-white text-black font-semibold" : "text-white/60 hover:text-white"
            }`}
          >
            OTD Rate
          </button>
          <button
            onClick={() => setMetricFilter("production")}
            className={`px-2.5 py-1 text-[11px] font-medium transition-colors ${
              metricFilter === "production" ? "bg-white text-black font-semibold" : "text-white/60 hover:text-white"
            }`}
          >
            Production
          </button>
        </div>
      </div>

      {/* Recharts Line Chart */}
      <div className="flex-1 min-h-[220px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <XAxis
              dataKey="period"
              tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 11, fontFamily: "Poppins, sans-serif" }}
              axisLine={{ stroke: "rgba(255,255,255,0.1)" }}
              tickLine={false}
            />
            <YAxis
              domain={[60, 100]}
              tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 11, fontFamily: "Poppins, sans-serif" }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v) => `${v}%`}
            />
            <Tooltip content={<CustomTooltip />} />
            <ReferenceLine y={92} stroke="rgba(255,255,255,0.2)" strokeDasharray="3 3" label={{ value: "Target OTD 92%", fill: "rgba(255,255,255,0.3)", fontSize: 10, position: "insideTopRight" }} />

            {(metricFilter === "all" || metricFilter === "otd") && (
              <Line
                type="monotone"
                dataKey="otd_rate"
                name="On-Time Delivery"
                stroke="#38bdf8"
                strokeWidth={2}
                dot={{ r: 3, fill: "#38bdf8" }}
                activeDot={{ r: 5 }}
              />
            )}

            {(metricFilter === "all" || metricFilter === "production") && (
              <Line
                type="monotone"
                dataKey="production_achievement"
                name="Production Achievement"
                stroke="#ffffff"
                strokeWidth={2}
                dot={{ r: 3, fill: "#ffffff" }}
                activeDot={{ r: 5 }}
              />
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Legend & Summary */}
      <div className="flex items-center justify-between text-[11px] text-white/40 pt-4 border-t border-white/5 mt-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#38bdf8]" />
            <span className="text-white/70">OTD Rate (Current: 84.2%)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-white" />
            <span className="text-white/70">Production (Current: 88.5%)</span>
          </div>
        </div>
        <span className="text-amber-400/80">Gap to OTD Target: -7.8%</span>
      </div>
    </div>
  );
}
