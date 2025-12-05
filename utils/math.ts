import { DayData, SimulationInputs, SimulationResult } from '../types';

// Estimate retention using a Power Law: R(t) = a * t^(-b)
// We align roughly to D1 and D30 to find coefficients.
export const calculateSimulation = (inputs: SimulationInputs): SimulationResult => {
  const { adSpend, installs, arpdau, retentionD1, retentionD30 } = inputs;

  const cpi = installs > 0 ? adSpend / installs : 0;
  
  // Convert percentages to decimals
  const r1 = retentionD1 / 100;
  const r30 = retentionD30 / 100;

  // Power Law coefficients calculation
  // R(1) = a * 1^(-b) => a = r1
  // R(30) = a * 30^(-b) => r30 = r1 * 30^(-b) => 30^(-b) = r30/r1
  // -b * ln(30) = ln(r30/r1) => b = -ln(r30/r1) / ln(30)
  
  const a = r1;
  let b = 0;
  
  if (r1 > 0 && r30 > 0) {
     b = -Math.log(r30 / r1) / Math.log(30);
  }

  const dataPoints: DayData[] = [];
  let cumulativeRevenue = 0;
  let breakEvenDay: number | null = null;

  // Simulate for 90 days (standard LTV projection window)
  for (let t = 1; t <= 90; t++) {
    // Calculate retention for day t
    let retention = 0;
    if (t === 1) retention = r1;
    else if (a > 0) retention = a * Math.pow(t, -b);

    // Cap retention at 100% and floor at 0%
    retention = Math.max(0, Math.min(1, retention));

    // Daily Revenue per Install = ARPDAU * Retention(t)
    const dailyRevenue = arpdau * retention;
    cumulativeRevenue += dailyRevenue;

    const isBreakEven = cumulativeRevenue >= cpi;
    if (isBreakEven && breakEvenDay === null) {
      breakEvenDay = t;
    }

    dataPoints.push({
      day: t,
      retention: retention * 100,
      dailyRevenue,
      cumulativeLTV: cumulativeRevenue,
      cpi,
      isBreakEven
    });
  }

  // Calculate specific ROAS metrics
  const ltvD7 = dataPoints[6].cumulativeLTV; // Index 6 is Day 7
  const ltvD30 = dataPoints[29].cumulativeLTV; // Index 29 is Day 30
  const ltvD90 = cumulativeRevenue;

  const roasD7 = cpi > 0 ? (ltvD7 / cpi) * 100 : 0;
  const roasD30 = cpi > 0 ? (ltvD30 / cpi) * 100 : 0;

  return {
    cpi,
    breakEvenDay,
    roasD7,
    roasD30,
    ltvD90,
    dataPoints
  };
};