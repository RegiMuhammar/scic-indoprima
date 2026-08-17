"use client";

import React, { useState, useMemo } from "react";
import {
  ComposedChart,
  Area,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { TrendingUp, ChevronDown } from "lucide-react";
import { SparePartForecastItem, ForecastDataPoint } from "@/lib/api/demand";

interface DemandForecastChartProps {
  forecasts?: SparePartForecastItem[];
}

export function DemandForecastChart({ forecasts = [] }: DemandForecastChartProps) {
  const [selectedPartId, setSelectedPartId] = useState<string>("ALL");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const activeForecast = useMemo(() => {
    return forecasts.find((f) => f.part_id === selectedPartId) || forecasts[0] || null;
  }, [forecasts, selectedPartId]);

  const chartData = activeForecast?.series || [];

  return (
    <div className="bg-[#000000] border border-white/10 p-6 font-poppins rounded-none flex flex-col justify-between h-full">
      <div>
        {/* Header & Spare Part Selector */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-4">
          <div>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-white/60" />
              <h3 className="text-white text-sm font-semibold">
                Peramalan Permintaan Produk (Demand Forecasting)
              </h3>
            </div>
            <p className="text-white/40 text-xs mt-1">
              Data permintaan historis aktual 12 bulan dari database dan simulasi proyeksi kebutuhan 4 bulan ke depan.
            </p>
          </div>

          {/* Spare Part Dropdown Selector */}
          {forecasts.length > 0 && (
            <div className="relative self-start sm:self-auto">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-2 px-3 py-2 bg-[#000711] border border-white/10 hover:border-white/20 text-xs text-white transition-colors min-w-[280px] justify-between"
              >
                <span className="truncate text-left">
                  {activeForecast?.part_name || "Pilih Produk"}
                </span>
                <ChevronDown className={`w-3.5 h-3.5 text-white/40 shrink-0 transition-transform ${isDropdownOpen ? "rotate-180" : ""}`} />
              </button>

              {isDropdownOpen && (
                <div className="absolute right-0 top-full mt-1 w-[340px] bg-[#000711] border border-white/10 shadow-2xl z-50 max-h-[300px] overflow-y-auto">
                  {forecasts.map((f) => (
                    <button
                      key={f.part_id}
                      onClick={() => {
                        setSelectedPartId(f.part_id);
                        setIsDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2.5 text-xs hover:bg-white/5 transition-colors border-b border-white/5 last:border-b-0 ${
                        selectedPartId === f.part_id ? "bg-[#0555E0]/10 text-white" : "text-white/70"
                      }`}
                    >
                      <div className="font-medium text-[11px]">{f.part_name}</div>
                      <div className="text-[10px] text-white/40 font-mono mt-0.5">
                        {f.category}
                        {f.mape_accuracy != null && ` • Akurasi: ${f.mape_accuracy}%`}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Chart Container / Fallback */}
        {chartData.length === 0 ? (
          <div className="py-20 text-center text-white/40 text-xs font-mono">
            Belum ada data peramalan permintaan produk
          </div>
        ) : (
          <div className="h-[300px] w-full my-2">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart
                data={chartData}
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
                  tickFormatter={(v: number) => {
                    if (v >= 1000) return `${(v / 1000).toFixed(1)}k`;
                    return `${v}`;
                  }}
                />
                <Tooltip
                  content={({ active, payload, label }) => {
                    if (!active || !payload?.length) return null;
                    const d = payload[0].payload as ForecastDataPoint;
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
                            <span className="text-[#0555E0]">Estimasi Permintaan:</span>
                            <span className="font-bold text-[#0555E0] font-mono">{d.forecast.toLocaleString()} unit</span>
                          </div>
                        )}
                        {d.upper_bound && d.lower_bound && d.is_projected && (
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
                  name="Permintaan Aktual"
                  stroke="#ffffff"
                  strokeWidth={2}
                  dot={{ r: 3, fill: "#ffffff" }}
                  activeDot={{ r: 5 }}
                  connectNulls={false}
                />

                {/* AI Forecast Projected Line */}
                <Line
                  type="monotone"
                  dataKey="forecast"
                  name="Estimasi Permintaan"
                  stroke="#0555E0"
                  strokeWidth={2.5}
                  strokeDasharray="4 4"
                  dot={{ r: 4, fill: "#0555E0", stroke: "#ffffff", strokeWidth: 1.5 }}
                  activeDot={{ r: 6 }}
                  connectNulls={false}
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
            <span className="text-white/70">Permintaan Aktual (12 Bulan)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-0.5 bg-[#0555E0] border-t border-dashed border-[#0555E0]" />
            <span className="text-white/60">Estimasi Permintaan (Proyeksi 4 Bulan)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2 bg-[#0555E0]/20 border border-[#0555E0]/40" />
            <span className="text-white/50">Rentang Keyakinan 90%</span>
          </div>
        </div>
        {activeForecast?.mape_accuracy != null && (
          <span>Akurasi: <b className="text-emerald-400 font-mono">{activeForecast.mape_accuracy}%</b></span>
        )}
      </div>
    </div>
  );
}
