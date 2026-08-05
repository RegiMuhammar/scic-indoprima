"use client";

/**
 * Channel Sales / Risk Chart (Step Line Chart)
 * Styled after reference "Channel sales" stepped line chart:
 * Thin crisp white line paths, dark background, sharp container.
 */

import {
  LineChart,
  Line,
  XAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const data = [
  { date: "Apr 7", series1: 40, series2: 20 },
  { date: "Apr 8", series1: 40, series2: 32 },
  { date: "Apr 9", series1: 52, series2: 32 },
  { date: "Apr 10", series1: 52, series2: 48 },
  { date: "Apr 11", series1: 70, series2: 48 },
  { date: "Apr 12", series1: 70, series2: 55 },
  { date: "Apr 13", series1: 85, series2: 55 },
];

interface TooltipPayloadItem {
  value: number | string;
  dataKey?: string;
  name?: string;
}

interface TooltipProps {
  active?: boolean;
  payload?: TooltipPayloadItem[];
  label?: string;
}

function CustomTooltip({ active, payload, label }: TooltipProps) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-[#121212] border border-white/10 px-3 py-2 text-xs font-poppins text-white">
      <p className="text-white/40 text-[10px]">{label}</p>
      {payload.map((p) => (
        <p key={p.dataKey ?? p.name} className="font-semibold text-white mt-0.5">
          {p.name}: {p.value}
        </p>
      ))}
    </div>
  );
}

export function RiskRadarChart() {
  return (
    <div className="flex flex-col h-full bg-[#000000] border-b border-r border-white/10 p-6 rounded-none font-poppins">
      {/* Header matching reference layout */}
      <div className="flex items-center gap-2 mb-1">
        <h3 className="text-white text-sm font-semibold font-poppins">
          Channel sales
        </h3>
        <span className="px-2 py-0.5 text-[10px] font-poppins font-medium text-emerald-400 bg-emerald-400/10 rounded-full">
          ˆ 58.3%
        </span>
      </div>
      <p className="text-white/40 text-xs font-poppins mb-6">
        Daily sales count by channel, last 7 days.
      </p>

      {/* Stepped Line Chart */}
      <div className="flex-1 min-h-[180px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
            <XAxis
              dataKey="date"
              tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 11, fontFamily: "Poppins, sans-serif" }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip content={<CustomTooltip />} />
            <Line
              type="stepAfter"
              dataKey="series1"
              name="Direct Sales"
              stroke="#ffffff"
              strokeWidth={1.5}
              dot={false}
            />
            <Line
              type="stepAfter"
              dataKey="series2"
              name="Distributor Sales"
              stroke="rgba(255,255,255,0.4)"
              strokeWidth={1.5}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
