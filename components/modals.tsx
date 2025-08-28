import React, { useState, useEffect } from 'react';

export const Toast: React.FC<{ message: string | null; onClose: () => void }> = ({ message, onClose }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (message) {
      setVisible(true);
      const timer = setTimeout(() => {
        setVisible(false);
        // Allow fade-out animation before calling onClose
        setTimeout(onClose, 300);
      }, 3000);
      return () => clearTimeout(timer);
    } else {
      setVisible(false);
    }
  }, [message, onClose]);

  if (!message && !visible) return null;

  return (
    <div className={`fixed bottom-8 left-1/2 -translate-x-1/2 bg-emerald-500 text-white font-semibold py-2 px-5 rounded-lg shadow-lg z-50 transition-all duration-300 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
      {message}
    </div>
  );
};


export const LanguageModal: React.FC<{
    t: any;
    onClose: () => void;
    onConfirm: (langName: string) => void;
}> = ({ t, onClose, onConfirm }) => {
    const [langName, setLangName] = useState('');

    // Handle Escape key to close modal
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                onClose();
            }
        };
        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [onClose]);
    
    const handleConfirm = () => {
        if(langName.trim()) {
            onConfirm(langName.trim());
        }
    };

    return (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 animate-fade-in" onClick={onClose}>
            <div className="bg-gray-800 rounded-lg p-6 w-full max-w-sm border border-gray-600 space-y-4" onClick={e => e.stopPropagation()}>
                <h3 className="text-lg font-semibold text-gray-100">{t.addLanguageTitle || 'Add New Language'}</h3>
                <p className="text-sm text-gray-400">{t.addLanguageSubtitle || 'Enter the language name (e.g., German, Spanish, Japanese).'}</p>
                <input 
                    type="text" 
                    value={langName}
                    onChange={e => setLangName(e.target.value)}
                    className="w-full bg-gray-700/50 border border-gray-600 rounded-md p-2 text-gray-200 focus:ring-2 focus:ring-emerald-400"
                    autoFocus
                    onKeyDown={e => e.key === 'Enter' && handleConfirm()}
                    placeholder={t.addLanguagePlaceholder || 'e.g., German'}
                />
                <div className="flex justify-end gap-3 pt-2">
                    <button onClick={onClose} className="px-4 py-2 text-sm font-semibold rounded-md text-gray-300 hover:bg-gray-700 transition-colors">
                        {t.cancel || 'Cancel'}
                    </button>
                    <button onClick={handleConfirm} className="px-4 py-2 text-sm font-semibold rounded-md bg-emerald-500 text-white hover:bg-emerald-600 transition-colors">
                        {t.addAndTranslate || 'Add & Translate'}
                    </button>
                </div>
            </div>
        </div>
    );
};
