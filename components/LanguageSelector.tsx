
import React from 'react';
import type { Translations } from '../types';

export const LanguageSelector: React.FC<{
    allTranslations: Translations;
    currentLanguage: string;
    isTranslating: boolean;
    onSelectLanguage: (langCode: string) => void;
    onAddNewLanguage: () => void;
}> = ({ allTranslations, currentLanguage, isTranslating, onSelectLanguage, onAddNewLanguage }) => (
    <div className="absolute top-4 right-4 bg-gray-900/50 border border-gray-700 rounded-lg p-1 flex gap-1 z-10">
        {Object.keys(allTranslations).map(langCode => (
            <button 
              key={langCode} 
              onClick={() => onSelectLanguage(langCode)} 
              className={`px-3 py-1 text-sm font-semibold rounded-md transition-colors ${currentLanguage === langCode ? 'bg-emerald-500 text-white' : 'text-gray-400 hover:bg-gray-700/50'}`}
            >
              {langCode.toUpperCase()}
            </button>
        ))}
        <button 
          onClick={onAddNewLanguage} 
          disabled={isTranslating} 
          title="Add new language" 
          className="px-2 py-1 text-sm rounded-md transition-colors text-gray-400 hover:bg-gray-700/50 disabled:opacity-50 disabled:cursor-wait flex items-center justify-center w-8"
        >
            {isTranslating ? (
                <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
            ) : (
                '+'
            )}
        </button>
    </div>
);
