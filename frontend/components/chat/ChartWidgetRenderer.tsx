"use client"

import React from "react"
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts"
import { VisualizationPayload } from "@/types/chat.types"

const PALETTE = ["#0555E0", "#38BDF8", "#34D399", "#FBBF24", "#F87171", "#A78BFA"]

interface ChartWidgetRendererProps {
  payload?: VisualizationPayload
}

export const ChartWidgetRenderer: React.FC<ChartWidgetRendererProps> = ({ payload }) => {
  if (!payload || payload.chart_type === "none" || !payload.data || payload.data.length === 0) {
    return null
  }

  const { chart_type, title, x_axis, y_axis, data } = payload
  const resolvedX = x_axis || Object.keys(data[0])[0]
  const resolvedY = y_axis || Object.keys(data[0])[1]

  return (
    <div className="my-3 rounded border border-white/10 bg-[#00050d] p-3.5 shadow-lg font-poppins">
      {title && (
        <div className="text-xs font-semibold text-white/90 mb-3 pb-1 border-b border-white/10 flex items-center justify-between">
          <span>{title}</span>
          <span className="text-[10px] text-white/40 uppercase tracking-wider">
            Visualisasi AI Otomatis
          </span>
        </div>
      )}

      <div className="h-56 w-full min-w-0">
        <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
          {chart_type === "line_chart" ? (
            <LineChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
              <XAxis
                dataKey={resolvedX}
                stroke="rgba(255,255,255,0.4)"
                tick={{ fontSize: 10, fill: "rgba(255,255,255,0.6)" }}
              />
              <YAxis
                stroke="rgba(255,255,255,0.4)"
                tick={{ fontSize: 10, fill: "rgba(255,255,255,0.6)" }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#000814",
                  borderColor: "rgba(255,255,255,0.15)",
                  borderRadius: "4px",
                  fontSize: "11px",
                  color: "#fff",
                }}
              />
              <Line
                type="monotone"
                dataKey={resolvedY}
                stroke="#38BDF8"
                strokeWidth={2}
                dot={{ fill: "#0555E0", r: 3 }}
                activeDot={{ r: 5 }}
              />
            </LineChart>
          ) : chart_type === "donut_chart" ? (
            <PieChart>
              <Pie
                data={data}
                dataKey={resolvedY}
                nameKey={resolvedX}
                cx="50%"
                cy="50%"
                innerRadius={45}
                outerRadius={75}
                paddingAngle={4}
              >
                {data.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={PALETTE[index % PALETTE.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "#000814",
                  borderColor: "rgba(255,255,255,0.15)",
                  borderRadius: "4px",
                  fontSize: "11px",
                  color: "#fff",
                }}
              />
            </PieChart>
          ) : (
            <BarChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
              <XAxis
                dataKey={resolvedX}
                stroke="rgba(255,255,255,0.4)"
                tick={{ fontSize: 10, fill: "rgba(255,255,255,0.6)" }}
              />
              <YAxis
                stroke="rgba(255,255,255,0.4)"
                tick={{ fontSize: 10, fill: "rgba(255,255,255,0.6)" }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#000814",
                  borderColor: "rgba(255,255,255,0.15)",
                  borderRadius: "4px",
                  fontSize: "11px",
                  color: "#fff",
                }}
              />
              <Bar dataKey={resolvedY} fill="#0555E0" radius={[3, 3, 0, 0]}>
                {data.map((_, index) => (
                  <Cell key={`bar-${index}`} fill={PALETTE[index % PALETTE.length]} />
                ))}
              </Bar>
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  )
}
