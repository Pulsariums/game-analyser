


import React, { useState, FormEvent, useEffect, useCallback, useMemo } from 'react';
import type { AnalysisResult, SavedAnalysisResult, DeviceSpecs, Translations } from './types';
import { getFpsAnalysis, getDeviceSpecs, translateUI } from './services/geminiService';
import { AnalysisDisplay } from './components/AnalysisDisplay';
import { LoadingAnalysis } from './components/LoadingAnalysis';
import { ComparisonDashboard } from './components/ComparisonDisplay';
import { MatrixResultsDisplay } from './components/MatrixResultsDisplay';
import { LanguageSelector } from './components/LanguageSelector';
import { Toast, LanguageModal } from './components/modals';
import { CpuIcon, GpuIcon, RamIcon, GameIcon, VramIcon, DeviceSearchIcon } from './components/icons';

type InputItem = { id: string; value: string };

const initialTranslations: Translations = {
  en: {
    title: "Game Performance Estimator",
    subtitle: "Get an AI-powered performance analysis for any game on your PC.",
    deviceNameLabel: "Device Name",
    deviceNamePlaceholder: "e.g., Samsung Galaxy A35, Dell XPS 15",
    fetchSpecsButton: "Fetch Specs",
    fetchingSpecsButton: "Fetching...",
    fetchSpecsError: "Could not fetch specs for this device.",
    gameTitleLabel: "Game Title",
    gameTitlePlaceholder: "e.g., Elden Ring, Valorant...",
    cpuLabel: "CPU Model",
    cpuPlaceholder: "e.g., Ryzen 5 5600X",
    gpuLabel: "GPU Model",
    gpuPlaceholder: "e.g., RTX 3070",
    ramLabel: "RAM Amount",
    ramPlaceholder: "e.g., 16GB",
    ramMhzLabel: "RAM Speed (MHz)",
    ramMhzPlaceholder: "e.g., 3200",
    virtualRamLabel: "Virtual RAM (Page File)",
    virtualRamPlaceholder: "e.g., 32GB",
    submitButton: "Estimate Performance",
    loadingButton: "Analyzing...",
    formError: "Please fill out the game name and all required hardware specs.",
    noteHeader: "Note:",
    noteText: "For security, this web app cannot automatically detect your hardware. Please enter your specs manually or use the device search above to fill them in.",
    footerText: "AI analysis powered by Google Gemini. Estimates may vary based on system health and background processes.",
    analyzerTab: "Analyzer",
    comparisonTab: "Comparison",
    matrixTab: "Matrix",
    resultSaved: "Result saved for comparison!",
    comparisonTitle: "Comparison Dashboard",
    comparisonSubtitle: "Select saved analyses to compare them side-by-side.",
    noSavedResults: "No saved results yet. Run an analysis and save it to get started.",
    tryAgain: "Try Again",
    remove: "Remove",
    device: "Device",
    game: "Game",
    performanceComparison: "Performance Comparison",
    addGame: "Add Game",
    addDevice: "Add Device",
    matrixTitle: "Matrix Analysis",
    matrixSubtitle: "Compare multiple devices across multiple games at once.",
    gamesToAnalyze: "Games to Analyze",
    devicesToAnalyze: "Devices to Analyze",
    startMatrix: "Start Matrix Analysis",
    matrixError: "Please provide at least one game and two devices.",
    newMatrixAnalysis: "New Matrix Analysis",
    addLanguageTitle: "Add New Language",
    addLanguageSubtitle: "Enter the language name (e.g., German, Spanish, Japanese).",
    addLanguagePlaceholder: "e.g., German",
    cancel: "Cancel",
    addAndTranslate: "Add & Translate",
    languageExistsError: 'Language key "{langKey}" already exists.',
    primaryBottleneck: "Primary Bottleneck",
    upgradeSuggestion: "Upgrade Suggestion",
    estimatedPowerDraw: "Estimated Power Draw",
  },
  tr: {
    title: "Oyun Performans Hesaplayıcı",
    subtitle: "PC'nizdeki herhangi bir oyun için yapay zeka destekli performans analizi alın.",
    deviceNameLabel: "Cihaz Adı",
    deviceNamePlaceholder: "Örn: Samsung Galaxy A35, Dell XPS 15",
    fetchSpecsButton: "Özellikleri Getir",
    fetchingSpecsButton: "Getiriliyor...",
    fetchSpecsError: "Bu cihaz için özellikler getirilemedi.",
    gameTitleLabel: "Oyun Adı",
    gameTitlePlaceholder: "Örn: Elden Ring, Valorant...",
    cpuLabel: "İşlemci Modeli",
    cpuPlaceholder: "Örn: Ryzen 5 5600X",
    gpuLabel: "Ekran Kartı Modeli",
    gpuPlaceholder: "Örn: RTX 3070",
    ramLabel: "RAM Miktarı",
    ramPlaceholder: "Örn: 16GB",
    ramMhzLabel: "RAM Hızı (MHz)",
    ramMhzPlaceholder: "Örn: 3200",
    virtualRamLabel: "Sanal RAM (Disk Belleği)",
    virtualRamPlaceholder: "Örn: 32GB",
    submitButton: "Performansı Hesapla",
    loadingButton: "Analiz ediliyor...",
    formError: "Lütfen oyun adını ve gerekli tüm donanım özelliklerini doldurun.",
    noteHeader: "Not:",
    noteText: "Güvenlik nedeniyle, bu web uygulaması donanımınızı otomatik olarak algılayamaz. Lütfen bilgilerinizi manuel olarak girin veya yukarıdaki cihaz arama özelliğini kullanarak doldurun.",
    footerText: "Yapay zeka analizi Google Gemini tarafından desteklenmektedir. Tahminler, sistem sağlığına ve arka plan işlemlerine göre değişiklik gösterebilir.",
    analyzerTab: "Analizör",
    comparisonTab: "Karşılaştırma",
    matrixTab: "Matris",
    resultSaved: "Sonuç karşılaştırma için kaydedildi!",
    comparisonTitle: "Karşılaştırma Paneli",
    comparisonSubtitle: "Kaydedilmiş analizleri seçerek karşılaştırın.",
    noSavedResults: "Henüz kaydedilmiş bir sonuç yok. Bir analiz yapıp kaydedin.",
    tryAgain: "Tekrar Dene",
    remove: "Kaldır",
    device: "Cihaz",
    game: "Oyun",
    performanceComparison: "Performans Karşılaştırması",
    addGame: "Oyun Ekle",
    addDevice: "Cihaz Ekle",
    matrixTitle: "Matris Analizi",
    matrixSubtitle: "Aynı anda birden fazla cihazı birden fazla oyunda karşılaştırın.",
    gamesToAnalyze: "Analiz Edilecek Oyunlar",
    devicesToAnalyze: "Analiz Edilecek Cihazlar",
    startMatrix: "Matris Analizini Başlat",
    matrixError: "Lütfen en az bir oyun ve iki cihaz girin.",
    newMatrixAnalysis: "Yeni Matris Analizi",
    addLanguageTitle: "Yeni Dil Ekle",
    addLanguageSubtitle: "Dilin adını girin (Örn: German, Spanish, Japanese).",
    addLanguagePlaceholder: "Örn: Almanca",
    cancel: "İptal",
    addAndTranslate: "Ekle ve Çevir",
    languageExistsError: '"{langKey}" dil kodu zaten mevcut.',
    primaryBottleneck: "Temel Darboğaz",
    upgradeSuggestion: "Yükseltme Önerisi",
    estimatedPowerDraw: "Tahmini Güç Tüketimi",
  }
};

// Moved outside the main component to prevent re-creation on every render, fixing the focus loss bug.
const MultiInputSection: React.FC<{
  label: string;
  items: InputItem[];
  manager: {
      onChange: (id: string, value: string) => void;
      onAdd: () => void;
      onRemove: (id: string) => void;
  };
  placeholder: string;
  addText: string;
  removeText: string;
  max?: number;
}> = ({ label, items, manager, placeholder, addText, removeText, max = 5 }) => (
  <div className="space-y-3">
      <label className="flex items-center gap-2 text-sm font-medium text-gray-300">{label}</label>
      {items.map((item, index) => (
          <div key={item.id} className="flex items-stretch gap-2">
              <input type="text" value={item.value} onChange={e => manager.onChange(item.id, e.target.value)} placeholder={`${placeholder} (${index + 1})`} className="w-full bg-gray-700/50 border border-gray-600 rounded-md p-2 text-gray-200 focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 transition" />
              {items.length > 1 && <button type="button" onClick={() => manager.onRemove(item.id)} className="flex-shrink-0 bg-red-600 hover:bg-red-700 text-white font-semibold px-3 rounded-md transition-colors text-xs">{removeText}</button>}
          </div>
      ))}
      {items.length < max && <button type="button" onClick={manager.onAdd} className="text-emerald-400 hover:text-emerald-300 text-sm font-semibold transition-colors w-full text-left pt-1">+ {addText}</button>}
  </div>
);


const App: React.FC = () => {
  const [language, setLanguage] = useState<string>('tr');
  const [allTranslations, setAllTranslations] = useState<Translations>(initialTranslations);
  const [isTranslating, setIsTranslating] = useState(false);
  const [isAddingLanguage, setIsAddingLanguage] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [view, setView] = useState<'analyzer' | 'comparison' | 'matrix'>('analyzer');
  
  // Analyzer Form state
  const [deviceName, setDeviceName] = useState('');
  const [gameName, setGameName] = useState('PUBG Mobile');
  const [cpu, setCpu] = useState('');
  const [gpu, setGpu] = useState('');
  const [ram, setRam] = useState('');
  const [ramMhz, setRamMhz] = useState('');
  const [virtualRam, setVirtualRam] = useState('');
  const [isFetchingSpecs, setIsFetchingSpecs] = useState(false);

  // Matrix Form state
  const [matrixGames, setMatrixGames] = useState<InputItem[]>([{ id: 'matrix-game-0', value: '' }]);
  const [matrixDevices, setMatrixDevices] = useState<InputItem[]>([{ id: 'matrix-device-0', value: '' }, { id: 'matrix-device-1', value: '' }]);

  // Loading/Result state
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState({ statusText: '', progress: 0 });
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [matrixResult, setMatrixResult] = useState<{results: SavedAnalysisResult[], errors: string[]} | null>(null);
  
  // Saved results state
  const [savedResults, setSavedResults] = useState<SavedAnalysisResult[]>([]);

  const t = allTranslations[language] || allTranslations.en;

  // Load data from localStorage on initial render
  useEffect(() => {
    try {
      const storedResults = localStorage.getItem('fpsEstimatorSavedResults');
      if (storedResults) setSavedResults(JSON.parse(storedResults));

      const storedTranslations = localStorage.getItem('fpsEstimatorTranslations');
      if (storedTranslations) {
        const customTranslations = JSON.parse(storedTranslations);
        setAllTranslations(prev => ({ ...prev, ...customTranslations }));
      }
    } catch (e) {
      console.error("Failed to load data from localStorage", e);
    }
  }, []);

  // Save results to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('fpsEstimatorSavedResults', JSON.stringify(savedResults));
    } catch (e) { console.error("Failed to save results to localStorage", e); }
  }, [savedResults]);

  // Save translations to localStorage
  useEffect(() => {
    try {
        const customTranslations = { ...allTranslations };
        delete customTranslations.en;
        delete customTranslations.tr;
        if (Object.keys(customTranslations).length > 0) {
            localStorage.setItem('fpsEstimatorTranslations', JSON.stringify(customTranslations));
        } else {
            localStorage.removeItem('fpsEstimatorTranslations');
        }
    } catch (e) { console.error("Failed to save custom translations", e); }
  }, [allTranslations]);


  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setResult(null);

    if (!gameName || !cpu || !gpu || !ram) {
      setError(t.formError);
      return;
    }
    
    setIsLoading(true);
    setProgress({ statusText: `Analyzing ${gameName} on your custom PC...`, progress: 25 });
    try {
      const analysisResult = await getFpsAnalysis(cpu, gpu, ram, ramMhz || 'Not specified', virtualRam || 'N/A', gameName, language);
      setProgress({ statusText: 'Finalizing report...', progress: 100 });
      setResult(analysisResult);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred.");
    }
    
    setIsLoading(false);
  };

  const handleFetchAndFillSpecs = async () => {
    if (!deviceName) return;
    setIsFetchingSpecs(true);
    setError(null);
    try {
      const specs = await getDeviceSpecs(deviceName, language);
      setCpu(specs.cpu);
      setGpu(specs.gpu);
      setRam(specs.ram);
      setRamMhz(specs.ramMhz || '');
      setVirtualRam('N/A');
    } catch (err) {
      setError(err instanceof Error ? err.message : t.fetchSpecsError);
    }
    setIsFetchingSpecs(false);
  }
  
  const handleMatrixSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const filledGames = matrixGames.map(g => g.value).filter(g => g.trim() !== '');
    const filledDevices = matrixDevices.map(d => d.value).filter(d => d.trim() !== '');

    if (filledGames.length === 0 || filledDevices.length < 2) {
        setError(t.matrixError);
        return;
    }
    
    setIsLoading(true);
    setError(null);
    setMatrixResult(null);

    const totalAnalyses = filledGames.length * filledDevices.length;
    let completedAnalyses = 0;
    const results: SavedAnalysisResult[] = [];
    const errors: string[] = [];

    for (const device of filledDevices) {
        let specs: DeviceSpecs;
        try {
            setProgress({ statusText: `Fetching specs for ${device}...`, progress: (completedAnalyses / totalAnalyses) * 100 });
            specs = await getDeviceSpecs(device, language);
        } catch (err) {
            const errorMsg = `Could not get specs for "${device}", skipping all its analyses.`;
            console.error(errorMsg, err);
            errors.push(errorMsg);
            completedAnalyses += filledGames.length; 
            continue;
        }

        for (const game of filledGames) {
            completedAnalyses++;
            try {
                setProgress({ 
                    statusText: `Analyzing (${completedAnalyses}/${totalAnalyses}): ${game} on ${device}`, 
                    progress: ((completedAnalyses-1) / totalAnalyses) * 100 
                });
                const analysis = await getFpsAnalysis(specs.cpu, specs.gpu, specs.ram, specs.ramMhz || 'N/A', 'N/A', game, language);
                results.push({
                    ...analysis,
                    id: `${new Date().toISOString()}-${device}-${game}`,
                    gameName: game,
                    deviceSpecs: { ...specs, cpu: device }, // Use original device name for clarity
                    savedAt: new Date().toISOString()
                });
            } catch (err) {
                const errorMsg = `Failed to analyze "${game}" on "${device}".`;
                console.error(errorMsg, err);
                errors.push(errorMsg);
            }
        }
    }

    setMatrixResult({results, errors});
    setIsLoading(false);
  };

  const handleReset = (viewToReset: 'analyzer' | 'matrix' = 'analyzer') => {
    setIsLoading(false);
    setError(null);
    setProgress({ statusText: '', progress: 0 });

    if (viewToReset === 'analyzer' || result || error) {
      setResult(null);
      // Persist form values for the next analysis as requested by the user.
      // The device name, game name, and hardware specs will not be cleared.
    }
    if (viewToReset === 'matrix' || matrixResult) {
        setMatrixResult(null);
        setMatrixGames([{ id: 'matrix-game-0', value: '' }]);
        setMatrixDevices([{ id: 'matrix-device-0', value: '' }, { id: 'matrix-device-1', value: '' }]);
    }
  };
  
  const handleSave = () => {
    if (!result) return;
    const newSave: SavedAnalysisResult = {
      ...result,
      id: new Date().toISOString() + Math.random(),
      gameName,
      deviceSpecs: { cpu: deviceName || cpu, gpu, ram, ramMhz },
      savedAt: new Date().toISOString(),
    };
    setSavedResults(prev => [newSave, ...prev]);
    setToastMessage(t.resultSaved);
    setView('comparison');
  };

  const handleDeleteSaved = (id: string) => {
    setSavedResults(prev => prev.filter(r => r.id !== id));
  };
  
  const handleConfirmAddLanguage = useCallback(async (langName: string) => {
    setIsAddingLanguage(false);

    const trimmedName = langName.trim().toLowerCase();
    const langKey = trimmedName.length <= 2 ? trimmedName : trimmedName.slice(0, 2);

    if (allTranslations[langKey]) {
      setError(t.languageExistsError.replace('{langKey}', langKey.toUpperCase()));
      return;
    }

    setIsTranslating(true);
    setError(null);
    try {
      const translatedStrings = await translateUI(allTranslations.en, langName);
      setAllTranslations(prev => ({ ...prev, [langKey]: translatedStrings }));
      setLanguage(langKey);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Translation failed');
    } finally {
      setIsTranslating(false);
    }
  }, [allTranslations, t.languageExistsError]);
  
  // Create stable state updaters for matrix games
  const handleMatrixGameChange = useCallback((id: string, value: string) => {
    setMatrixGames(prev => prev.map(item => (item.id === id ? { ...item, value } : item)));
  }, []);
  const handleAddMatrixGame = useCallback(() => {
    setMatrixGames(prev => [...prev, { id: `item-${Date.now()}-${Math.random()}`, value: '' }]);
  }, []);
  const handleRemoveMatrixGame = useCallback((id: string) => {
    setMatrixGames(prev => prev.filter(item => item.id !== id));
  }, []);
  
  const matrixGameManager = useMemo(() => ({
    onChange: handleMatrixGameChange,
    onAdd: handleAddMatrixGame,
    onRemove: handleRemoveMatrixGame
  }), [handleMatrixGameChange, handleAddMatrixGame, handleRemoveMatrixGame]);

  // Create stable state updaters for matrix devices
  const handleMatrixDeviceChange = useCallback((id: string, value: string) => {
    setMatrixDevices(prev => prev.map(item => (item.id === id ? { ...item, value } : item)));
  }, []);
  const handleAddMatrixDevice = useCallback(() => {
    setMatrixDevices(prev => [...prev, { id: `item-${Date.now()}-${Math.random()}`, value: '' }]);
  }, []);
  const handleRemoveMatrixDevice = useCallback((id: string) => {
    setMatrixDevices(prev => prev.filter(item => item.id !== id));
  }, []);

  const matrixDeviceManager = useMemo(() => ({
      onChange: handleMatrixDeviceChange,
      onAdd: handleAddMatrixDevice,
      onRemove: handleRemoveMatrixDevice
  }), [handleMatrixDeviceChange, handleAddMatrixDevice, handleRemoveMatrixDevice]);

  const renderAnalyzerView = () => {
    return (
      <div className="w-full max-w-xl">
          <form onSubmit={handleSubmit} className="space-y-6 bg-gray-900/50 p-6 rounded-xl border border-gray-700 animate-fade-in">
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2"><GameIcon className="w-5 h-5" /> {t.gameTitleLabel}</label>
              <input type="text" value={gameName} onChange={e => setGameName(e.target.value)} placeholder={t.gameTitlePlaceholder} className="w-full bg-gray-700/50 border border-gray-600 rounded-md p-2 text-gray-200 focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 transition" required />
            </div>
            
            <div className="p-4 bg-gray-800/50 rounded-lg border border-gray-700/50 space-y-3">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-300"><DeviceSearchIcon className="w-5 h-5" /> {t.deviceNameLabel}</label>
              <div className="flex flex-col sm:flex-row gap-2">
                <input type="text" value={deviceName} onChange={e => setDeviceName(e.target.value)} placeholder={t.deviceNamePlaceholder} className="w-full bg-gray-700/50 border border-gray-600 rounded-md p-2 text-gray-200 focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 transition" />
                <button type="button" onClick={handleFetchAndFillSpecs} disabled={isFetchingSpecs || !deviceName} className="flex-shrink-0 bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                    {isFetchingSpecs ? t.fetchingSpecsButton : t.fetchSpecsButton}
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <hr className="flex-grow border-gray-700" />
              <span className="text-gray-500 text-xs font-semibold">OR</span>
              <hr className="flex-grow border-gray-700" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2"><CpuIcon className="w-5 h-5" /> {t.cpuLabel}</label>
                <input type="text" value={cpu} onChange={e => setCpu(e.target.value)} placeholder={t.cpuPlaceholder} className="w-full bg-gray-700/50 border border-gray-600 rounded-md p-2 text-gray-200 focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 transition" required />
              </div>
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2"><GpuIcon className="w-5 h-5" /> {t.gpuLabel}</label>
                <input type="text" value={gpu} onChange={e => setGpu(e.target.value)} placeholder={t.gpuPlaceholder} className="w-full bg-gray-700/50 border border-gray-600 rounded-md p-2 text-gray-200 focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 transition" required />
              </div>
              <div className="md:col-span-2 grid grid-cols-2 gap-4">
                 <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2"><RamIcon className="w-5 h-5" /> {t.ramLabel}</label>
                    <input type="text" value={ram} onChange={e => setRam(e.target.value)} placeholder={t.ramPlaceholder} className="w-full bg-gray-700/50 border border-gray-600 rounded-md p-2 text-gray-200 focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 transition" required />
                 </div>
                 <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2"><RamIcon className="w-5 h-5 opacity-70" /> {t.ramMhzLabel}</label>
                    <input type="text" value={ramMhz} onChange={e => setRamMhz(e.target.value)} placeholder={t.ramMhzPlaceholder} className="w-full bg-gray-700/50 border border-gray-600 rounded-md p-2 text-gray-200 focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 transition" />
                 </div>
              </div>
              <div className="md:col-span-2">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2"><VramIcon className="w-5 h-5" /> {t.virtualRamLabel}</label>
                <input type="text" value={virtualRam} onChange={e => setVirtualRam(e.target.value)} placeholder={t.virtualRamPlaceholder} className="w-full bg-gray-700/50 border border-gray-600 rounded-md p-2 text-gray-200 focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 transition" />
              </div>
            </div>

            {error && <p className="text-center text-sm text-red-400 bg-red-900/30 p-3 rounded-md">{error}</p>}

            <button type="submit" disabled={isLoading} className="w-full bg-gradient-to-r from-emerald-500 to-green-600 text-white font-bold py-3 px-4 rounded-md hover:from-emerald-600 hover:to-green-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center">
              {isLoading ? t.loadingButton : t.submitButton}
            </button>
          </form>
          <div className="text-center text-xs text-gray-500 px-4 mt-4 max-w-xl"><p><strong>{t.noteHeader}</strong> {t.noteText}</p></div>
      </div>
    );
  };
  
  const renderMatrixView = () => {
    if (isLoading) {
        return <LoadingAnalysis language={language as 'en' | 'tr'} statusText={progress.statusText} progress={progress.progress} />;
    }
    if (error && !matrixResult) {
        return (
            <div className="text-center p-4 bg-red-900/50 text-red-300 rounded-lg animate-fade-in flex flex-col items-center gap-4 w-full max-w-xl">
            <p>{error}</p>
            <button onClick={() => { setError(null); }} className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-md transition-colors">{t.tryAgain}</button>
            </div>
        );
    }
    if (matrixResult) {
        return <MatrixResultsDisplay results={matrixResult.results} errors={matrixResult.errors} t={t} onReset={() => handleReset('matrix')} />;
    }
    return (
        <div className="w-full max-w-xl">
            <div className="text-center mb-6">
                <h2 className="text-3xl font-bold text-gray-100">{t.matrixTitle}</h2>
                <p className="text-gray-400 mt-1">{t.matrixSubtitle}</p>
            </div>
            <form onSubmit={handleMatrixSubmit} className="space-y-6 bg-gray-900/50 p-6 rounded-xl border border-gray-700 animate-fade-in">
                <div className="p-4 bg-gray-800/50 rounded-lg border border-gray-700/50">
                    <MultiInputSection
                        label={t.gamesToAnalyze}
                        items={matrixGames}
                        manager={matrixGameManager}
                        placeholder={t.gameTitlePlaceholder}
                        addText={t.addGame}
                        removeText={t.remove}
                    />
                </div>
                <div className="p-4 bg-gray-800/50 rounded-lg border border-gray-700/50">
                    <MultiInputSection
                        label={t.devicesToAnalyze}
                        items={matrixDevices}
                        manager={matrixDeviceManager}
                        placeholder={t.deviceNamePlaceholder}
                        addText={t.addDevice}
                        removeText={t.remove}
                    />
                </div>
                 {error && <p className="text-center text-sm text-red-400 bg-red-900/30 p-3 rounded-md">{error}</p>}
                <button type="submit" disabled={isLoading} className="w-full bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-bold py-3 px-4 rounded-md hover:from-purple-600 hover:to-indigo-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center">
                   {t.startMatrix}
                </button>
            </form>
        </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-800 bg-grid-gray-700/[0.2] flex flex-col items-center p-4 sm:p-6 md:p-8 relative">
      <style>{`.bg-grid-gray-700\\[\\[0\\.2\\]\\] { background-image: linear-gradient(to right, rgba(55, 65, 81, 0.2) 1px, transparent 1px), linear-gradient(to bottom, rgba(55, 65, 81, 0.2) 1px, transparent 1px); background-size: 30px 30px; } @keyframes fade-in { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } } .animate-fade-in { animation: fade-in 0.5s ease-out forwards; }`}</style>
      
      <LanguageSelector 
        allTranslations={allTranslations} 
        currentLanguage={language}
        isTranslating={isTranslating}
        onSelectLanguage={setLanguage}
        onAddNewLanguage={() => setIsAddingLanguage(true)}
      />

      {isAddingLanguage && (
          <LanguageModal 
            t={t} 
            onClose={() => setIsAddingLanguage(false)} 
            onConfirm={handleConfirmAddLanguage}
          />
      )}

      <Toast message={toastMessage} onClose={() => setToastMessage(null)} />

      <header className="w-full max-w-4xl mx-auto text-center mt-12 sm:mt-4">
        <h1 className="text-4xl sm:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 to-green-500">{t.title}</h1>
        <p className="mt-2 text-lg text-gray-400">{t.subtitle}</p>
      </header>

      <div className="w-full max-w-4xl mx-auto flex justify-center my-6">
        <div className="bg-gray-900/50 p-1 rounded-lg border border-gray-700 flex items-center gap-1">
          <button onClick={() => setView('analyzer')} className={`px-4 py-2 text-sm font-semibold rounded-md transition-colors ${view === 'analyzer' ? 'bg-emerald-500 text-white' : 'text-gray-300 hover:bg-gray-700'}`}>{t.analyzerTab}</button>
          <button onClick={() => setView('comparison')} className={`px-4 py-2 text-sm font-semibold rounded-md transition-colors relative ${view === 'comparison' ? 'bg-emerald-500 text-white' : 'text-gray-300 hover:bg-gray-700'}`}>
            {t.comparisonTab}
            {savedResults.length > 0 && (<span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">{savedResults.length}</span>)}
          </button>
          <button onClick={() => setView('matrix')} className={`px-4 py-2 text-sm font-semibold rounded-md transition-colors ${view === 'matrix' ? 'bg-emerald-500 text-white' : 'text-gray-300 hover:bg-gray-700'}`}>{t.matrixTab}</button>
        </div>
      </div>
      
      <main className="flex-grow w-full max-w-4xl mx-auto flex flex-col items-center justify-center">
        {view === 'analyzer' && (
          isLoading ? <LoadingAnalysis language={language as 'en' | 'tr'} statusText={progress.statusText} progress={progress.progress} /> :
          result ? <AnalysisDisplay result={result} language={language} onReset={() => handleReset('analyzer')} onSave={handleSave} /> :
          renderAnalyzerView()
        )}
        {view === 'comparison' && <ComparisonDashboard savedResults={savedResults} onDelete={handleDeleteSaved} t={t} />}
        {view === 'matrix' && renderMatrixView()}
      </main>
      
      <footer className="w-full max-w-4xl mx-auto pt-8 text-center text-gray-500 text-sm">
        <p>{t.footerText}</p>
      </footer>
    </div>
  );
};

export default App;