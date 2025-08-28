
import React, { useState, useMemo } from 'react';
import type { SavedAnalysisResult } from '../types';

type SortKey = 'rank' | 'gameName' | 'deviceSpecs.cpu' | 'performanceScore' | 'scenarios[0].avgFps';
type SortDirection = 'asc' | 'desc';

const getScoreColor = (score: number) => {
    if (score >= 85) return 'text-green-400';
    if (score >= 60) return 'text-yellow-400';
    return 'text-red-400';
}

const TopResultCard: React.FC<{ result: SavedAnalysisResult; rank: number }> = ({ result, rank }) => {
    const rankColors: { [key: number]: string } = {
        1: 'border-yellow-400 bg-yellow-900/20',
        2: 'border-gray-400 bg-gray-800/20',
        3: 'border-amber-600 bg-amber-900/20',
    };
    const rankText: { [key: number]: string } = {
        1: '🏆 1st',
        2: '2nd',
        3: '3rd',
    }

    return (
        <div className={`p-4 rounded-lg border ${rankColors[rank] || 'border-gray-700'} space-y-2`}>
            <div className="flex justify-between items-start">
                <div>
                    <h3 className="font-bold text-lg text-gray-100">{result.gameName}</h3>
                    <p className="text-sm text-gray-300">{result.deviceSpecs.cpu}</p>
                </div>
                <span className={`font-bold ${getScoreColor(result.performanceScore)}`}>{rankText[rank]}</span>
            </div>
             <div className="flex justify-between items-end pt-2">
                <div>
                    <p className="text-xs text-gray-400">{result.scenarios?.[0]?.name || 'Est. FPS'}</p>
                    <p className="font-semibold text-xl text-gray-200">{result.scenarios?.[0]?.avgFps || 'N/A'}</p>
                </div>
                <p className={`text-4xl font-bold ${getScoreColor(result.performanceScore)}`}>{result.performanceScore}</p>
            </div>
        </div>
    );
};

const SortableHeader: React.FC<{
    label: string;
    sortKey: SortKey;
    currentSort: { key: SortKey, direction: SortDirection };
    onSort: (key: SortKey) => void;
}> = ({ label, sortKey, currentSort, onSort }) => (
    <th onClick={() => onSort(sortKey)} className="p-3 text-sm font-semibold text-gray-300 cursor-pointer hover:bg-gray-700/50 transition-colors">
        {label} {currentSort.key === sortKey && (currentSort.direction === 'asc' ? '▲' : '▼')}
    </th>
);

export const MatrixResultsDisplay: React.FC<{
    results: SavedAnalysisResult[];
    errors: string[];
    t: any;
    onReset: () => void;
}> = ({ results, errors, t, onReset }) => {
    const [showAll, setShowAll] = useState(false);
    const [sortConfig, setSortConfig] = useState<{ key: SortKey; direction: SortDirection }>({ key: 'performanceScore', direction: 'desc' });
    
    // FIX: Refactored the logic to ensure `rank` is always present on the result objects.
    // First, we calculate the rank for every result based on performance score.
    // Then, we sort the now-ranked results based on the user's selected column.
    const sortedResults = useMemo(() => {
        const baseSort = [...results].sort((a, b) => (b.performanceScore || 0) - (a.performanceScore || 0));
        const rankedResults = results.map(item => ({
            ...item,
            rank: baseSort.findIndex(i => i.id === item.id) + 1,
        }));

        return rankedResults.sort((a, b) => {
            let aValue: any, bValue: any;

            switch(sortConfig.key) {
                case 'scenarios[0].avgFps':
                    aValue = parseInt(a.scenarios?.[0]?.avgFps.match(/\d+/)?.[0] || '0', 10);
                    bValue = parseInt(b.scenarios?.[0]?.avgFps.match(/\d+/)?.[0] || '0', 10);
                    break;
                case 'deviceSpecs.cpu':
                    aValue = a.deviceSpecs.cpu;
                    bValue = b.deviceSpecs.cpu;
                    break;
                case 'rank':
                    aValue = a.rank;
                    bValue = b.rank;
                    break;
                case 'gameName':
                case 'performanceScore':
                    aValue = a[sortConfig.key];
                    bValue = b[sortConfig.key];
                    break;
                default:
                    aValue = 0;
                    bValue = 0;
            }
            
            if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
            if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
            return 0;
        });
    }, [results, sortConfig]);

    const handleSort = (key: SortKey) => {
        setSortConfig(prev => ({
            key,
            direction: prev.key === key && prev.direction === 'desc' ? 'asc' : 'desc'
        }));
    };

    const topResults = useMemo(() => {
        return [...results].sort((a, b) => (b.performanceScore || 0) - (a.performanceScore || 0)).slice(0, 3);
    }, [results]);


    if(results.length === 0) {
        return (
             <div className="text-center p-6 bg-yellow-900/50 text-yellow-300 rounded-lg animate-fade-in flex flex-col items-center gap-4 w-full max-w-xl">
              <h3 className="font-bold text-lg">Analysis Failed</h3>
              <p className="text-sm">No successful analyses were completed. Please check the device and game names and try again.</p>
              {errors.length > 0 && (
                  <div className="text-left text-xs bg-black/20 p-3 rounded-md w-full">
                      <p className="font-semibold mb-1">Error Log:</p>
                      <ul className="list-disc list-inside space-y-1">
                          {errors.map((err, i) => <li key={i}>{err}</li>)}
                      </ul>
                  </div>
              )}
              <button onClick={onReset} className="mt-2 bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-md transition-colors">{t.tryAgain}</button>
            </div>
        )
    }

    return (
        <div className="w-full space-y-8 animate-fade-in">
            <div className="text-center">
                <h2 className="text-3xl font-bold text-gray-100">Matrix Analysis Complete</h2>
                <p className="text-gray-400 mt-1">{results.length} successful analyses completed. {errors.length > 0 && `${errors.length} failed.`}</p>
            </div>
            
            {errors.length > 0 && (
                 <div className="p-4 bg-yellow-900/50 text-yellow-300 rounded-lg text-sm">
                    <p><strong>Note:</strong> {errors.length} analysis combinations failed and are not shown in the results. Please check the device/game names for the failed items.</p>
                 </div>
            )}

            <div className="space-y-4">
                <h3 className="text-xl font-semibold text-center text-emerald-300">Top Performers</h3>
                {topResults.map((result, index) => (
                    <TopResultCard key={result.id} result={result} rank={index + 1} />
                ))}
            </div>

            <div className="text-center">
                <button onClick={() => setShowAll(!showAll)} className="text-emerald-400 hover:text-emerald-300 font-semibold transition-colors">
                    {showAll ? 'Hide Full Results' : 'Show All Results'}
                </button>
            </div>

            {showAll && (
                 <div className="overflow-x-auto bg-gray-900/50 p-1 sm:p-4 rounded-xl border border-gray-700">
                    <table className="w-full text-left">
                        <thead className="sticky top-0 bg-gray-900/70 backdrop-blur-sm">
                            <tr className="border-b border-gray-600">
                                <SortableHeader label="Rank" sortKey="rank" currentSort={sortConfig} onSort={handleSort} />
                                <SortableHeader label={t.game} sortKey="gameName" currentSort={sortConfig} onSort={handleSort} />
                                <SortableHeader label={t.device} sortKey="deviceSpecs.cpu" currentSort={sortConfig} onSort={handleSort} />
                                <SortableHeader label="Score" sortKey="performanceScore" currentSort={sortConfig} onSort={handleSort} />
                                <SortableHeader label="Est. FPS (Low)" sortKey="scenarios[0].avgFps" currentSort={sortConfig} onSort={handleSort} />
                            </tr>
                        </thead>
                        <tbody>
                            {sortedResults.map((r) => (
                                <tr key={r.id} className="border-b border-gray-700/50 last:border-b-0 hover:bg-gray-800/50 transition-colors">
                                    <td className="p-3 font-medium text-gray-200">{r.rank}</td>
                                    <td className="p-3 text-gray-400">{r.gameName}</td>
                                    <td className="p-3 text-gray-400">{r.deviceSpecs.cpu}</td>
                                    <td className={`p-3 font-bold ${getScoreColor(r.performanceScore)}`}>{r.performanceScore}</td>
                                    <td className="p-3 text-gray-400">{r.scenarios?.[0]?.avgFps || 'N/A'}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                 </div>
            )}
            
            <button onClick={onReset} className="w-full bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-4 rounded-md transition-all duration-300 flex items-center justify-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 11.664 0l3.181-3.183m-4.991-2.696v4.992h-4.992m0 0-3.181-3.183a8.25 8.25 0 0 1 11.664 0l3.181 3.183" /></svg>
              {t.newMatrixAnalysis || 'New Analysis'}
            </button>
        </div>
    );
};
