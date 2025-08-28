

import React from 'react';
import type { SavedAnalysisResult } from '../types';

export const ComparisonTable: React.FC<{
    results: SavedAnalysisResult[];
    t: any;
    title: string;
}> = ({ results, t, title }) => {
  if (results.length === 0) return null;

  const headers = ['Metric', ...results.map(r => `${r.gameName} on ${r.deviceSpecs.cpu.split(' ')[0]}`)];

  const rows = [
    { metric: t.cpuLabel, values: results.map(r => r.deviceSpecs.cpu) },
    { metric: t.gpuLabel, values: results.map(r => r.deviceSpecs.gpu) },
    { metric: t.ramLabel, values: results.map(r => `${r.deviceSpecs.ram}${r.deviceSpecs.ramMhz && r.deviceSpecs.ramMhz !== 'N/A' ? ` (${r.deviceSpecs.ramMhz} MHz)` : ''}`) },
    { metric: t.primaryBottleneck, values: results.map(r => r.bottleneckComponent) },
    { metric: t.upgradeSuggestion, values: results.map(r => r.upgradeSuggestion) },
    { metric: t.estimatedPowerDraw, values: results.map(r => r.estimatedPowerDraw) }
  ];

  if (results[0].scenarios) {
    results[0].scenarios.forEach((scenario, index) => {
      rows.push({
        metric: `FPS (${scenario.name})`,
        values: results.map(r => (r.scenarios && r.scenarios[index] ? r.scenarios[index].avgFps : 'N/A'))
      });
    });
  }

  return (
    <div className="mt-8 animate-fade-in w-full">
        <h3 className="text-2xl font-bold text-center text-emerald-300 mb-4">{title}</h3>
        <div className="overflow-x-auto bg-gray-900/50 p-1 sm:p-4 rounded-xl border border-gray-700">
            <table className="w-full text-left">
                <thead className="sticky top-0 bg-gray-900/70 backdrop-blur-sm">
                    <tr className="border-b border-gray-600">
                        {headers.map((header, i) => (
                            <th key={i} className={`p-3 text-sm font-semibold text-gray-300 ${i === 0 ? 'w-48' : 'min-w-40'}`}>{header}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {rows.map((row, rowIndex) => (
                        <tr key={rowIndex} className="border-b border-gray-700/50 last:border-b-0">
                            <td className="p-3 font-medium text-gray-200 align-top">{row.metric}</td>
                            {row.values.map((value, valueIndex) => (
                                <td key={valueIndex} className="p-3 text-gray-400 align-top">{value}</td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </div>
  );
};