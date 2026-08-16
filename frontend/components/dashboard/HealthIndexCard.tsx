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
  summaryText = "Terdeteksi 8 delivery orders berisiko terlambat akibat 14.5 jam downtime hidrolik Line 3 di Karawang.",
  aiRecommendation = "Realokasi batch darurat DO-202501 ke rute darat & jadwalkan preventive maintenance die tooling sebelum shift pagi.",
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
  // Center cx=130, cy=132, radius=96, strokeWidth=16
  const radius = 96;
  const strokeWidth = 16;
  const circumference = Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  // 4 Weight Compositions breakdown
  const weightCompositions: WeightComposition[] = [
    {
      label: "On-Time Delivery",
      weightPct: 35,
      actualValue: otdScore,
      unit: "%",
      contributedScore: +(0.35 * otdScore).toFixed(1),
    },
    {
      label: "Production Ach.",
      weightPct: 30,
      actualValue: prodScore,
      unit: "%",
      contributedScore: +(0.30 * prodScore).toFixed(1),
    },
    {
      label: "Risk Penalty",
      weightPct: 20,
      actualValue: atRiskPenalty,
      unit: "pts",
      contributedScore: +(0.20 * (100 - atRiskPenalty)).toFixed(1),
    },
    {
      label: "Forecast Accuracy",
      weightPct: 15,
      actualValue: forecastScore,
      unit: "%",
      contributedScore: +(0.15 * forecastScore).toFixed(1),
    },
  ];

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-10 gap-4 font-poppins">
        
        {/* ── LEFT PANEL (70% / 7 COLS): Health Index Gauge & 4 Weight Breakdown Cards ── */}
        <div className="lg:col-span-7 bg-[#000000] border border-white/10 p-6 flex flex-col justify-between space-y-6">
          
          {/* Top: Large Prominent Gauge + Concise Status */}
          <div className="flex flex-col sm:flex-row items-center justify-start gap-8">
            
            {/* Precision Centered SVG Gauge Chart */}
            <div className="relative w-[260px] h-[150px] flex items-center justify-center shrink-0">
              <svg width="260" height="150" viewBox="0 0 260 150" className="overflow-visible select-none">
                {/* Background Arc */}
                <path
                  d="M 34 132 A 96 96 0 0 1 226 132"
                  fill="none"
                  stroke="rgba(255,255,255,0.1)"
                  strokeWidth={strokeWidth}
                  strokeLinecap="round"
                />
                {/* Active Progress Arc (Amber) */}
                <path
                  d="M 34 132 A 96 96 0 0 1 226 132"
                  fill="none"
                  stroke="#f59e0b"
                  strokeWidth={strokeWidth}
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  className="transition-all duration-1000 ease-out"
                />

                {/* Score Number in Optical Center (y=102 provides >35px clear margin from top arc y=36) */}
                <text
                  x="130"
                  y="102"
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
                  x="130"
                  y="124"
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
                  y="140"
                  textAnchor="middle"
                  fill="rgba(255,255,255,0.3)"
                  fontSize="11"
                  fontFamily="monospace"
                >
                  0
                </text>

                {/* Scale 100 indicator */}
                <text
                  x="246"
                  y="140"
                  textAnchor="middle"
                  fill="rgba(255,255,255,0.3)"
                  fontSize="11"
                  fontFamily="monospace"
                >
                  100
                </text>
              </svg>
            </div>

            {/* Status Label & Concise Operational Summary */}
            <div className="flex-1 space-y-2 text-center sm:text-left sm:pl-6 sm:border-l sm:border-white/10">
              <div>
                <span className="text-white/40 text-[10px] uppercase tracking-wider font-semibold block">
                  Composite Health Index
                </span>
                <span className="text-lg font-bold text-amber-400">
                  {status}
                </span>
                <p className="text-white/40 text-xs mt-0.5">
                  Threshold: &lt;75 Critical, 75-89 Warning, &ge;90 Healthy.
                </p>
              </div>

              <p className="text-white/70 text-xs leading-relaxed pt-1">
                {summaryText}
              </p>
            </div>

          </div>

          {/* Bottom: 4 Composition Factor Cards */}
          <div>
            {/* Header: Title on Left, "Lihat Detail" Button on Right */}
            <div className="flex items-center justify-between mb-3">
              <span className="text-white/50 text-xs uppercase tracking-wider font-semibold">
                Komposisi 4 Faktor Pembentuk Skor ({score} Pts)
              </span>
              <button
                onClick={() => setIsExplainModalOpen(true)}
                className="text-white/60 hover:text-white text-xs underline underline-offset-4 decoration-white/20 hover:decoration-white transition-colors"
              >
                Lihat Detail Formula & Pembobotan
              </button>
            </div>

            {/* 4 Factor Cards Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {weightCompositions.map((comp) => (
                <div
                  key={comp.label}
                  className="bg-white/[0.02] border border-white/10 p-3.5 flex flex-col justify-between"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-white/50 text-[11px] truncate max-w-[95px]">
                      {comp.label}
                    </span>
                    <span className="text-white/40 text-[10px] font-mono">
                      {comp.weightPct}%
                    </span>
                  </div>

                  <div className="my-2">
                    <span className="text-white text-lg font-bold font-mono">
                      {comp.actualValue}{comp.unit}
                    </span>
                  </div>

                  <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[11px]">
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

        {/* ── RIGHT PANEL (30% / 3 COLS): AI Prescriptive Recommendation & Data Lineage ── */}
        <div className="lg:col-span-3 bg-[#000000] border border-white/10 p-6 flex flex-col justify-between space-y-4">
          
          <div>
            {/* Header with Light Sparkles Icon */}
            <div className="flex items-center gap-2 mb-2 pb-2 border-b border-white/10">
              <Sparkles className="w-4 h-4 text-white/70" />
              <h3 className="text-white text-xs font-semibold">
                AI Prescriptive Action
              </h3>
            </div>

            {/* Prescriptive Recommendation Text */}
            <p className="text-white/80 text-xs leading-relaxed">
              {aiRecommendation}
            </p>
          </div>

          {/* Explainability / Why AI Recommended This (Data Lineage) */}
          <div className="pt-3 border-t border-white/10 space-y-2">
            <div className="flex items-center gap-1.5 text-white/50 text-[11px] font-medium">
              <Info className="w-3.5 h-3.5" />
              <span>Faktor Data Pemicu AI:</span>
            </div>

            <div className="space-y-1.5">
              {dataLineageFactors.map((item, idx) => (
                <div
                  key={idx}
                  className="p-2 bg-white/[0.02] border border-white/5 text-[11px] flex flex-col gap-0.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-white font-medium">{item.factor}</span>
                    <span className="text-white/30 font-mono text-[9px]">
                      {item.sourceTable}
                    </span>
                  </div>
                  <span className="text-white/60 text-[10px]">
                    {item.dataPoint}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[10px] text-white/30">
            <span>Model: SupplyChain-Reasoner v2.4</span>
            <span>Confidence: 94.6%</span>
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
