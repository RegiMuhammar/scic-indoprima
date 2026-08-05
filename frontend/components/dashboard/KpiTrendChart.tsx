"use client";

/**
 * KPI Trend Chart (Bar Chart)
 * Styled after reference "Net revenue" bar chart:
 * Monochrome gray/white vertical bars, clean sharp container, dark theme.
 */

import {
  BarChart,
  Bar,
  XAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const data = [
  { day: "Mon", value: 340 },
  { day: "Tue", value: 410 },
  { day: "Wed", value: 580 },
  { day: "Thu", value: 650 },
  { day: "Fri", value: 720 },
  { day: "Sat", value: 640 },
  { day: "Sun", value: 890 },
];

interface TooltipProps {
  active?: boolean;
  payload?: Array<{
    value: number | string;
    dataKey?: string;
    name?: string;
    fill?: string;
  }>;
  label?: string;
}

function CustomTooltip({ active, payload, label }: TooltipProps) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-[#121212] border border-white/10 px-3 py-2 text-xs font-poppins text-white">
      <p className="text-white/40 text-[10px]">{label}</p>
      <p className="font-semibold text-white mt-0.5">{payload[0].value} units</p>
    </div>
  );
}

export function KpiTrendChart() {
  return (
    <div className="flex flex-col h-full bg-[#000000] border-b border-r border-white/10 p-6 rounded-none font-poppins">
      {/* Header matching reference layout */}
      <div className="flex items-center gap-2 mb-1">
        <h3 className="text-white text-sm font-semibold font-poppins">
          Net revenue
        </h3>
        <span className="px-2 py-0.5 text-[10px] font-poppins font-medium text-emerald-400 bg-emerald-400/10 rounded-full">
          ˆ 66.9%
        </span>
      </div>
      <p className="text-white/40 text-xs font-poppins mb-6">
        Daily net sales, last 7 days.
      </p>

      {/* Bar Chart */}
      <div className="flex-1 min-h-[180px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#ffffff" stopOpacity={0.9} />
                <stop offset="100%" stopColor="#333333" stopOpacity={0.2} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="day"
              tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 11, fontFamily: "Poppins, sans-serif" }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(255,255,255,0.03)" }} />
            <Bar
              dataKey="value"
              fill="url(#barGradient)"
              radius={[0, 0, 0, 0]}
              maxBarSize={48}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
