import React, { useState } from 'react';

import AccessibilityBar from './components/AccessibilityBar';
import LogoHeader from './components/LogoHeader';
import NavigationBar from './components/NavigationBar';
import DashboardTitleBar from './components/DashboardTitleBar';

import HeroStatsBanner from './components/HeroStatsBanner';
import MobilityHeatmapPanel from './components/MobilityHeatmapPanel';
import OriginDestinationPanel from './components/OriginDestinationPanel';
import ModeSharePanel from './components/ModeSharePanel';
import ZoneStatisticsTable from './components/ZoneStatisticsTable';
import QuickAccessDownloads from './components/QuickAccessDownloads';
import Footer from './components/Footer';
import AboutNatpac from './components/AboutNatpac';
import AdminAuthPage from './components/AdminAuthPage';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('about');
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  const handleLogout = () => {
    setIsLoggedIn(false);
    setActiveTab('about');
  };

  return (
    <div className="min-h-screen flex flex-col font-sans bg-gray-50 text-gray-900">

      <AccessibilityBar 
        onAdminLoginClick={() => setActiveTab('login')}
        isLoggedIn={isLoggedIn}
        onLogout={handleLogout}
      />
      <LogoHeader />
      <NavigationBar 
        activeTab={activeTab} 
        onTabChange={setActiveTab} 
        isLoggedIn={isLoggedIn}
        onLogout={handleLogout}
      />
      
      <main className="flex-1 max-w-screen-2xl mx-auto w-full px-4 md:px-8 lg:px-12 py-8 flex flex-col">
        {activeTab === 'about' && <AboutNatpac />}
        {activeTab === 'login' && !isLoggedIn && (
          <AdminAuthPage onLoginSuccess={() => { setIsLoggedIn(true); setActiveTab('data'); }} />
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
    </div>
  );
};

export default App;
