export interface SimulationInputs {
  adSpend: number;
  installs: number;
  arpdau: number; // Average Revenue Per Daily Active User
  retentionD1: number; // Percentage 0-100
  retentionD7: number; // Percentage 0-100
  retentionD30: number; // Percentage 0-100
}

export interface DayData {
  day: number;
  retention: number;
  dailyRevenue: number;
  cumulativeLTV: number;
  cpi: number;
  isBreakEven: boolean;
}

export interface SimulationResult {
  cpi: number;
  breakEvenDay: number | null; // Null if not reached in projection
  roasD7: number;
  roasD30: number;
  ltvD90: number; // Projected LTV at day 90
  dataPoints: DayData[];
}

export interface AiAnalysisState {
  loading: boolean;
  content: string | null;
  error: string | null;
}
