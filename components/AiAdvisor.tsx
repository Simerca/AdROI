import React from 'react';
import ReactMarkdown from 'react-markdown';
import { AiAnalysisState } from '../types';

interface AiAdvisorProps {
  onAnalyze: () => void;
  analysis: AiAnalysisState;
  disabled: boolean;
}

const AiAdvisor: React.FC<AiAdvisorProps> = ({ onAnalyze, analysis, disabled }) => {
  return (
    <div className="bg-slate-800 rounded-xl border border-slate-700 shadow-lg overflow-hidden flex flex-col h-full">
      <div className="p-6 border-b border-slate-700 flex justify-between items-center bg-gradient-to-r from-indigo-900/20 to-slate-800">
        <h2 className="text-xl font-bold text-white flex items-center">
          <svg className="w-5 h-5 mr-2 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
          </svg>
          Gemini UA Expert
        </h2>
        <button
          onClick={onAnalyze}
          disabled={analysis.loading || disabled}
          className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 
            ${analysis.loading || disabled
              ? "bg-slate-600 text-slate-400 cursor-not-allowed" 
              : "bg-purple-600 hover:bg-purple-500 text-white shadow-md hover:shadow-purple-500/20"
            }`}
        >
          {analysis.loading ? (
            <span className="flex items-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Analyse en cours...
            </span>
          ) : "Analyser la stratégie"}
        </button>
      </div>

      <div className="p-6 flex-grow bg-slate-800/50">
        {analysis.error && (
            <div className="p-4 bg-red-900/30 border border-red-700/50 rounded-lg text-red-200 mb-4">
                {analysis.error}
            </div>
        )}

        {!analysis.content && !analysis.loading && !analysis.error && (
            <div className="text-center text-slate-500 py-10">
                <p>Cliquez sur le bouton pour obtenir un diagnostic IA de votre campagne.</p>
                <p className="text-xs mt-2 opacity-60">L'IA analysera le ratio LTV/CPI et votre rétention.</p>
            </div>
        )}

        {analysis.content && (
            <div className="prose prose-invert prose-sm max-w-none">
                <ReactMarkdown>{analysis.content}</ReactMarkdown>
            </div>
        )}
      </div>
    </div>
  );
};

export default AiAdvisor;