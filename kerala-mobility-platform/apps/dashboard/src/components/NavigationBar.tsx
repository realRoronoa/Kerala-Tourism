import React, { useState } from 'react';
import { Search, Menu, X } from 'lucide-react';

interface NavigationBarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  isLoggedIn?: boolean;
  onLogout?: () => void;
}

const NavigationBar: React.FC<NavigationBarProps> = ({ activeTab, onTabChange, isLoggedIn, onLogout }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <nav className="bg-gov-blue-primary text-white relative">
      <div className="px-4 md:px-12 flex items-center justify-between">
        
        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8">
          <button 
            onClick={() => onTabChange('about')}
            className={`py-4 font-medium px-4 transition-colors border-b-4 ${activeTab === 'about' ? 'border-accent-orange' : 'border-transparent hover:bg-gov-blue-secondary hover:border-accent-orange'}`}
          >
            About NATPAC
          </button>

          {/* Data Repository is ONLY visible when user is logged in */}
          {isLoggedIn && (
            <button 
              onClick={() => onTabChange('data')}
              className={`py-4 font-medium px-4 transition-colors border-b-4 ${activeTab === 'data' ? 'border-accent-orange' : 'border-transparent hover:bg-gov-blue-secondary hover:border-accent-orange'}`}
            >
              Data Repository
            </button>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button 
          className="md:hidden p-4 hover:bg-gov-blue-secondary"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>

        {/* Right Search Input */}
        <div className="py-3 hidden sm:flex items-center gap-4">
          <div className="relative w-full max-w-xs">
            <input 
              type="text" 
              placeholder="Search portal..." 
              className="bg-white text-gray-900 px-4 py-2 pr-10 rounded-sm border border-gray-300 focus:outline-none focus:ring-2 focus:ring-accent-orange w-full text-sm"
            />
            <button className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gov-blue-primary">
              <Search className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-gov-blue-primary border-t border-blue-800 flex flex-col z-50">
          <button 
            onClick={() => { onTabChange('about'); setIsMobileMenuOpen(false); }}
            className={`py-4 text-left px-6 border-l-4 ${activeTab === 'about' ? 'border-accent-orange bg-gov-blue-secondary' : 'border-transparent hover:bg-gov-blue-secondary'}`}
          >
            About NATPAC
          </button>

          {isLoggedIn && (
            <button 
              onClick={() => { onTabChange('data'); setIsMobileMenuOpen(false); }}
              className={`py-4 text-left px-6 border-l-4 ${activeTab === 'data' ? 'border-accent-orange bg-gov-blue-secondary' : 'border-transparent hover:bg-gov-blue-secondary'}`}
            >
              Data Repository
            </button>
          )}
          
          <div className="p-4 sm:hidden border-t border-blue-800">
             <div className="relative w-full">
              <input 
                type="text" 
                placeholder="Search portal..." 
                className="bg-white text-gray-900 px-4 py-2 pr-10 rounded-sm border border-gray-300 focus:outline-none focus:ring-2 focus:ring-accent-orange w-full text-sm"
              />
              <button className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gov-blue-primary">
                <Search className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default NavigationBar;
