"use client";

import React, { useState } from "react";
import { Sparkles, X } from "lucide-react";

interface HealthIndexCardProps {
  score?: number;
  status?: string;
  summaryText?: string;
  otdScore?: number;
  prodScore?: number;
  atRiskPenalty?: number;
  forecastScore?: number;
}

export function HealthIndexCard({
  score = 78.4,
  status = "Needs Attention",
  summaryText = "Operasional pabrik & pengiriman terindikasi risiko moderat. Terdeteksi 8 delivery orders ($184.000) berpotensi terlambat akibat 14 jam downtime kalibrasi hidrolik Line 3 di Pabrik Karawang.",
  otdScore = 84.2,
  prodScore = 88.5,
  atRiskPenalty = 12.0,
  forecastScore = 91.2,
}: HealthIndexCardProps) {
  const [isExplainModalOpen, setIsExplainModalOpen] = useState(false);

  // SVG Gauge calculations (180-degree semi-circle)
  const radius = 64;
  const strokeWidth = 10;
  const circumference = Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <>
      <div className="p-6 bg-[#000000] border-b border-r border-white/10 rounded-none font-poppins flex flex-col md:flex-row items-center justify-between gap-6">
        
        {/* Left: Clean SVG Semi-circular Gauge Chart */}
        <div className="flex items-center gap-6 shrink-0">
          <div className="relative flex flex-col items-center justify-center">
            <svg width="150" height="90" viewBox="0 0 150 90" className="overflow-visible">
              {/* Background Arc */}
              <path
                d="M 11 80 A 64 64 0 0 1 139 80"
                fill="none"
                stroke="rgba(255,255,255,0.1)"
                strokeWidth={strokeWidth}
                strokeLinecap="round"
              />
              {/* Colored Progress Arc (Amber) */}
              <path
                d="M 11 80 A 64 64 0 0 1 139 80"
                fill="none"
                stroke="#f59e0b"
                strokeWidth={strokeWidth}
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                className="transition-all duration-1000 ease-out"
              />
            </svg>

            {/* Score in Center */}
            <div className="absolute top-[32px] flex flex-col items-center text-center">
              <span className="text-white text-3xl font-bold font-poppins leading-none tracking-tight">
                {score}
              </span>
              <span className="text-white/40 text-[10px] uppercase font-semibold tracking-wider mt-1">
                Score / 100
              </span>
            </div>
          </div>

          {/* Status Text & Gauge Legend (Clean, no dot, no background box) */}
          <div className="flex flex-col gap-1">
            <span className="text-white/40 text-[10px] uppercase tracking-wider font-semibold">
              Composite Health Index
            </span>
            <span className="text-sm font-semibold text-amber-400">
              {status}
            </span>
            <p className="text-white/40 text-[11px] mt-0.5 max-w-[150px] leading-tight">
              Threshold: &lt;75 Critical, 75-89 Warning, &ge;90 Healthy.
            </p>
          </div>
        </div>

        {/* Center/Right: AI Summary Narrative & Sub-scores */}
        <div className="flex-1 border-t md:border-t-0 md:border-l border-white/10 pt-4 md:pt-0 md:pl-6 flex flex-col justify-between h-full space-y-3">
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                <span className="text-white text-xs font-semibold">AI Automated Executive Summary</span>
              </div>
              <button
                onClick={() => setIsExplainModalOpen(true)}
                className="text-white/40 hover:text-white text-[11px] underline underline-offset-4 decoration-white/20 transition-colors"
              >
                Lihat Komposisi Bobot
              </button>
            </div>
            <p className="text-white/70 text-xs leading-relaxed">
              {summaryText}
            </p>
          </div>

          {/* 4 Weight Factors Mini Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-white/5 text-[11px]">
            <div className="bg-white/[0.02] p-2 border border-white/5">
              <span className="text-white/40 text-[10px] block">OTD (35%)</span>
              <span className="text-white font-semibold font-mono">{otdScore}%</span>
            </div>
            <div className="bg-white/[0.02] p-2 border border-white/5">
              <span className="text-white/40 text-[10px] block">Produksi (30%)</span>
              <span className="text-white font-semibold font-mono">{prodScore}%</span>
            </div>
            <div className="bg-white/[0.02] p-2 border border-white/5">
              <span className="text-white/40 text-[10px] block">Risk Penalty (20%)</span>
              <span className="text-amber-400 font-semibold font-mono">-{atRiskPenalty} pts</span>
            </div>
            <div className="bg-white/[0.02] p-2 border border-white/5">
              <span className="text-white/40 text-[10px] block">Forecast Acc (15%)</span>
              <span className="text-white font-semibold font-mono">{forecastScore}%</span>
            </div>
          </div>
        </div>

      </div>

      {/* ── Modal Pop-up Komposisi Bobot Health Score ────────────────── */}
      {isExplainModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0a0a0a] border border-white/20 p-6 max-w-lg w-full rounded-none shadow-2xl font-poppins text-white space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div>
                <span className="text-[10px] text-white/40 uppercase tracking-wider font-semibold">
                  Health Index Calculation
                </span>
                <h3 className="text-white text-sm font-semibold mt-0.5">
                  Formula & Komposisi Bobot Health Score
                </h3>
              </div>
              <button
                onClick={() => setIsExplainModalOpen(false)}
                className="text-white/40 hover:text-white p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-black border border-white/10 font-mono text-[11px] text-white/80 space-y-1">
                <p>Health Index = (0.35 × OTD) + (0.30 × Prod) + (0.20 × (100 - Risk)) + (0.15 × Forecast)</p>
                <p className="text-amber-400 font-semibold">
                  = (0.35 × 84.2) + (0.30 × 88.5) + (0.20 × 88.0) + (0.15 × 91.2) = 78.4
                </p>
              </div>

              <div className="space-y-2 text-[11px] text-white/70">
                <p><b>1. On-Time Delivery (35%):</b> Mengukur persentase pemenuhan komitmen janji kirim ke customer OEM.</p>
                <p><b>2. Production Achievement (30%):</b> Mengukur rasio output aktual terhadap target rencana produksi harian.</p>
                <p><b>3. Risk Penalty (20%):</b> Penalti pengurangan skor berdasarkan jumlah & tingkat keparahan anomali operasional aktif.</p>
                <p><b>4. Forecast Accuracy (15%):</b> Mengukur presisi model peramalan demand terhadap realisasi penjualan.</p>
              </div>
            </div>

            <div className="flex justify-end pt-2 border-t border-white/10">
              <button
                onClick={() => setIsExplainModalOpen(false)}
                className="px-4 py-1.5 text-xs bg-white text-black font-semibold hover:bg-white/90"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
