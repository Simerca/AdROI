import React from 'react';
import { SimulationInputs } from '../types';

interface InputPanelProps {
  inputs: SimulationInputs;
  setInputs: React.Dispatch<React.SetStateAction<SimulationInputs>>;
}

const InputPanel: React.FC<InputPanelProps> = ({ inputs, setInputs }) => {
  const handleChange = (field: keyof SimulationInputs, value: string) => {
    const numValue = parseFloat(value);
    setInputs(prev => ({
      ...prev,
      [field]: isNaN(numValue) ? 0 : numValue
    }));
  };

  return (
    <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-lg">
      <h2 className="text-xl font-bold text-white mb-6 flex items-center">
        <svg className="w-5 h-5 mr-2 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"></path></svg>
        Paramètres de Campagne
      </h2>

      <div className="space-y-6">
        {/* Ad Spend & Installs */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1">Dépenses Ads (€)</label>
            <input
              type="number"
              value={inputs.adSpend}
              onChange={(e) => handleChange('adSpend', e.target.value)}
              className="w-full bg-slate-900 border border-slate-600 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1">Nb Installations</label>
            <input
              type="number"
              value={inputs.installs}
              onChange={(e) => handleChange('installs', e.target.value)}
              className="w-full bg-slate-900 border border-slate-600 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
        </div>

        {/* ARPDAU */}
        <div>
          <label className="block text-sm font-medium text-slate-400 mb-1">
            ARPDAU (€) 
            <span className="text-xs text-slate-500 ml-2">(Rev. Moyen par DAU)</span>
          </label>
          <input
            type="number"
            step="0.01"
            value={inputs.arpdau}
            onChange={(e) => handleChange('arpdau', e.target.value)}
            className="w-full bg-slate-900 border border-slate-600 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>

        <div className="border-t border-slate-700 my-4 pt-4">
            <h3 className="text-sm font-semibold text-slate-300 mb-4">Courbe de Rétention</h3>
            
            <div className="space-y-4">
                <div>
                    <div className="flex justify-between text-sm mb-1">
                        <label className="text-slate-400">Jour 1 (D1)</label>
                        <span className="text-blue-400 font-mono">{inputs.retentionD1}%</span>
                    </div>
                    <input
                        type="range"
                        min="1"
                        max="100"
                        value={inputs.retentionD1}
                        onChange={(e) => handleChange('retentionD1', e.target.value)}
                        className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
                    />
                </div>

                <div>
                    <div className="flex justify-between text-sm mb-1">
                        <label className="text-slate-400">Jour 7 (D7)</label>
                        <span className="text-blue-400 font-mono">{inputs.retentionD7}%</span>
                    </div>
                    <input
                        type="range"
                        min="1"
                        max="100"
                        value={inputs.retentionD7}
                        onChange={(e) => handleChange('retentionD7', e.target.value)}
                        className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
                    />
                </div>

                <div>
                    <div className="flex justify-between text-sm mb-1">
                        <label className="text-slate-400">Jour 30 (D30)</label>
                        <span className="text-blue-400 font-mono">{inputs.retentionD30}%</span>
                    </div>
                    <input
                        type="range"
                        min="0"
                        max="100"
                        value={inputs.retentionD30}
                        onChange={(e) => handleChange('retentionD30', e.target.value)}
                        className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
                    />
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default InputPanel;