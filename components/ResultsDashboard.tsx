import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { SimulationResult } from '../types';

interface ResultsDashboardProps {
  results: SimulationResult;
}

const MetricCard: React.FC<{ label: string; value: string; subtext?: string; color?: string }> = ({ label, value, subtext, color = "text-white" }) => (
  <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 shadow-sm flex flex-col justify-between">
    <span className="text-sm text-slate-400 font-medium uppercase tracking-wider">{label}</span>
    <div className={`text-2xl font-bold mt-1 ${color}`}>{value}</div>
    {subtext && <span className="text-xs text-slate-500 mt-1">{subtext}</span>}
  </div>
);

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-900 border border-slate-700 p-3 rounded shadow-lg text-xs">
        <p className="font-bold text-slate-200 mb-1">Jour {label}</p>
        <p className="text-emerald-400">LTV Cumulée: {payload[0].value.toFixed(2)}€</p>
        <p className="text-rose-400">CPI (Coût): {payload[1].value.toFixed(2)}€</p>
      </div>
    );
  }
  return null;
};

const ResultsDashboard: React.FC<ResultsDashboardProps> = ({ results }) => {
  const isProfitable = results.breakEvenDay !== null;

  return (
    <div className="space-y-6">
      
      {/* Top Level Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <MetricCard 
            label="CPI (Coût/Install)" 
            value={`${results.cpi.toFixed(2)}€`} 
            color="text-rose-400"
        />
        <MetricCard 
            label="LTV (Jour 90)" 
            value={`${results.ltvD90.toFixed(2)}€`} 
            color="text-emerald-400"
        />
        <MetricCard 
            label="ROAS J30" 
            value={`${results.roasD30.toFixed(1)}%`} 
            subtext={`Objectif: 100%`}
            color={results.roasD30 >= 100 ? "text-green-500" : "text-yellow-500"}
        />
        <MetricCard 
            label="Rentabilité" 
            value={isProfitable ? `J${results.breakEvenDay}` : "> 90 Jours"} 
            color={isProfitable ? "text-blue-400" : "text-red-500"}
            subtext="Jour de Break-even"
        />
      </div>

      {/* Main Chart */}
      <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-lg">
        <h3 className="text-lg font-bold text-white mb-4">LTV vs CPI (Projection 90 Jours)</h3>
        <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
            <AreaChart
                data={results.dataPoints}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
                <defs>
                    <linearGradient id="colorLtv" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                <XAxis 
                    dataKey="day" 
                    stroke="#94a3b8" 
                    tick={{fontSize: 12}} 
                    tickLine={false}
                    axisLine={false}
                />
                <YAxis 
                    stroke="#94a3b8" 
                    tick={{fontSize: 12}} 
                    tickLine={false} 
                    axisLine={false}
                    unit="€"
                />
                <Tooltip content={<CustomTooltip />} />
                
                {/* CPI Reference Line */}
                <Area 
                    type="monotone" 
                    dataKey="cpi" 
                    stroke="#f43f5e" 
                    strokeWidth={2}
                    fill="transparent" 
                    name="CPI"
                />
                
                {/* LTV Curve */}
                <Area 
                    type="monotone" 
                    dataKey="cumulativeLTV" 
                    stroke="#10b981" 
                    strokeWidth={3}
                    fillOpacity={1} 
                    fill="url(#colorLtv)" 
                    name="LTV"
                />
                
                {results.breakEvenDay && (
                   <ReferenceLine x={results.breakEvenDay} stroke="#3b82f6" strokeDasharray="3 3" label={{ position: 'top',  value: 'Break-even', fill: '#60a5fa', fontSize: 12 }} />
                )}
            </AreaChart>
            </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default ResultsDashboard;