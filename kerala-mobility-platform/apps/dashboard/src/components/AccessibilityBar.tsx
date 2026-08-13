import React, { useState, useRef, useEffect } from 'react';
import { Lock, Globe, ChevronDown } from 'lucide-react';

interface AccessibilityBarProps {
  onAdminLoginClick?: () => void;
  isLoggedIn?: boolean;
  onLogout?: () => void;
}

const LANGUAGES = [
  { code: 'en', label: 'English' },
  { code: 'ml', label: 'മലയാളം' },       // Malayalam
  { code: 'hi', label: 'हिन्दी' },        // Hindi
  { code: 'ta', label: 'தமிழ்' },         // Tamil
  { code: 'kn', label: 'ಕನ್ನಡ' },         // Kannada
  { code: 'te', label: 'తెలుగు' },        // Telugu
];

const AccessibilityBar: React.FC<AccessibilityBarProps> = ({ onAdminLoginClick, isLoggedIn, onLogout }) => {
  const [selectedLang, setSelectedLang] = useState(LANGUAGES[0]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
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
    <div className="bg-gray-200 text-sm text-gray-800 py-1 px-4 flex justify-end items-center gap-4 border-b border-gray-300">

      {/* Language Selector */}
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setDropdownOpen((prev) => !prev)}
          className="flex items-center gap-1.5 px-3 py-0.5 bg-white border border-gray-300 hover:bg-gray-100 text-gray-800 text-xs font-medium uppercase tracking-wider transition-colors"
          aria-haspopup="listbox"
          aria-expanded={dropdownOpen}
        >
          <Globe className="w-3.5 h-3.5 text-gov-blue-primary" />
          <span>{selectedLang.label}</span>
          <ChevronDown className={`w-3 h-3 text-gray-500 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
        </button>

        {dropdownOpen && (
          <div className="absolute right-0 top-full mt-1 bg-white border border-gray-300 shadow-lg z-50 min-w-[150px]">
            {LANGUAGES.map((lang) => (
              <button
                key={lang.code}
                onClick={() => { setSelectedLang(lang); setDropdownOpen(false); }}
                className={`w-full text-left px-4 py-2 text-xs hover:bg-gray-100 transition-colors flex items-center justify-between gap-2 ${
                  selectedLang.code === lang.code ? 'bg-gov-blue-primary text-white font-semibold' : 'text-gray-800'
                }`}
              >
                {lang.label}
                {selectedLang.code === lang.code && <span className="text-[10px] opacity-70">✓</span>}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Admin Section in Corner */}
      <div className="w-px h-4 bg-gray-400"></div>
      {!isLoggedIn ? (
        <button
          onClick={onAdminLoginClick}
          className="flex items-center gap-1.5 px-3 py-0.5 bg-gov-blue-primary hover:bg-gov-blue-secondary text-white border border-gov-blue-primary text-xs font-semibold uppercase tracking-wider transition-colors shadow-sm"
        >
          <Lock className="w-3.5 h-3.5 text-amber-300" />
          <span>Admin Login</span>
        </button>
      ) : (
        <div className="flex items-center gap-2 bg-gov-blue-secondary px-2.5 py-0.5 border border-white/20 text-xs">
          <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
          <span className="font-semibold text-white">Officer Active</span>
          <button
            onClick={onLogout}
            className="ml-1.5 px-2 py-0.5 bg-red-700 hover:bg-red-800 text-white rounded text-[10px] font-semibold uppercase tracking-wider transition-colors"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
};

export default AccessibilityBar;
