import React, { useState } from 'react';
import { Search, Menu, X, ChevronDown } from 'lucide-react';

interface NavigationBarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  isLoggedIn?: boolean;
  onLogout?: () => void;
}

const NavigationBar: React.FC<NavigationBarProps> = ({ activeTab, onTabChange, isLoggedIn }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <nav className="bg-[#0A1E42] text-white sticky top-0 z-40 shadow-md">
      <div className="px-4 md:px-12 flex items-center justify-between">
        
        {/* Desktop Links */}
        <div className="hidden md:flex items-center">
          <button 
            onClick={() => onTabChange('about')}
            className={`py-4 px-6 font-medium tracking-wide transition-colors border-b-4 flex items-center gap-1 ${activeTab === 'about' ? 'border-natpac-accent bg-white/10' : 'border-transparent hover:bg-white/10 hover:border-natpac-accent'}`}
          >
            Home
          </button>

          {/* Example of a dropdown menu item as requested */}
          <div className="relative group">
            <button className="py-4 px-6 font-medium tracking-wide transition-colors border-b-4 border-transparent hover:bg-white/10 hover:border-natpac-accent flex items-center gap-1">
              Divisions <ChevronDown className="w-4 h-4 opacity-70" />
            </button>
            <div className="absolute top-full left-0 w-64 bg-white shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 border-t-2 border-natpac-accent text-gray-800">
              <button onClick={() => onTabChange('division-highway')} className="block w-full text-left px-6 py-3 border-b border-gray-100 hover:bg-natpac-lightBg hover:text-[#0A1E42] transition-colors text-sm font-medium">Highway Engineering</button>
              <button onClick={() => onTabChange('division-traffic')} className="block w-full text-left px-6 py-3 border-b border-gray-100 hover:bg-natpac-lightBg hover:text-[#0A1E42] transition-colors text-sm font-medium">Traffic & Transportation</button>
              <button onClick={() => onTabChange('division-water')} className="block w-full text-left px-6 py-3 hover:bg-natpac-lightBg hover:text-[#0A1E42] transition-colors text-sm font-medium">Water Transport</button>
            </div>
          </div>

          {/* Data Repository is ONLY visible when user is logged in */}
          {isLoggedIn && (
            <button 
              onClick={() => onTabChange('data')}
              className={`py-4 px-6 font-medium tracking-wide transition-colors border-b-4 flex items-center gap-1 ${activeTab === 'data' ? 'border-natpac-accent bg-white/10' : 'border-transparent hover:bg-white/10 hover:border-natpac-accent'}`}
            >
              Data Repository
            </button>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button 
          className="md:hidden p-4 hover:bg-white/10 transition-colors"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>

        {/* Right Search Input - moved to far right */}
        <div className="py-2 hidden md:flex items-center ml-auto">
          <div className="relative w-full max-w-sm flex items-center">
            <input 
              type="text" 
              placeholder="Search portal..." 
              className="bg-white/10 text-white placeholder-white/70 px-4 py-2 pr-10 rounded-full border border-white/30 focus:outline-none focus:ring-2 focus:ring-natpac-accent focus:bg-white focus:text-natpac-primary focus:placeholder-gray-500 w-full text-sm transition-all w-64"
            />
            <button className="absolute right-3 top-1/2 -translate-y-1/2 text-white hover:text-natpac-accent transition-colors">
              <Search className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-natpac-primary shadow-xl flex flex-col z-50">
          <button 
            onClick={() => { onTabChange('about'); setIsMobileMenuOpen(false); }}
            className={`py-4 text-left px-6 border-l-4 ${activeTab === 'about' ? 'border-natpac-accent bg-white/5' : 'border-transparent hover:bg-white/5'}`}
          >
            Home
          </button>

          {isLoggedIn && (
            <button 
              onClick={() => { onTabChange('data'); setIsMobileMenuOpen(false); }}
              className={`py-4 text-left px-6 border-l-4 ${activeTab === 'data' ? 'border-natpac-accent bg-white/5' : 'border-transparent hover:bg-white/5'}`}
            >
              Data Repository
            </button>
          )}
          
          <div className="p-4 sm:hidden bg-black/20">
             <div className="relative w-full">
              <input 
                type="text" 
                placeholder="Search portal..." 
                className="bg-white text-gray-900 px-4 py-3 pr-10 rounded-md focus:outline-none focus:ring-2 focus:ring-natpac-accent w-full text-sm"
              />
              <button className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-natpac-primary">
                <Search className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default NavigationBar;
