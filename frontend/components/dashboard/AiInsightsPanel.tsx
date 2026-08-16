"use client";

import React, { useState } from "react";
import { Sparkles, ArrowRight, ShieldCheck, Check, X } from "lucide-react";

interface InsightItem {
  id: string;
  module: string;
  priority: "Critical" | "High" | "Medium";
  title: string;
  summary: string;
  contributingFactors: string[];
  confidenceScore: number;
  businessImpact: string;
  recommendedAction: string;
}

const initialInsights: InsightItem[] = [
  {
    id: "INS-001",
    module: "Production & OEE",
    priority: "Critical",
    title: "Unscheduled Hydraulic Calibration di Line 3 Stamping Press",
    summary: "Sensor mendeteksi spike getaran (5.8 mm/s) & anomali temperatur hidrolik (78°C). Downtime 14 jam menyebabkan shortfall 1.200 unit.",
    contributingFactors: [
      "Vibration amplitude spike > 5.5 mm/s",
      "Hydraulic pump seal wear (PRT-HYD-01)",
      "Operating load shift 3 overload (+18%)",
    ],
    confidenceScore: 94.0,
    businessImpact: "Potensi denda keterlambatan OEM $42.000 & stockout assembling",
    recommendedAction: "Alihkan order prioritas ke Line 1 dan eksekusi emergency repair WO-2026-0881.",
  },
  {
    id: "INS-005",
    module: "Demand & Stock Balancing",
    priority: "High",
    title: "Rekomendasi Relokasi Stok Antar-Cabang (Stock Balancing)",
    summary: "Gudang Karawang mengalami dead-stock Brake Pad (DOS 128 hari), sedangkan Gudang Surabaya mengalami krisis stockout (DOS 14 hari).",
    contributingFactors: [
      "Karawang on-hand 8.400 unit (Holding cost $1.800/bln)",
      "Surabaya demand surge (+24% Toyota OEM)",
      "Transit lead time darat 2 hari via Logitrans",
    ],
    confidenceScore: 91.5,
    businessImpact: "Mencegah lost sales Rp 2,4 Miliar & memotong biaya simpan Karawang",
    recommendedAction: "Transfer 2.500 unit dari WHS-KRW-01 ke WHS-SBY-01 (Estimasi biaya logistik $450).",
  },
  {
    id: "INS-002",
    module: "Logistics & Delivery",
    priority: "High",
    title: "Penumpukan Antrian Ekspor di Pelabuhan Tanjung Perak",
    summary: "Waktu antrian kepabeanan naik 42 jam, berisiko menunda keberangkatan kapal feeder untuk 8 delivery order ekspor Thailand.",
    contributingFactors: [
      "Customs inspection bottleneck container yard",
      "Feeder ship schedule cutoff 18 Aug 18:00",
    ],
    confidenceScore: 88.0,
    businessImpact: "8 delivery order senilai $184.000 berpotensi terlambat 3 hari",
    recommendedAction: "Ajukan jalur prioritas dokumen hijau / split shipment 4 kontainer via rute udara darurat.",
  },
];

export function AiInsightsPanel() {
  const [insights] = useState<InsightItem[]>(initialInsights);
  const [selectedInsight, setSelectedInsight] = useState<InsightItem | null>(null);
  const [decisionFeedback, setDecisionFeedback] = useState<{ id: string; status: string } | null>(null);

  const priorityColorMap = {
    Critical: "text-red-400 font-semibold",
    High: "text-amber-400 font-semibold",
    Medium: "text-blue-400 font-semibold",
  };

  const handleAction = (id: string, actionType: "Approved" | "Dismissed") => {
    setDecisionFeedback({ id, status: actionType });
    setTimeout(() => {
      setDecisionFeedback(null);
      setSelectedInsight(null);
    }, 1500);
  };

  return (
    <div className="flex flex-col h-full bg-[#000000] border-b border-r border-white/10 p-6 rounded-none font-poppins">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-blue-400" />
          <h3 className="text-white text-sm font-semibold font-poppins">
            AI Priority Decision Insights
          </h3>
          <span className="text-xs text-blue-400 font-medium">
            {insights.length} Actionable Items
          </span>
        </div>
        <span className="text-white/40 text-xs">Human-in-the-Loop Review</span>
      </div>

      {/* Insight List */}
      <div className="space-y-3 flex-1 overflow-y-auto">
        {insights.map((item) => (
          <div
            key={item.id}
            className="p-4 bg-[#0a0a0a] border border-white/10 hover:border-white/20 transition-all rounded-none flex flex-col gap-3"
          >
            {/* Top Row: Priority, Module & Confidence */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className={`text-xs ${priorityColorMap[item.priority]}`}>
                  {item.priority}
                </span>
                <span className="text-white/40 text-[11px] font-medium">
                  • {item.module}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[11px] text-white/50">Confidence:</span>
                <span className="text-xs font-semibold text-emerald-400 font-mono">
                  {item.confidenceScore}%
                </span>
              </div>
            </div>

            {/* Title & Summary */}
            <div>
              <h4 className="text-white text-xs font-semibold font-poppins mb-1">
                {item.title}
              </h4>
              <p className="text-white/60 text-[11px] leading-relaxed">
                {item.summary}
              </p>
            </div>

            {/* Impact & Recommended Action */}
            <div className="p-2.5 bg-white/[0.02] border border-white/5 text-[11px] flex flex-col gap-1">
              <div className="text-amber-400 font-medium">
                Impact: <span className="text-white/80 font-normal">{item.businessImpact}</span>
              </div>
              <div className="text-blue-400 font-medium">
                Recommendation: <span className="text-white/80 font-normal">{item.recommendedAction}</span>
              </div>
            </div>

            {/* Action Button */}
            <div className="flex items-center justify-between pt-1">
              <span className="text-white/30 text-[10px] font-mono">Ref ID: {item.id}</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleAction(item.id, "Approved")}
                  className="px-3 py-1 text-[11px] font-medium text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/10 transition-colors flex items-center gap-1"
                >
                  <Check className="w-3 h-3" />
                  Approve Action
                </button>
                <button
                  onClick={() => setSelectedInsight(item)}
                  className="px-3 py-1 text-[11px] font-medium text-white/80 border border-white/10 hover:bg-white/10 hover:text-white transition-colors flex items-center gap-1"
                >
                  <span>Detail & Factors</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>

            {decisionFeedback?.id === item.id && (
              <div className="p-2 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2 animate-fadeIn">
                <ShieldCheck className="w-4 h-4" />
                Keputusan tercatat di Audit Log: <b>{decisionFeedback.status}</b> oleh Human Manager.
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Detail Modal / Slide-in Drawer */}
      {selectedInsight && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0a0a0a] border border-white/20 p-6 max-w-xl w-full rounded-none shadow-2xl font-poppins space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-blue-400" />
                <h3 className="text-white text-sm font-semibold">
                  AI Explainability & Contributing Factors
                </h3>
              </div>
              <button
                onClick={() => setSelectedInsight(null)}
                className="text-white/40 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <span className="text-white/40 text-[10px] uppercase font-semibold">Insight Title</span>
                <p className="text-white font-medium text-sm mt-0.5">{selectedInsight.title}</p>
              </div>

              <div>
                <span className="text-white/40 text-[10px] uppercase font-semibold">Contributing Factors (Evidence Base)</span>
                <ul className="list-disc list-inside space-y-1 mt-1 text-white/80">
                  {selectedInsight.contributingFactors.map((factor, idx) => (
                    <li key={idx}>{factor}</li>
                  ))}
                </ul>
              </div>

              <div className="p-3 bg-white/[0.02] border border-white/10 space-y-1 text-[11px]">
                <p className="text-amber-400 font-medium">Business Impact Analysis:</p>
                <p className="text-white/80">{selectedInsight.businessImpact}</p>
              </div>

              <div className="p-3 bg-white/[0.02] border border-white/10 space-y-1 text-[11px]">
                <p className="text-blue-400 font-medium">Prescribed Mitigation Plan:</p>
                <p className="text-white/80">{selectedInsight.recommendedAction}</p>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-white/10">
              <button
                onClick={() => setSelectedInsight(null)}
                className="px-4 py-1.5 text-xs text-white/60 hover:text-white border border-white/10"
              >
                Close
              </button>
              <button
                onClick={() => handleAction(selectedInsight.id, "Approved")}
                className="px-4 py-1.5 text-xs bg-white text-black font-semibold hover:bg-white/90"
              >
                Approve & Execute
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
