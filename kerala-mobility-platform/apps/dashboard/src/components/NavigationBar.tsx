import React from 'react';
import { Search, Menu, Lock } from 'lucide-react';

interface NavigationBarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  isLoggedIn?: boolean;
  onLogout?: () => void;
}

const NavigationBar: React.FC<NavigationBarProps> = ({ activeTab, onTabChange, isLoggedIn, onLogout }) => {
  return (
    <nav className="bg-gov-blue-primary text-white">
      <div className="px-8 md:px-12 flex items-center justify-between">
        
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
        <button className="md:hidden p-4 hover:bg-gov-blue-secondary">
          <Menu className="w-6 h-6" />
        </button>

        {/* Right Search Input */}
        <div className="py-3 hidden sm:flex items-center gap-4">
          <div className="relative">
            <input 
              type="text" 
              placeholder="Search portal..." 
              className="bg-white text-gray-900 px-4 py-2 pr-10 rounded-sm border border-gray-300 focus:outline-none focus:ring-2 focus:ring-accent-orange w-56 text-sm"
            />
            <button className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gov-blue-primary">
              <Search className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavigationBar;
