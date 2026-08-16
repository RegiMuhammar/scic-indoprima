"use client";

import React, { useState } from "react";
import { Sparkles, X, Info } from "lucide-react";

export interface WeightComposition {
  label: string;
  weightPct: number;
  actualValue: number;
  unit: string;
  contributedScore: number;
}

export interface HealthIndexCardProps {
  score?: number;
  status?: string;
  summaryText?: string;
  aiRecommendation?: string;
  dataLineageFactors?: Array<{
    factor: string;
    sourceTable: string;
    dataPoint: string;
  }>;
  otdScore?: number;
  prodScore?: number;
  atRiskPenalty?: number;
  forecastScore?: number;
}

export function HealthIndexCard({
  score = 78.4,
  status = "Needs Attention",
  summaryText = "Operasional pabrik & pengiriman terindikasi risiko moderat akibat 14.5 jam downtime kalibrasi hidrolik Line 3 di Pabrik Karawang serta antrian kepabeanan di Pelabuhan Tanjung Perak (+42 jam).",
  aiRecommendation = "Realokasi batch darurat DO-202501 (1.000 pcs) via rute darat menuju OEM & jadwalkan preventive maintenance sistem hidrolik Line 3 sebelum shift pagi.",
  dataLineageFactors = [
    { factor: "Mesin Line 3 Karawang", sourceTable: "fact_downtime_logs", dataPoint: "14.5 jam kalibrasi hidrolik" },
    { factor: "Delivery Orders Terlambat", sourceTable: "delivery_order", dataPoint: "8 DO ($184.000 exposure)" },
    { factor: "Logistik Pelabuhan", sourceTable: "logistics_telemetry", dataPoint: "Tanjung Perak queue +42h" },
  ],
  otdScore = 84.2,
  prodScore = 88.5,
  atRiskPenalty = 12.0,
  forecastScore = 91.2,
}: HealthIndexCardProps) {
  const [isExplainModalOpen, setIsExplainModalOpen] = useState(false);

  // Precision SVG Gauge calculations (180-degree semi-circle)
  // Canvas: width 240, height 140. Center cx=120, cy=122, radius=88, strokeWidth=15
  const radius = 88;
  const strokeWidth = 15;
  const circumference = Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  // 4 Weight Compositions breakdown (arranged in 2x2 Grid)
  const weightCompositions: WeightComposition[] = [
    {
      label: "On-Time Delivery (OTD)",
      weightPct: 35,
      actualValue: otdScore,
      unit: "%",
      contributedScore: +(0.35 * otdScore).toFixed(1),
    },
    {
      label: "Production Achievement",
      weightPct: 30,
      actualValue: prodScore,
      unit: "%",
      contributedScore: +(0.30 * prodScore).toFixed(1),
    },
    {
      label: "Risk Penalty Reduction",
      weightPct: 20,
      actualValue: atRiskPenalty,
      unit: "pts",
      contributedScore: +(0.20 * (100 - atRiskPenalty)).toFixed(1),
    },
    {
      label: "Demand Forecast Accuracy",
      weightPct: 15,
      actualValue: forecastScore,
      unit: "%",
      contributedScore: +(0.15 * forecastScore).toFixed(1),
    },
  ];

  return (
    <>
      <div className="space-y-4 font-poppins">
        
        {/* ── ROW 1: TOP SECTION (Gauge Kiri ~35% & Grid 2x2 Komposisi Bobot Kanan ~65%) ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          
          {/* Card Kiri: Composite Health Index (~35% / 4 Cols) */}
          <div className="lg:col-span-4 bg-[#000000] border border-white/10 p-6 flex flex-col justify-between items-center text-center">
            
            {/* Header Title */}
            <div className="w-full text-left">
              <span className="text-white/50 text-xs font-semibold uppercase tracking-wider">
                Composite Health Index
              </span>
            </div>

            {/* Gauge Meter with Native SVG Centering */}
            <div className="relative w-[240px] h-[140px] flex items-center justify-center my-3">
              <svg width="240" height="140" viewBox="0 0 240 140" className="overflow-visible select-none">
                {/* Background Arc */}
                <path
                  d="M 32 122 A 88 88 0 0 1 208 122"
                  fill="none"
                  stroke="rgba(255,255,255,0.1)"
                  strokeWidth={strokeWidth}
                  strokeLinecap="round"
                />
                {/* Active Progress Arc (Amber) */}
                <path
                  d="M 32 122 A 88 88 0 0 1 208 122"
                  fill="none"
                  stroke="#f59e0b"
                  strokeWidth={strokeWidth}
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  className="transition-all duration-1000 ease-out"
                />

                {/* Score Number in True Optical Center */}
                <text
                  x="120"
                  y="92"
                  textAnchor="middle"
                  fill="#ffffff"
                  fontSize="44"
                  fontWeight="700"
                  fontFamily="Poppins, sans-serif"
                  letterSpacing="-0.03em"
                >
                  {score}
                </text>

                {/* Subtitle SCORE / 100 */}
                <text
                  x="120"
                  y="114"
                  textAnchor="middle"
                  fill="rgba(255,255,255,0.4)"
                  fontSize="10"
                  fontWeight="600"
                  letterSpacing="0.08em"
                  fontFamily="Poppins, sans-serif"
                >
                  SCORE / 100
                </text>

                {/* Scale 0 indicator */}
                <text
                  x="14"
                  y="130"
                  textAnchor="middle"
                  fill="rgba(255,255,255,0.3)"
                  fontSize="11"
                  fontFamily="monospace"
                >
                  0
                </text>

                {/* Scale 100 indicator */}
                <text
                  x="226"
                  y="130"
                  textAnchor="middle"
                  fill="rgba(255,255,255,0.3)"
                  fontSize="11"
                  fontFamily="monospace"
                >
                  100
                </text>
              </svg>
            </div>

            {/* Bottom Status & Threshold */}
            <div>
              <span className="text-base font-bold text-amber-400 block">
                {status}
              </span>
              <p className="text-white/40 text-[11px] mt-0.5">
                Threshold: &lt;75 Critical, 75-89 Warning, &ge;90 Healthy
              </p>
            </div>

          </div>

          {/* Card Kanan: Komposisi 4 Faktor Pembentuk Skor Grid 2x2 (~65% / 8 Cols) */}
          <div className="lg:col-span-8 bg-[#000000] border border-white/10 p-6 flex flex-col justify-between">
            
            {/* Header Section */}
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <span className="text-white/70 text-xs font-semibold uppercase tracking-wider">
                Komposisi 4 Faktor Pembentuk Skor ({score} Pts)
              </span>
              <button
                onClick={() => setIsExplainModalOpen(true)}
                className="text-white/60 hover:text-white text-xs underline underline-offset-4 decoration-white/20 hover:decoration-white transition-colors"
              >
                Lihat Detail Formula & Pembobotan
              </button>
            </div>

            {/* 2x2 Grid Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mt-3.5">
              {weightCompositions.map((comp) => (
                <div
                  key={comp.label}
                  className="bg-white/[0.02] border border-white/10 p-4 flex flex-col justify-between"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-white/60 text-xs font-medium truncate max-w-[170px]">
                      {comp.label}
                    </span>
                    <span className="text-white/40 text-xs font-mono">
                      Bobot {comp.weightPct}%
                    </span>
                  </div>

                  <div className="my-2.5">
                    <span className="text-white text-xl font-bold font-mono">
                      {comp.actualValue}{comp.unit}
                    </span>
                  </div>

                  <div className="pt-2 border-t border-white/5 flex items-center justify-between text-xs">
                    <span className="text-white/40">Kontribusi:</span>
                    <span className="text-white font-semibold font-mono">
                      +{comp.contributedScore} pts
                    </span>
                  </div>
                </div>
              ))}
            </div>

          </div>

        </div>

        {/* ── ROW 2: FULL-WIDTH AI EXECUTIVE SUMMARY & PRESCRIPTIVE ACTION (100% Lebar) ── */}
        <div className="bg-[#000000] border border-white/10 p-6 space-y-5">
          
          {/* Header with Light Sparkles Icon */}
          <div className="flex items-center gap-2 pb-3 border-b border-white/10">
            <Sparkles className="w-4 h-4 text-white/70" />
            <h3 className="text-white text-xs font-semibold uppercase tracking-wider">
              AI Executive Summary & Prescriptive Action
            </h3>
          </div>

          {/* 1. Text Penjelasan (Ringkasan Eksekutif) */}
          <div className="space-y-1">
            <span className="text-white/40 text-[10px] uppercase tracking-wider font-semibold block">
              Ringkasan Kondisi Operasional
            </span>
            <p className="text-white/80 text-xs leading-relaxed">
              {summaryText}
            </p>
          </div>

          {/* 2. Action (Rekomendasi Tindakan Preskriptif) */}
          <div className="space-y-1">
            <span className="text-white/40 text-[10px] uppercase tracking-wider font-semibold block">
              Rekomendasi Tindakan (Actionable Decision)
            </span>
            <div className="p-3.5 bg-white/[0.02] border border-white/10 text-xs">
              <p className="text-white font-medium leading-relaxed">
                {aiRecommendation}
              </p>
            </div>
          </div>

          {/* 3. Faktor Data (Explainability / Data Lineage) */}
          <div className="space-y-2 pt-1">
            <div className="flex items-center gap-1.5 text-white/50 text-[11px] font-medium">
              <Info className="w-3.5 h-3.5" />
              <span>Faktor Data Pemicu Rekomendasi AI:</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {dataLineageFactors.map((item, idx) => (
                <div
                  key={idx}
                  className="p-3 bg-white/[0.02] border border-white/5 text-xs flex flex-col gap-1"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-white font-medium text-xs">{item.factor}</span>
                    <span className="text-white/30 font-mono text-[10px]">
                      {item.sourceTable}
                    </span>
                  </div>
                  <span className="text-white/70 text-[11px]">
                    {item.dataPoint}
                  </span>
                </div>
              ))}
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
                <p className="text-white font-semibold">
                  = (0.35 × {otdScore}) + (0.30 × {prodScore}) + (0.20 × {100 - atRiskPenalty}) + (0.15 × {forecastScore}) = {score}
                </p>
              </div>

              <div className="space-y-2 text-[11px] text-white/70">
                <p><b>1. On-Time Delivery (35%):</b> Mengukur persentase pemenuhan komitmen janji kirim ke customer OEM (Current: {otdScore}% &rarr; +{(0.35 * otdScore).toFixed(1)} pts).</p>
                <p><b>2. Production Achievement (30%):</b> Mengukur rasio output aktual terhadap target rencana produksi harian (Current: {prodScore}% &rarr; +{(0.30 * prodScore).toFixed(1)} pts).</p>
                <p><b>3. Risk Penalty (20%):</b> Penalti pengurangan skor berdasarkan jumlah & tingkat keparahan anomali aktif (Penalty: -{atRiskPenalty} pts &rarr; +{(0.20 * (100 - atRiskPenalty)).toFixed(1)} pts).</p>
                <p><b>4. Forecast Accuracy (15%):</b> Mengukur presisi model peramalan demand terhadap realisasi penjualan (Current: {forecastScore}% &rarr; +{(0.15 * forecastScore).toFixed(1)} pts).</p>
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
