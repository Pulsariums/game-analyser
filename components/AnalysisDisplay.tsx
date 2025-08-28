
import React from 'react';
import type { AnalysisResult, ComponentAnalysis } from '../types';
import { ResultCard } from './ResultCard';
import { CpuIcon, GpuIcon, RamIcon, VramIcon, BottleneckIcon, UpgradeIcon } from './icons';

const ComponentIcon: React.FC<{ component: ComponentAnalysis['component'] }> = ({ component }) => {
  const className = "w-8 h-8 text-emerald-400";
  if (component === 'CPU') return <CpuIcon className={className} />;
  if (component === 'GPU') return <GpuIcon className={className} />;
  if (component === 'RAM') return <RamIcon className={className} />;
  if (component === 'Virtual RAM') return <VramIcon className={className} />;
  return null;
};

const ComponentBreakdownCard: React.FC<{ item: ComponentAnalysis }> = ({ item }) => (
  <div className="flex items-start gap-4 p-4 bg-gray-900/30 rounded-lg">
    <div className="flex-shrink-0">
      <ComponentIcon component={item.component} />
    </div>
    <div>
      <h4 className="font-bold text-gray-100">{item.component}: <span className="font-normal text-gray-300">{item.model}</span></h4>
      <p className="text-sm text-gray-400 mt-1">{item.analysis}</p>
    </div>
  </div>
);

const VerdictCard: React.FC<{ result: AnalysisResult; t: any }> = ({ result, t }) => (
    <div className="text-left p-6 bg-gray-900/50 rounded-xl border border-gray-700 space-y-5">
        <h2 className="text-2xl font-bold text-emerald-300 text-center mb-4">{t.analysisComplete}</h2>
        
        <p className="text-lg text-gray-300 text-center italic">"{result.summary}"</p>

        <div className="space-y-4 pt-4 border-t border-gray-700/50">
            <div className="flex items-start gap-3">
                <BottleneckIcon className="w-6 h-6 text-yellow-400 flex-shrink-0 mt-1" />
                <div>
                    <h4 className="font-semibold text-yellow-300">{t.primaryBottleneck}</h4>
                    <p className="text-gray-300">{result.bottleneckComponent}</p>
                </div>
            </div>
            <div className="flex items-start gap-3">
                <UpgradeIcon className="w-6 h-6 text-green-400 flex-shrink-0 mt-1" />
                <div>
                    <h4 className="font-semibold text-green-300">{t.upgradeSuggestion}</h4>
                    <p className="text-gray-300">{result.upgradeSuggestion}</p>
                </div>
            </div>
        </div>
    </div>
);


export const AnalysisDisplay: React.FC<{ 
  result: AnalysisResult; 
  language: string; 
  onReset: () => void;
  onSave: () => void;
}> = ({ result, language, onReset, onSave }) => {
  const t = {
    en: {
        analysisComplete: "Analysis Complete",
        primaryBottleneck: "Primary Bottleneck",
        upgradeSuggestion: "Upgrade Suggestion",
        hardwareBreakdown: "Hardware Breakdown",
        performanceScenarios: "Performance Scenarios",
        saveForComparison: "Save for Comparison",
        newAnalysis: "New Analysis",
    },
    tr: {
        analysisComplete: "Analiz Tamamlandı",
        primaryBottleneck: "Temel Darboğaz",
        upgradeSuggestion: "Yükseltme Önerisi",
        hardwareBreakdown: "Donanım Analizi",
        performanceScenarios: "Performans Senaryoları",
        saveForComparison: "Karşılaştırma İçin Kaydet",
        newAnalysis: "Yeni Analiz",
    }
  }[language];

  return (
    <div className="space-y-8 animate-fade-in w-full">
      {/* Verdict Section */}
      <VerdictCard result={result} t={t} />

      {/* Component Breakdown Section */}
      <div>
        <h3 className="text-xl font-semibold mb-4 text-center text-gray-300">{t.hardwareBreakdown}</h3>
        <div className="space-y-3">
          {result.componentBreakdown.map(item => (
            <ComponentBreakdownCard key={item.component} item={item} />
          ))}
        </div>
      </div>

      {/* Scenarios Section */}
      <div>
        <h3 className="text-xl font-semibold mb-4 text-center text-gray-300">{t.performanceScenarios}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {result.scenarios.map(scenario => (
            <ResultCard key={scenario.name} scenario={scenario} />
          ))}
        </div>
      </div>
      
      {/* Action Buttons */}
      <div className="mt-8 flex flex-col sm:flex-row gap-4">
        <button
          onClick={onSave}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-md transition-all duration-300 flex items-center justify-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v12l-5-3-5 3V4z" />
          </svg>
          {t.saveForComparison}
        </button>
        <button
          onClick={onReset}
          className="w-full bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-4 rounded-md transition-all duration-300 flex items-center justify-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 11.664 0l3.181-3.183m-4.991-2.696v4.992h-4.992m0 0-3.181-3.183a8.25 8.25 0 0 1 11.664 0l3.181 3.183" />
          </svg>
          {t.newAnalysis}
        </button>
      </div>
    </div>
  );
};
