import { useState } from 'react';
import { 
  Home, Map, Compass, User, Menu, Bell, Search, Mic, X, 
  ChevronRight, BarChart2, FileText, Settings, Globe, 
  Shield, HelpCircle, AlertTriangle, Info, LogOut, Route
} from 'lucide-react';
import HomeView from './views/HomeView';
import TripVerificationView from './views/TripVerificationView';
import ExploreView from './views/ExploreView';
import PrivacyView from './views/PrivacyView';
import TripsHistoryView from './views/TripsHistoryView';

// Helper components for the Main Menu
const MenuItem = ({ icon, label, rightText, onClick, labelColor = "var(--text-main)" }) => (
  <div onClick={onClick} className="flex items-center justify-between p-4" style={{ cursor: 'pointer' }}>
    <div className="flex items-center gap-3">
      <div style={{ color: labelColor, display: 'flex', alignItems: 'center' }}>{icon}</div>
      <span className="text-sm font-semibold" style={{ color: labelColor }}>{label}</span>
    </div>
    {rightText ? (
      <div className="flex items-center gap-2">
        <span className="text-xs text-muted font-semibold">{rightText}</span>
        <ChevronRight size={16} color="var(--text-light)" />
      </div>
    ) : (
      <ChevronRight size={16} color="var(--text-light)" />
    )}
  </div>
);

const MenuDivider = () => (
  <div style={{ height: '1px', backgroundColor: 'var(--border-color)', marginLeft: '48px', marginRight: '16px' }}></div>
);

function App() {
  const [currentView, setCurrentView] = useState('home');
  const [language, setLanguage] = useState('EN');
  const [showNotifications, setShowNotifications] = useState(false);
  const [hasUnreadNotifs, setHasUnreadNotifs] = useState(true);
  const [showSideNav, setShowSideNav] = useState(false);

  // View Navigation Helpers
  const openVerify = () => setCurrentView('verify');
  const goBack = () => setCurrentView('home');
  const openExplore = () => setCurrentView('explore');
  const openHistory = () => setCurrentView('history');
  const openPrivacy = () => setCurrentView('profile');

  // Header Handlers
  const toggleLanguage = () => setLanguage(prev => prev === 'EN' ? 'ML' : 'EN');
  
  const handleNotificationClick = () => {
    setShowNotifications(true);
    setHasUnreadNotifs(false);
  };

  return (
    <div className="app-container">
      {/* Universal Green Header applied to ALL screens */}
      <header className="app-header">
        
        <div className="header-top-row">
          {/* Left Side: Identity Zone (App Name Only) */}
          <div className="flex items-center gap-2">
            <span className="header-title">Kerala Mobility</span>
          </div>

          {/* Center: Empty Space */}
          <div style={{ flex: 1 }}></div>

          {/* Right Side: Circular Icon Buttons (3 Elements) */}
          <div className="flex items-center gap-4">
            
            {/* Notification Bell (Functional) */}
            <button className="header-icon-btn" style={{ position: 'relative' }} onClick={handleNotificationClick}>
              <Bell size={22} strokeWidth={2} />
              {hasUnreadNotifs && (
                <div style={{ position: 'absolute', top: '8px', right: '10px', width: '10px', height: '10px', backgroundColor: 'var(--color-warning)', borderRadius: '50%', border: '2px solid rgba(255, 255, 255, 0.15)' }}></div>
              )}
            </button>
            
            {/* EN/ML Toggle (Functional) */}
            <button className="header-icon-btn" style={{ fontSize: '13px', fontWeight: 700 }} onClick={toggleLanguage}>
              {language}
            </button>
            
            {/* Profile Icon + Hamburger Menu Badge (Two Separate Tap Targets) */}
            <div style={{ position: 'relative' }}>
              
              {/* Target 1: Profile */}
              <button className="header-icon-btn" onClick={openPrivacy}>
                <User size={22} strokeWidth={2} />
              </button>
              
              {/* Target 2: Side Nav Menu */}
              <button 
                onClick={(e) => { e.stopPropagation(); setShowSideNav(true); }}
                style={{ 
                  position: 'absolute', bottom: '-4px', right: '-4px', width: '22px', height: '22px', 
                  backgroundColor: '#ffffff', borderRadius: '50%', display: 'flex', alignItems: 'center', 
                  justifyContent: 'center', border: '1px solid var(--border-color)', 
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)', cursor: 'pointer', zIndex: 2 
                }}
              >
                <Menu size={14} color="var(--color-primary)" strokeWidth={3} />
              </button>

            </div>
            
          </div>
        </div>

        {/* Search Bar Integration (Only on Home View) */}
        {currentView === 'home' && (
          <div className="mt-4 w-full">
            <div style={{ position: 'relative' }}>
              <Search size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input 
                type="text" 
                placeholder="Search trips, routes, or services" 
                style={{ padding: '14px 44px', fontSize: '14px', width: '100%', border: 'none', borderRadius: '8px', backgroundColor: '#ffffff', color: 'var(--text-main)', outline: 'none', boxShadow: '0 2px 6px rgba(0,0,0,0.1)' }}
              />
              <Mic size={18} style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-primary)', cursor: 'pointer' }} />
            </div>
          </div>
        )}

      </header>

      {/* Main Content Area */}
      <main className="content-area">
        {currentView === 'home' && <HomeView onTripClick={openVerify} onExploreClick={openExplore} onHistoryClick={openHistory} onPrivacyClick={openPrivacy} />}
        {currentView === 'history' && <TripsHistoryView onTripClick={openVerify} />}
        {currentView === 'verify' && <TripVerificationView onBack={goBack} />}
        {currentView === 'explore' && <ExploreView />}
        {currentView === 'profile' && <PrivacyView />}
      </main>

      {/* Bottom Navigation */}
      {currentView !== 'verify' && (
        <nav className="bottom-nav">
          <button 
            className={`nav-item ${currentView === 'home' ? 'active' : ''}`}
            onClick={() => setCurrentView('home')}
          >
            <Home size={20} strokeWidth={currentView === 'home' ? 2.5 : 2} />
            <span>Home</span>
          </button>
          
          <button 
            className={`nav-item ${currentView === 'history' ? 'active' : ''}`}
            onClick={() => setCurrentView('history')}
          >
            <Map size={20} strokeWidth={currentView === 'history' ? 2.5 : 2} />
            <span>Trips</span>
          </button>

          <button 
            className={`nav-item ${currentView === 'explore' ? 'active' : ''}`}
            onClick={() => setCurrentView('explore')}
          >
            <Compass size={20} strokeWidth={currentView === 'explore' ? 2.5 : 2} />
            <span>Explore</span>
          </button>
          
          <button 
            className={`nav-item ${currentView === 'profile' ? 'active' : ''}`}
            onClick={() => setCurrentView('profile')}
          >
            <User size={20} strokeWidth={currentView === 'profile' ? 2.5 : 2} />
            <span>Profile</span>
          </button>
        </nav>
      )}

      {/* Notifications Slide-Over */}
      {showNotifications && (
        <div 
          style={{ position: 'fixed', top: 0, bottom: 0, left: '50%', transform: 'translateX(-50%)', width: '100%', maxWidth: '480px', backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 100, display: 'flex', justifyContent: 'flex-end' }} 
          onClick={() => setShowNotifications(false)}
        >
          <div 
            style={{ width: '80%', maxWidth: '320px', backgroundColor: 'var(--bg-main)', padding: '20px', height: '100%', borderLeft: '1px solid var(--border-color)', animation: 'slideInRight 0.3s' }} 
            onClick={e => e.stopPropagation()}
          >
             <div className="flex justify-between items-center mb-6">
                <h2 style={{ fontSize: '20px', fontWeight: 700, margin: 0 }}>Notifications</h2>
                <X size={20} color="var(--text-main)" onClick={() => setShowNotifications(false)} style={{ cursor: 'pointer' }} />
             </div>
             
             <div className="list-item" style={{ padding: '16px 0', borderBottom: '1px solid var(--border-color)', cursor: 'pointer' }} onClick={() => { setCurrentView('verify'); setShowNotifications(false); }}>
               <div className="item-content">
                 <div className="flex justify-between items-start mb-1">
                    <h3 className="text-sm font-semibold text-main">1 Trip Pending Verification</h3>
                    <div style={{ width: '8px', height: '8px', backgroundColor: 'var(--color-warning)', borderRadius: '50%' }}></div>
                 </div>
                 <p className="text-xs text-muted">Tap to verify your recent travel activity.</p>
               </div>
             </div>
          </div>
        </div>
      )}

      {/* Side Nav Menu Slide-Over */}
      {showSideNav && (
        <div 
          style={{ position: 'fixed', top: 0, bottom: 0, left: '50%', transform: 'translateX(-50%)', width: '100%', maxWidth: '480px', backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 100, display: 'flex', justifyContent: 'flex-end' }} 
          onClick={() => setShowSideNav(false)}
        >
          <div 
            style={{ width: '85%', maxWidth: '340px', backgroundColor: '#F9F9F9', padding: '0', height: '100%', borderLeft: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', overflowY: 'auto' }} 
            onClick={e => e.stopPropagation()}
          >
             {/* Sticky Header */}
             <div className="flex justify-between items-center p-5" style={{ backgroundColor: '#ffffff', borderBottom: '1px solid var(--border-color)', position: 'sticky', top: 0, zIndex: 5 }}>
                <h2 style={{ fontSize: '18px', fontWeight: 700, margin: 0 }}>Main Menu</h2>
                <X size={20} color="var(--text-main)" onClick={() => setShowSideNav(false)} style={{ cursor: 'pointer' }} />
             </div>
             
             <div style={{ padding: '16px' }} className="flex flex-col gap-4">
               
               {/* 1. PROFILE CARD */}
               <div 
                 onClick={() => { openPrivacy(); setShowSideNav(false); }}
                 className="flex items-center gap-4 p-4" 
                 style={{ backgroundColor: '#ffffff', border: '1px solid var(--border-color)', borderRadius: '4px', cursor: 'pointer' }}
               >
                 <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: '#f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                   <User size={24} color="var(--text-muted)" />
                 </div>
                 <div className="flex-1">
                   <div className="text-sm font-semibold mb-1">Hey, Citizen</div>
                   <div className="text-xs text-muted">ID: **** **** 1234</div>
                 </div>
                 <ChevronRight size={16} color="var(--text-light)" />
               </div>

               {/* 2. TRIPS & DATA */}
               <div style={{ backgroundColor: '#ffffff', border: '1px solid var(--border-color)', borderRadius: '4px' }}>
                 <MenuItem icon={<Map size={18} strokeWidth={2.5} />} label="Trip History" onClick={() => { openHistory(); setShowSideNav(false); }} />
                 <MenuDivider />
                 <MenuItem icon={<BarChart2 size={18} strokeWidth={2.5} />} label="Insights" onClick={() => { openExplore(); setShowSideNav(false); }} />
                 <MenuDivider />
                 <MenuItem icon={<FileText size={18} strokeWidth={2.5} />} label="Fares" />
               </div>

               {/* 3. APP SETTINGS */}
               <div style={{ backgroundColor: '#ffffff', border: '1px solid var(--border-color)', borderRadius: '4px' }}>
                 <MenuItem icon={<Settings size={18} strokeWidth={2.5} />} label="Settings" />
                 <MenuDivider />
                 <MenuItem 
                   icon={<Globe size={18} strokeWidth={2.5} />} 
                   label="Language" 
                   rightText={language === 'EN' ? 'English' : 'Malayalam'} 
                   onClick={toggleLanguage} 
                 />
                 <MenuDivider />
                 <MenuItem icon={<Bell size={18} strokeWidth={2.5} />} label="Notifications" onClick={handleNotificationClick} />
                 <MenuDivider />
                 <MenuItem icon={<Shield size={18} strokeWidth={2.5} />} label="Privacy Center" onClick={() => { openPrivacy(); setShowSideNav(false); }} />
               </div>

               {/* 4. SUPPORT */}
               <div style={{ backgroundColor: '#ffffff', border: '1px solid var(--border-color)', borderRadius: '4px' }}>
                 <MenuItem icon={<HelpCircle size={18} strokeWidth={2.5} />} label="Help & Support" />
                 <MenuDivider />
                 <MenuItem icon={<AlertTriangle size={18} strokeWidth={2.5} />} label="Report an Issue" />
                 <MenuDivider />
                 <MenuItem icon={<Info size={18} strokeWidth={2.5} />} label="About Kerala Mobility" />
               </div>

               {/* 5. ACCOUNT */}
               <div style={{ backgroundColor: '#ffffff', border: '1px solid var(--border-color)', borderRadius: '4px' }}>
                 <MenuItem icon={<LogOut size={18} strokeWidth={2.5} />} label="Log Out" labelColor="#8B3A33" />
               </div>

               {/* Bottom Spacer for safe scrolling */}
               <div style={{ height: '40px' }}></div>

             </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default App;
