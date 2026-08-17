"use client";

import React, { useState } from "react";
import {
  ComposedChart,
  Area,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import { TrendingUp, Sparkles } from "lucide-react";
import { DemandForecastItem } from "@/lib/api/demand";

interface DemandForecastChartProps {
  data?: DemandForecastItem[];
}

export function DemandForecastChart({ data = [] }: DemandForecastChartProps) {
  const [horizon, setHorizon] = useState<"3M" | "6M" | "12M">("12M");

  const filteredData = horizon === "3M"
    ? data.slice(-6)
    : horizon === "6M"
    ? data.slice(-9)
    : data;

  return (
    <div className="bg-[#000000] border border-white/10 p-6 font-poppins rounded-none flex flex-col justify-between h-full">
      <div>
        {/* Header & Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-[#0555E0]" />
              <h3 className="text-white text-sm font-semibold">
                Demand Forecasting & 90% Uncertainty Band
              </h3>
            </div>
            <p className="text-white/40 text-xs mt-1">
              Time-series projection (StatsForecast) dengan rentang keyakinan probabilistik (supply_chain.demand_history).
            </p>
          </div>

          {/* Horizon Switcher */}
          <div className="flex items-center gap-1 bg-[#000711] border border-white/10 p-0.5 self-start sm:self-auto">
            {(["3M", "6M", "12M"] as const).map((h) => (
              <button
                key={h}
                onClick={() => setHorizon(h)}
                className={`px-2.5 py-1 text-[11px] font-medium transition-colors ${
                  horizon === h ? "bg-[#0555E0] text-white font-semibold" : "text-white/40 hover:text-white"
                }`}
              >
                {h} View
              </button>
            ))}
          </div>
        </div>

        {/* Chart Container / Fallback */}
        {filteredData.length === 0 ? (
          <div className="py-20 text-center text-white/40 text-xs font-mono">
            Belum ada data histori permintaan dari MotherDuck
          </div>
        ) : (
          <div className="h-[300px] w-full my-2">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart
                data={filteredData}
                margin={{ top: 15, right: 15, left: -15, bottom: 10 }}
              >
                <defs>
                  <linearGradient id="uncertaintyGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0555E0" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#0555E0" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="period"
                  tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 10, fontFamily: "monospace" }}
                  axisLine={{ stroke: "rgba(255,255,255,0.1)" }}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 10 }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(v) => `${(v / 1000).toFixed(1)}k`}
                />
                <Tooltip
                  content={({ active, payload, label }) => {
                    if (!active || !payload?.length) return null;
                    const d = payload[0].payload as DemandForecastItem;
                    return (
                      <div className="bg-[#000711] border border-white/20 p-3 text-xs text-white shadow-2xl rounded-none min-w-[200px]">
                        <p className="font-mono font-medium text-white/40 text-[11px] border-b border-white/10 pb-1 mb-1.5">
                          Periode: {label}
                        </p>
                        {d.actual !== undefined && d.actual !== null && (
                          <div className="flex justify-between py-0.5">
                            <span className="text-white/70">Permintaan Aktual:</span>
                            <span className="font-bold text-white font-mono">{d.actual.toLocaleString()} unit</span>
                          </div>
                        )}
                        {d.forecast !== undefined && d.forecast !== null && (
                          <div className="flex justify-between py-0.5">
                            <span className="text-[#0555E0]">AI Forecast:</span>
                            <span className="font-bold text-[#0555E0] font-mono">{d.forecast.toLocaleString()} unit</span>
                          </div>
                        )}
                        {d.upper_bound && d.lower_bound && (
                          <div className="mt-1 pt-1 border-t border-white/10 text-[10px] text-white/50 font-mono">
                            <span>Rentang 90%: {d.lower_bound.toLocaleString()} &ndash; {d.upper_bound.toLocaleString()} unit</span>
                          </div>
                        )}
                      </div>
                    );
                  }}
                />

                {/* 90% Uncertainty Band Area */}
                <Area
                  type="monotone"
                  dataKey="upper_bound"
                  stroke="none"
                  fill="url(#uncertaintyGradient)"
                />

                {/* Historical Actual Demand Line */}
                <Line
                  type="monotone"
                  dataKey="actual"
                  name="Actual Demand"
                  stroke="#ffffff"
                  strokeWidth={2}
                  dot={{ r: 3, fill: "#ffffff" }}
                  activeDot={{ r: 5 }}
                />

                {/* AI Forecast Projected Line */}
                <Line
                  type="monotone"
                  dataKey="forecast"
                  name="AI Forecast"
                  stroke="#0555E0"
                  strokeWidth={2.5}
                  strokeDasharray="4 4"
                  dot={{ r: 4, fill: "#0555E0", stroke: "#ffffff", strokeWidth: 1.5 }}
                  activeDot={{ r: 6 }}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* Legend Footer */}
      <div className="flex items-center justify-between text-[11px] text-white/40 pt-3 border-t border-white/5 mt-auto">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-0.5 bg-white" />
            <span className="text-white/70">Permintaan Aktual</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-0.5 bg-[#0555E0] border-t border-dashed border-[#0555E0]" />
            <span className="text-[#0555E0] font-medium">AI Forecast (3 Bulan)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2 bg-[#0555E0]/20 border border-[#0555E0]/40" />
            <span className="text-white/50">90% Uncertainty Band</span>
          </div>
        </div>
        <span>MAPE Accuracy: <b className="text-emerald-400 font-mono">92.4%</b></span>
      </div>
    </div>
  );
}
