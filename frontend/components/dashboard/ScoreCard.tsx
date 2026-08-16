"use client";

import React, { useState } from "react";
import { TrendingUp, TrendingDown, X, Database } from "lucide-react";

export interface ScoreCardDetailInfo {
  formula?: string;
  sourceTables?: string[];
  underlyingCauses?: string[];
  recommendedAction?: string;
  drilldownNote?: string;
}

export interface ScoreCardProps {
  title: string;
  value: string;
  target?: string;
  change: number;
  changePeriod?: string;
  isPositiveGood?: boolean;
  status?: "healthy" | "warning" | "critical" | "good";
  badge?: string;
  detailInfo?: ScoreCardDetailInfo;
  className?: string;
}

export function ScoreCard({
  title,
  value,
  target,
  change,
  changePeriod = "vs last month",
  isPositiveGood = true,
  status = "good",
  badge,
  detailInfo,
  className = "",
}: ScoreCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const isUp = change >= 0;
  const isGood = isPositiveGood ? isUp : !isUp;

  const trendColor = isGood ? "text-emerald-400" : "text-red-400";
  const TrendIcon = isUp ? TrendingUp : TrendingDown;

  const statusTextColorMap = {
    healthy: "text-emerald-400",
    good: "text-emerald-400",
    warning: "text-amber-400",
    critical: "text-red-400",
  };

  return (
    <>
      <div
        className={`flex flex-col justify-between p-5 lg:p-6 bg-[#000000] border border-white/10 rounded-none hover:border-white/20 transition-all font-poppins ${className}`}
      >
        {/* 1. Header: Title + Status Text UNDER title */}
        <div>
          <p className="text-white/70 text-xs font-poppins font-medium tracking-tight">
            {title}
          </p>

          {badge && (
            <div className="mt-1">
              <span className={`text-[11px] font-medium ${statusTextColorMap[status]}`}>
                {badge}
              </span>
            </div>
          )}
        </div>

        {/* 2. Big Metric Value & Target UNDER value */}
        <div className="my-4">
          <div className="text-white text-3xl font-bold font-poppins tracking-tight leading-none">
            {value}
          </div>
          {target && (
            <div className="text-white/40 text-xs font-poppins mt-1.5">
              Target: <span className="text-white/70 font-medium">{target}</span>
            </div>
          )}
        </div>

        {/* 3. Footer: Trend + Detail Text Button */}
        <div className="flex items-center justify-between text-xs font-poppins pt-3 border-t border-white/5">
          <div className="flex items-center gap-1.5">
            <TrendIcon className={`w-3.5 h-3.5 ${trendColor}`} />
            <span className={`${trendColor} font-semibold`}>
              {isUp ? "+" : ""}{change}%
            </span>
            <span className="text-white/40 text-[11px]">{changePeriod}</span>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="text-white/50 hover:text-white text-[11px] font-medium transition-colors flex items-center gap-1 underline underline-offset-4 decoration-white/20 hover:decoration-white"
          >
            <span>Detail</span>
          </button>
        </div>
      </div>

      {/* ── Glass Outline Pitch-Black Popup Modal ────────────────────── */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#000711] border border-white/20 p-6 max-w-lg w-full rounded-none shadow-2xl font-poppins text-white space-y-4 animate-in fade-in zoom-in-95 duration-150">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div>
                <span className="text-[10px] text-white/40 uppercase tracking-wider font-semibold">
                  Metric Explanation & Lineage
                </span>
                <h3 className="text-white text-sm font-semibold mt-0.5">
                  {title}
                </h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-white/40 hover:text-white p-1 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Current Value & Target summary */}
            <div className="flex items-center justify-between p-3 bg-white/[0.02] border border-white/10">
              <div>
                <span className="text-white/40 text-[10px] block">Current Achievement</span>
                <span className="text-xl font-bold text-white">{value}</span>
              </div>
              {target && (
                <div className="text-right">
                  <span className="text-white/40 text-[10px] block">Standard Target</span>
                  <span className="text-sm font-semibold text-white/80">{target}</span>
                </div>
              )}
            </div>

            {/* Formula / Definition */}
            {detailInfo?.formula && (
              <div className="space-y-1 text-xs">
                <span className="text-white/50 text-[11px] font-medium">Business Formula:</span>
                <p className="font-mono text-[11px] text-white/80 bg-black p-2 border border-white/5">
                  {detailInfo.formula}
                </p>
              </div>
            )}

            {/* Underlying Causes */}
            {detailInfo?.underlyingCauses && detailInfo.underlyingCauses.length > 0 && (
              <div className="space-y-1 text-xs">
                <span className="text-white/50 text-[11px] font-medium">Underlying Drivers / Causes:</span>
                <ul className="space-y-1 text-[11px] text-white/70 list-disc list-inside">
                  {detailInfo.underlyingCauses.map((cause, idx) => (
                    <li key={idx}>{cause}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Recommended Action */}
            {detailInfo?.recommendedAction && (
              <div className="p-2.5 bg-blue-500/10 border border-blue-500/20 text-[11px] space-y-0.5">
                <span className="text-blue-400 font-semibold block">AI Recommended Action:</span>
                <p className="text-white/80">{detailInfo.recommendedAction}</p>
              </div>
            )}

            {/* Data Source Tables */}
            {detailInfo?.sourceTables && (
              <div className="pt-2 border-t border-white/10 flex items-center gap-1.5 text-[10px] text-white/40 font-mono">
                <Database className="w-3 h-3 text-white/30" />
                <span>Source: {detailInfo.sourceTables.join(", ")} (MotherDuck OLAP)</span>
              </div>
            )}

            {/* Modal Footer Button */}
            <div className="flex justify-end pt-2">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-1.5 text-xs bg-white text-black font-semibold hover:bg-white/90 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
