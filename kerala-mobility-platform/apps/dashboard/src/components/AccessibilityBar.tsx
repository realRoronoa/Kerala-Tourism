import React, { useState, useRef, useEffect } from 'react';
import { Lock, Globe, ChevronDown } from 'lucide-react';

interface AccessibilityBarProps {
  onAdminLoginClick?: () => void;
  isLoggedIn?: boolean;
  onLogout?: () => void;
}

const LANGUAGES = [
  { code: 'en', label: 'English' },
  { code: 'ml', label: 'മലയാളം' },
  { code: 'hi', label: 'हिन्दी' },
];

const AccessibilityBar: React.FC<AccessibilityBarProps> = ({ onAdminLoginClick, isLoggedIn, onLogout }) => {
  const getInitialLang = () => {
    // Check if a Google Translate cookie already exists on page load
    const match = document.cookie.match(new RegExp('(^| )googtrans=([^;]+)'));
    if (match) {
      // cookie format is usually '/en/ml' or '/en/hi'
      const parts = match[2].split('/');
      const code = parts[parts.length - 1];
      const found = LANGUAGES.find(l => l.code === code);
      if (found) return found;
    }
    return LANGUAGES[0];
  };

  const [selectedLang, setSelectedLang] = useState(getInitialLang());
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="bg-[#06142E] text-xs text-white py-1.5 px-4 flex flex-wrap justify-between items-center gap-3 shadow-md relative z-50">
      {/* Left: Small Badge / Admin Link */}
      <div className="flex items-center shrink-0">
        {!isLoggedIn ? (
          <button onClick={onAdminLoginClick} className="flex items-center gap-1.5 hover:text-natpac-accent transition-colors">
            <Lock className="w-3.5 h-3.5" />
            <span className="uppercase tracking-wider font-medium hidden sm:inline">Admin Login</span>
          </button>
        ) : (
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
            <span className="font-semibold text-white hidden sm:inline">Officer Active</span>
            <button onClick={onLogout} className="sm:ml-1.5 hover:text-red-400 transition-colors uppercase tracking-wider font-semibold">Logout</button>
          </div>
        )}
      </div>

      {/* Center section removed as requested */}

      {/* Right: Social & Language */}
      <div className="flex items-center gap-4 shrink-0">
        <div className="hidden sm:flex items-center gap-2">
          <a href="#" className="w-6 h-6 rounded-full bg-white flex items-center justify-center text-[#06142E] hover:bg-natpac-accent hover:text-white transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
          </a>
          <a href="#" className="w-6 h-6 rounded-full bg-white flex items-center justify-center text-[#06142E] hover:bg-natpac-accent hover:text-white transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg>
          </a>
          <a href="#" className="w-6 h-6 rounded-full bg-white flex items-center justify-center text-[#06142E] hover:bg-natpac-accent hover:text-white transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33 2.78 2.78 0 0 0 1.94 2c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.33 29 29 0 0 0-.46-5.33z"/><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"/></svg>
          </a>
        </div>
        {/* Hidden Google Translate Element */}
        <div id="google_translate_element" className="hidden"></div>

        {/* Custom Language Toggle Pill */}
        <div className="relative notranslate" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen((prev) => !prev)}
            className="flex items-center gap-1.5 px-3 py-1 bg-white/10 hover:bg-white/20 rounded-full border border-white/20 font-medium tracking-wider transition-colors"
          >
            <Globe className="w-3.5 h-3.5" />
            <span>{selectedLang.label}</span>
            <ChevronDown className={`w-3 h-3 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
          </button>
          
          {dropdownOpen && (
            <div className="absolute right-0 top-full mt-2 bg-white rounded-md border border-gray-200 shadow-xl z-50 min-w-[120px] overflow-hidden">
              {LANGUAGES.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => { 
                    setSelectedLang(lang); 
                    setDropdownOpen(false);
                    
                    // Trigger Google Translate hidden select
                    const selectEl = document.querySelector('.goog-te-combo') as HTMLSelectElement;
                    if (selectEl) {
                      selectEl.value = lang.code;
                      selectEl.dispatchEvent(new Event('change'));
                    } else {
                      // If widget isn't loaded yet, try to set cookie and reload (fallback)
                      document.cookie = `googtrans=/en/${lang.code}; path=/;`;
                      window.location.reload();
                    }
                  }}
                  className={`w-full text-left px-4 py-2 hover:bg-gray-100 transition-colors flex items-center justify-between gap-2 ${
                    selectedLang.code === lang.code ? 'bg-natpac-lightBg text-[#06142E] font-semibold' : 'text-gray-700'
                  }`}
                >
                  {lang.label}
                  {selectedLang.code === lang.code && <span className="text-[10px] text-[#06142E]">✓</span>}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AccessibilityBar;
