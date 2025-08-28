import React from 'react';

const loadingTranslations = {
  en: {
    title: "Analyzing...",
  },
  tr: {
    title: "Analiz Ediliyor...",
  }
};

export const LoadingAnalysis: React.FC<{
  language: 'en' | 'tr';
  statusText: string;
  progress: number;
}> = ({ language, statusText, progress }) => {
  const t = loadingTranslations[language];

  return (
    <div className="w-full p-6 bg-gray-900/50 rounded-xl border border-gray-700 animate-fade-in text-center">
      <h2 className="text-2xl font-bold text-emerald-300 mb-4">{t.title}</h2>
      <div className="w-full bg-gray-700 rounded-full h-2.5 mb-4">
        <div 
          className="bg-emerald-500 h-2.5 rounded-full transition-all duration-500 ease-out" 
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      <div className="min-h-[48px] flex items-center justify-center">
        <p className="text-gray-300">
          {statusText}
        </p>
      </div>
    </div>
  );
};