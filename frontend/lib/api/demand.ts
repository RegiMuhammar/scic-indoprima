/**
 * Demand & Spare Part Decision Intelligence API Client
 */

export interface ScorecardItem {
  title: string;
  value: string | number;
  target?: string;
  change?: number;
  changePeriod?: string;
  isPositiveGood?: boolean;
  status?: "good" | "warning" | "critical" | "healthy";
  badge?: string;
  detailInfo?: {
    formula: string;
    sourceTables: string[];
    underlyingCauses: string[];
    recommendedAction: string;
  };
}

export interface SparePartItem {
  part_id: string;
  part_name: string;
  category: string;
  criticality: "High" | "Medium" | "Low" | string;
  unit_cost: number;
  lead_time_days: number;
  current_stock: number;
  available_stock: number;
  min_stock: number;
  max_stock: number;
  smart_rop: number;
  is_reorder_triggered: boolean;
  suggested_order_qty: number;
  status: string;
  status_color: string;
}

export interface BomCompatibilityItem {
  bom_id: string;
  part_id: string;
  part_name: string;
  part_category: string;
  machine_id: string;
  machine_name: string;
  machine_category: string;
  line_id: string;
  qty_required: number;
  available_stock: number;
  is_stock_ready: boolean;
  replacement_freq_days: number;
  next_maintenance_days: number;
}

export interface ForecastDataPoint {
  period: string;
  actual?: number | null;
  forecast?: number | null;
  upper_bound?: number | null;
  lower_bound?: number | null;
  is_projected: boolean;
}

export interface SparePartForecastItem {
  part_id: string;
  part_name: string;
  category: string;
  unit: string;
  mape_accuracy: number;
  series: ForecastDataPoint[];
}

export interface StockBalancingItem {
  sku_id: string;
  source_warehouse: string;
  source_qty: number;
  source_dos: number;
  destination_warehouse: string;
  destination_qty: number;
  destination_dos: number;
  suggested_transfer_qty: number;
  estimated_savings_idr: string;
  status: string;
}

export interface DemandSummaryResponse {
  kpis: {
    critical_stockout: ScorecardItem;
    forecast_accuracy: ScorecardItem;
    spare_part_readiness: ScorecardItem;
    inventory_imbalance: ScorecardItem;
  };
  spare_parts: SparePartItem[];
  bom_compatibility: BomCompatibilityItem[];
  spare_part_forecasts: SparePartForecastItem[];
  stock_balancing: StockBalancingItem[];
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export async function fetchDemandSummary(): Promise<DemandSummaryResponse | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/v1/demand/summary`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      cache: "no-store",
    });
    if (!res.ok) {
      console.error(`Failed to fetch demand summary: ${res.statusText}`);
      return null;
    }
    return await res.json();
  } catch (error) {
    console.error("Error fetching demand summary:", error);
    return null;
  }
}
