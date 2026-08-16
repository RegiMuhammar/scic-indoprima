/**
 * Dashboard API client — fetches live OLAP analytics from MotherDuck via FastAPI backend
 */

export interface HealthFactorBreakdown {
  otd: number;
  production: number;
  atRiskPenalty: number;
  forecast: number;
}

export interface DataLineageItem {
  factor: string;
  sourceTable: string;
  dataPoint: string;
}

export interface HealthIndexData {
  score: number;
  status: string;
  summaryText: string;
  aiRecommendation: string;
  factors: HealthFactorBreakdown;
  dataLineageFactors: DataLineageItem[];
}

export interface ScorecardItem {
  title: string;
  value: string;
  target: string;
  change: number;
  changePeriod: string;
  isPositive: boolean;
  status: "completed" | "warning" | "critical" | "in_transit" | "delayed";
  badge: string;
  primaryBottleneck: string;
  financialExposure: string;
  breakdown: Array<{ label: string; value: string; status: "Completed" | "Warning" | "Critical" }>;
}

export interface TrendDataPoint {
  period: string;
  otd_rate: number;
  production_achievement: number;
  anomaly_event?: string;
}

export interface ActiveRiskItem {
  id: string;
  category: string;
  description: string;
  impact: string;
  level: "Critical" | "High" | "Medium" | "Low";
  confidence: number;
  detectedAt: string;
}

export interface DeliveryOrderItem {
  id: string;
  doNumber: string;
  customer: string;
  partName: string;
  quantity: number;
  status: "Completed" | "In Transit" | "Delayed";
  etd: string;
  value: string;
}

export interface ParetoLossItem {
  category: string;
  fullCategory?: string;
  minutes: number;
  pct: number;
  cumulativePct: number;
}

export interface LineOeeItem {
  line_id: string;
  line_name: string;
  plant: string;
  target_oee: number;
  availability: number;
  performance: number;
  quality: number;
  overall_oee: number;
  status: string;
  statusColor: string;
  barColor: string;
}

export interface ShiftManpowerItem {
  shift: string;
  output: number;
  defect_pct: number;
  utilization: number;
}

export interface DashboardSummaryResponse {
  health_index: HealthIndexData;
  scorecards: {
    otd: ScorecardItem;
    production: ScorecardItem;
    risk_orders: ScorecardItem;
    plant_oee: ScorecardItem;
  };
  trend_data: TrendDataPoint[];
  active_risks: ActiveRiskItem[];
  recent_orders: DeliveryOrderItem[];
  plant_oee: {
    lines: LineOeeItem[];
    pareto: ParetoLossItem[];
    shifts: ShiftManpowerItem[];
  };
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export async function fetchDashboardSummary(): Promise<DashboardSummaryResponse | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/v1/dashboard/summary`, {
      cache: "no-store",
    });
    if (!res.ok) {
      console.warn(`Dashboard API returned status ${res.status}`);
      return null;
    }
    return await res.json();
  } catch (err) {
    console.warn("Could not connect to FastAPI/MotherDuck backend, using client fallback:", err);
    return null;
  }
}
