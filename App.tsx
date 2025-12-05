import React, { useState, useEffect, useMemo } from 'react';
import InputPanel from './components/InputPanel';
import ResultsDashboard from './components/ResultsDashboard';
import AiAdvisor from './components/AiAdvisor';
import { SimulationInputs, SimulationResult, AiAnalysisState } from './types';
import { calculateSimulation } from './utils/math';
import { analyzeProfitability } from './services/geminiService';

const App: React.FC = () => {
  // Default values representing a typical hypercasual/casual game scenario
  const [inputs, setInputs] = useState<SimulationInputs>({
    adSpend: 5000,
    installs: 10000,
    arpdau: 0.15,
    retentionD1: 40,
    retentionD7: 15,
    retentionD30: 5,
  });

  const [aiState, setAiState] = useState<AiAnalysisState>({
    loading: false,
    content: null,
    error: null,
  });

  // Recalculate simulation whenever inputs change
  const results: SimulationResult = useMemo(() => {
    return calculateSimulation(inputs);
  }, [inputs]);

  const handleAiAnalysis = async () => {
    setAiState({ loading: true, content: null, error: null });
    try {
      const analysisText = await analyzeProfitability(inputs, results);
      setAiState({ loading: false, content: analysisText, error: null });
    } catch (error) {
      setAiState({ 
        loading: false, 
        content: null, 
        error: "Impossible de contacter Gemini. Vérifiez votre clé API ou réessayez." 
      });
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <header className="mb-8">
            <h1 className="text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">
                AdROI Calculator
            </h1>
            <p className="text-slate-400 mt-2 text-lg">
                Simulateur de rentabilité UA (User Acquisition) & Analyse IA
            </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Inputs (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            <InputPanel inputs={inputs} setInputs={setInputs} />
            
            {/* Quick Stats Summary for Mobile context */}
            <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 lg:hidden">
                 <div className="flex justify-between items-center text-sm mb-2">
                    <span className="text-slate-400">CPI Calculé</span>
                    <span className="text-white font-mono">{results.cpi.toFixed(2)}€</span>
                 </div>
                 <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-400">LTV 90 Jours</span>
                    <span className="text-emerald-400 font-mono font-bold">{results.ltvD90.toFixed(2)}€</span>
                 </div>
            </div>
          </div>

          {/* Right Column: Results & AI (8 cols) */}
          <div className="lg:col-span-8 space-y-8">
            <ResultsDashboard results={results} />
            <AiAdvisor 
                onAnalyze={handleAiAnalysis} 
                analysis={aiState} 
                disabled={inputs.installs === 0 || inputs.adSpend === 0}
            />
          </div>

        </div>
      </div>
    </div>
  );
};

export default App;