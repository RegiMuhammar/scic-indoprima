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

export interface TrendDataPoint {
  period: string;
  otd_rate: number;
  production_achievement: number;
  anomaly_event?: string;
}

interface TooltipProps {
  active?: boolean;
  payload?: Array<{
    value: number;
    dataKey: string;
    name: string;
    color: string;
  }>;
  label?: string;
  trendItems?: TrendDataPoint[];
}

function CustomTooltip({ active, payload, label, trendItems }: TooltipProps) {
  if (!active || !payload?.length) return null;

  const currentItem = trendItems?.find((d) => d.period === label);

  return (
    <div className="bg-[#000711] border border-white/20 p-3 text-xs font-poppins text-white shadow-2xl rounded-none min-w-[200px]">
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
        <div className="mt-2 pt-2 border-t border-white/10 text-[10px] text-white/70 bg-white/[0.02] p-1.5">
          <span className="font-semibold text-white block">Anomaly Logged:</span>
          {currentItem.anomaly_event}
        </div>
      )}
    </div>
  );
}

interface KpiTrendChartProps {
  data?: TrendDataPoint[];
  title?: string;
  subtitle?: string;
}

export function KpiTrendChart({
  data = [],
  title = "Operational Performance Trend vs Targets",
  subtitle = "Tracking harian On-Time Delivery % & Produksi vs Target (92% & 95%).",
}: KpiTrendChartProps) {
  const [metricFilter, setMetricFilter] = useState<"all" | "otd" | "production">("all");

  const anomalyCount = data.filter((d) => Boolean(d.anomaly_event)).length;

  return (
    <div className="flex flex-col h-full bg-[#000000] border border-white/10 p-6 rounded-none font-poppins">
      {/* Header with Title and Filter Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-white text-sm font-semibold font-poppins">
              {title}
            </h3>
            {anomalyCount > 0 && (
              <span className="text-xs text-white/40 font-mono">
                ({anomalyCount} Anomalies Logged)
              </span>
            )}
          </div>
          <p className="text-white/40 text-xs mt-1">
            {subtitle}
          </p>
        </div>

        {/* Filter Buttons */}
        <div className="flex items-center gap-1 bg-[#000711] border border-white/10 p-0.5 self-start sm:self-auto">
          <button
            onClick={() => setMetricFilter("all")}
            className={`px-2.5 py-1 text-[11px] font-medium transition-colors ${
              metricFilter === "all" ? "bg-[#0555E0] text-white font-semibold" : "text-white/60 hover:text-white"
            }`}
          >
            All Metrics
          </button>
          <button
            onClick={() => setMetricFilter("otd")}
            className={`px-2.5 py-1 text-[11px] font-medium transition-colors ${
              metricFilter === "otd" ? "bg-[#0555E0] text-white font-semibold" : "text-white/60 hover:text-white"
            }`}
          >
            OTD Rate
          </button>
          <button
            onClick={() => setMetricFilter("production")}
            className={`px-2.5 py-1 text-[11px] font-medium transition-colors ${
              metricFilter === "production" ? "bg-[#0555E0] text-white font-semibold" : "text-white/60 hover:text-white"
            }`}
          >
            Production Ach.
          </button>
        </div>
      </div>

      {/* Chart Container / Blank Fallback */}
      {data.length === 0 ? (
        <div className="py-16 text-center text-white/40 text-xs font-mono">
          Belum ada data trend operasional dari MotherDuck
        </div>
      ) : (
        <div className="h-[280px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={data}
              margin={{ top: 15, right: 30, left: -10, bottom: 5 }}
            >
              <XAxis
                dataKey="period"
                tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 11 }}
                axisLine={{ stroke: "rgba(255,255,255,0.1)" }}
                tickLine={false}
              />
              <YAxis
                domain={[70, 100]}
                tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => `${v}%`}
              />
              <Tooltip content={<CustomTooltip trendItems={data} />} />

              {/* Target Reference Lines */}
              {(metricFilter === "all" || metricFilter === "production") && (
                <ReferenceLine
                  y={95}
                  stroke="#10b981"
                  strokeDasharray="4 4"
                  strokeOpacity={0.6}
                  label={{
                    value: "Prod Target: 95%",
                    fill: "#10b981",
                    fontSize: 10,
                    position: "insideTopRight",
                  }}
                />
              )}
              {(metricFilter === "all" || metricFilter === "otd") && (
                <ReferenceLine
                  y={92}
                  stroke="#0555E0"
                  strokeDasharray="4 4"
                  strokeOpacity={0.6}
                  label={{
                    value: "OTD Target: 92%",
                    fill: "#0555E0",
                    fontSize: 10,
                    position: "insideBottomRight",
                  }}
                />
              )}

              {/* Metric Lines */}
              {(metricFilter === "all" || metricFilter === "otd") && (
                <Line
                  type="monotone"
                  dataKey="otd_rate"
                  name="On-Time Delivery (OTD)"
                  stroke="#0555E0"
                  strokeWidth={2}
                  dot={{ r: 4, fill: "#0555E0", stroke: "#000000", strokeWidth: 2 }}
                  activeDot={{ r: 6 }}
                />
              )}
              {(metricFilter === "all" || metricFilter === "production") && (
                <Line
                  type="monotone"
                  dataKey="production_achievement"
                  name="Production Achievement"
                  stroke="#10b981"
                  strokeWidth={2}
                  dot={{ r: 4, fill: "#10b981", stroke: "#000000", strokeWidth: 2 }}
                  activeDot={{ r: 6 }}
                />
              )}
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Legend Footer */}
      <div className="flex items-center justify-between text-[11px] text-white/40 pt-4 border-t border-white/5 mt-auto">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-0.5 bg-[#0555E0]" />
            <span className="text-white/60">OTD Rate</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-0.5 bg-[#10b981]" />
            <span className="text-white/60">Production Achievement</span>
          </div>
        </div>
        <span>Target: OTD ≥ 92% | Prod ≥ 95%</span>
      </div>
    </div>
  );
}
