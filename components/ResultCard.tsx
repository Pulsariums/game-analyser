
import React from 'react';
import type { FpsScenario } from '../types';

const getFpsColor = (fpsString: string): string => {
  const fpsMatch = fpsString.match(/\d+/);
  if (!fpsMatch) return 'text-gray-400';
  const avgFps = parseInt(fpsMatch[0], 10);
  if (avgFps >= 75) return 'text-green-400';
  if (avgFps >= 45) return 'text-yellow-400';
  return 'text-red-400';
};

export const ResultCard: React.FC<{ scenario: FpsScenario }> = ({ scenario }) => {
  const fpsColor = getFpsColor(scenario.avgFps);

  return (
    <div className="bg-gray-700/50 rounded-lg p-4 backdrop-blur-sm border border-gray-600/50 transition-all hover:border-gray-500/50">
      <h3 className="text-lg font-bold text-emerald-300">{scenario.name}</h3>
      <div className="mt-2 flex items-baseline gap-4">
        <p className={`text-4xl font-bold ${fpsColor}`}>{scenario.avgFps}</p>
        <p className="text-gray-400 text-sm">
          {scenario.resolution} @ {scenario.settings}
        </p>
      </div>
      <p className="mt-3 text-gray-300 text-sm">{scenario.analysis}</p>
    </div>
  );
};
