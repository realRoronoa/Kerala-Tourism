import React, { useState, useEffect } from 'react';

import AccessibilityBar from './components/AccessibilityBar';
import LogoHeader from './components/LogoHeader';
import NavigationBar from './components/NavigationBar';
import DashboardTitleBar from './components/DashboardTitleBar';

import HeroStatsBanner from './components/HeroStatsBanner';
import HeroCarousel from './components/HeroCarousel';
import MobilityHeatmapPanel from './components/MobilityHeatmapPanel';
import OriginDestinationPanel from './components/OriginDestinationPanel';
import ModeSharePanel from './components/ModeSharePanel';
import ZoneStatisticsTable from './components/ZoneStatisticsTable';
import QuickAccessDownloads from './components/QuickAccessDownloads';
import Footer from './components/Footer';
import AboutNatpac from './components/AboutNatpac';
import DivisionPage from './components/DivisionPage';
import FloatingActions from './components/FloatingActions';
import AdminAuthPage from './components/AdminAuthPage';

const App: React.FC = () => {
  const getInitialTab = () => {
    const hash = window.location.hash.replace('#', '');
    return hash || 'about';
  };

  const [activeTab, setActiveTab] = useState<string>(getInitialTab());
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      setActiveTab(hash || 'about');
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleTabChange = (tab: string) => {
    window.location.hash = tab;
    setActiveTab(tab);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    handleTabChange('about');
  };

  return (
    <div className="min-h-screen flex flex-col font-sans bg-[#f8fafc] text-gray-900 overflow-x-hidden">

      <AccessibilityBar 
        onAdminLoginClick={() => handleTabChange('login')}
        isLoggedIn={isLoggedIn}
        onLogout={handleLogout}
      />
      <LogoHeader />
      <NavigationBar 
        activeTab={activeTab} 
        onTabChange={handleTabChange} 
        isLoggedIn={isLoggedIn}
      />

      {/* Full-width Hero Carousel */}
      {activeTab === 'about' && <HeroCarousel />}
      
      <main className="flex-1 max-w-screen-2xl mx-auto w-full min-w-0 px-4 md:px-8 lg:px-12 py-8 flex flex-col overflow-hidden">
        {activeTab === 'about' && <AboutNatpac onTabChange={handleTabChange} />}
        {activeTab.startsWith('division-') && <DivisionPage division={activeTab} />}
        {activeTab === 'login' && !isLoggedIn && (
          <AdminAuthPage onLoginSuccess={() => { setIsLoggedIn(true); handleTabChange('data'); }} />
        )}
        {activeTab === 'data' && (
          !isLoggedIn ? (
            <AdminAuthPage onLoginSuccess={() => { setIsLoggedIn(true); setActiveTab('data'); }} />
          ) : (
            <>
              <DashboardTitleBar />

              <HeroStatsBanner />
              
              {/* Main Dashboard Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                <ModeSharePanel />
                <MobilityHeatmapPanel />
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                <OriginDestinationPanel />
                <ZoneStatisticsTable />
              </div>
              
              <QuickAccessDownloads />
            </>
          )
        )}
      </main>

      <Footer />
      <FloatingActions />
    </div>
  );
};

export default App;
