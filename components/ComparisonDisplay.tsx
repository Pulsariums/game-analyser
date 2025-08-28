
import React, { useState } from 'react';
import type { SavedAnalysisResult } from '../types';
import { CpuIcon, GpuIcon } from './icons';
import { ComparisonTable } from './ComparisonTable';

// Main dashboard component
export const ComparisonDashboard: React.FC<{
  savedResults: SavedAnalysisResult[];
  onDelete: (id: string) => void;
  t: any;
}> = ({ savedResults, onDelete, t }) => {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const handleSelect = (id: string) => {
    setSelectedIds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };
  
  const selectedResults = savedResults.filter(r => selectedIds.has(r.id));

  return (
    <div className="w-full space-y-8 animate-fade-in">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-100">{t.comparisonTitle}</h2>
        <p className="text-gray-400 mt-1">{t.comparisonSubtitle}</p>
      </div>

      <div className="space-y-4 max-h-[50vh] overflow-y-auto pr-2">
        {savedResults.length === 0 ? (
          <p className="text-center text-gray-500 py-8">{t.noSavedResults}</p>
        ) : (
          savedResults.map(result => (
            <div key={result.id} className="flex items-center gap-4 bg-gray-900/50 p-4 rounded-lg border border-gray-700 has-[:checked]:border-emerald-500 has-[:checked]:bg-emerald-900/20 transition-colors">
              <input
                type="checkbox"
                id={`compare-${result.id}`}
                checked={selectedIds.has(result.id)}
                onChange={() => handleSelect(result.id)}
                className="h-5 w-5 rounded bg-gray-700 border-gray-600 text-emerald-500 focus:ring-emerald-500 cursor-pointer"
              />
              <label htmlFor={`compare-${result.id}`} className="flex-grow cursor-pointer">
                <p className="font-bold text-white">{result.gameName}</p>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-400 mt-1">
                    <span className="flex items-center gap-1.5"><CpuIcon className="w-4 h-4" /> {result.deviceSpecs.cpu}</span>
                    <span className="flex items-center gap-1.5"><GpuIcon className="w-4 h-4" /> {result.deviceSpecs.gpu}</span>
                </div>
              </label>
              <button onClick={() => onDelete(result.id)} className="text-gray-500 hover:text-red-400 transition-colors p-1 flex-shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          ))
        )}
      </div>

      {selectedResults.length >= 2 && <ComparisonTable results={selectedResults} t={t} title={t.performanceComparison} />}
    </div>
  );
};
