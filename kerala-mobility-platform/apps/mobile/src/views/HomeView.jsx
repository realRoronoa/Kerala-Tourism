import { useState, useEffect } from 'react';
import { Train, Footprints, Bus, Ruler, Clock, ArrowRight, Map, BarChart2, AlertTriangle, FileText, User, MapPin, X, CloudRain, Plus } from 'lucide-react';

export default function HomeView({ onTripClick, onExploreClick, onHistoryClick, onPrivacyClick }) {
  const [greeting, setGreeting] = useState('Good morning');
  const [showAlert, setShowAlert] = useState(true);
  const [hasLiveTrip, setHasLiveTrip] = useState(true);

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour >= 12 && hour < 17) setGreeting('Good afternoon');
    else if (hour >= 17) setGreeting('Good evening');
  }, []);

  return (
    <div style={{ paddingBottom: '32px' }}>
      
      {/* 1. Nav tabs row (Quick Chips) - Consistent 16px horizontal padding */}
      <div style={{ padding: '16px 16px 8px 16px', backgroundColor: 'var(--bg-main)' }}>
        <div className="flex gap-2">
          <div className="flex items-center justify-center gap-1 cursor-pointer" style={{ flex: 1, border: '1px solid var(--border-color)', borderRadius: '16px', padding: '6px 14px', fontSize: '11px', fontWeight: 600, backgroundColor: 'var(--bg-secondary)', color: 'var(--text-main)' }}>
            <MapPin size={12} color="var(--text-main)" fill="var(--text-main)" /> Home
          </div>
          <div className="flex items-center justify-center gap-1 cursor-pointer" style={{ flex: 1, border: '1px solid var(--border-color)', borderRadius: '16px', padding: '6px 14px', fontSize: '11px', fontWeight: 600, backgroundColor: 'transparent', color: 'var(--text-muted)', borderStyle: 'dashed' }}>
            <Plus size={12} color="var(--text-muted)" /> Set Work
          </div>
        </div>
      </div>

      {/* Greeting and Header */}
      <div style={{ padding: '8px 16px 0 16px' }}>
        <div className="text-sm text-muted mb-1">{greeting}, Citizen</div>
        <div className="flex justify-between items-end mb-4">
          <div>
            <h1 style={{ margin: '0 0 2px 0' }}>Today</h1>
            <p className="text-muted" style={{ margin: 0 }}>Thursday, 13 Nov</p>
          </div>
        </div>

        {/* Context Alert Card */}
        {showAlert && (
          <div className="flex items-center justify-between mb-4" style={{ border: '1px solid var(--color-warning)', backgroundColor: '#fffbeb', padding: '10px 12px', borderRadius: '4px' }}>
            <div className="flex items-center gap-2">
              <CloudRain size={16} color="var(--color-warning)" />
              <span className="text-xs" style={{ color: 'var(--text-main)', fontWeight: 600 }}>Heavy rain advisory: Expect bus delays on NH-66.</span>
            </div>
            <X size={16} color="var(--text-muted)" style={{ cursor: 'pointer' }} onClick={() => setShowAlert(false)} />
          </div>
        )}
      </div>

      {/* Stat Strip */}
      <div style={{ padding: '0 16px', marginBottom: '24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
          <div className="flex flex-col items-center justify-center" style={{ border: '1px solid var(--border-color)', borderRadius: '4px', padding: '12px 8px', backgroundColor: 'var(--bg-main)' }}>
            <div className="flex items-center gap-1 mb-1">
              <Bus size={14} color="var(--text-main)" />
              <div className="stat-value text-sm" style={{ fontWeight: 700 }}>3</div>
            </div>
            <div className="stat-label text-xs text-muted">Trips</div>
          </div>
          
          <div className="flex flex-col items-center justify-center" style={{ border: '1px solid var(--border-color)', borderRadius: '4px', padding: '12px 8px', backgroundColor: 'var(--bg-main)' }}>
            <div className="flex items-center gap-1 mb-1">
              <Ruler size={14} color="var(--text-main)" />
              <div className="stat-value text-sm" style={{ fontWeight: 700 }}>12 km</div>
            </div>
            <div className="stat-label text-xs text-muted">Distance</div>
          </div>

          <div className="flex flex-col items-center justify-center" style={{ border: '1px solid var(--border-color)', borderRadius: '4px', padding: '12px 8px', backgroundColor: 'var(--bg-main)' }}>
            <div className="flex items-center gap-1 mb-1">
              <Clock size={14} color="var(--text-main)" />
              <div className="stat-value text-sm" style={{ fontWeight: 700 }}>45 min</div>
            </div>
            <div className="stat-label text-xs text-muted">Duration</div>
          </div>
        </div>
      </div>

      {/* Quick Actions Row */}
      <div style={{ padding: '0 16px', marginBottom: '24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '8px' }}>
          
          <div onClick={onHistoryClick} className="flex flex-col items-center justify-start cursor-pointer">
            <div className="flex items-center justify-center mb-2" style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: '#0B5D3B' }}>
              <Map size={20} color="#ffffff" strokeWidth={1.5} />
            </div>
            <span style={{ fontSize: '10px', color: 'var(--text-main)', textAlign: 'center' }}>History</span>
          </div>

          <div onClick={onExploreClick} className="flex flex-col items-center justify-start cursor-pointer">
            <div className="flex items-center justify-center mb-2" style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: '#2C7A7B' }}>
              <BarChart2 size={20} color="#ffffff" strokeWidth={1.5} />
            </div>
            <span style={{ fontSize: '10px', color: 'var(--text-main)', textAlign: 'center' }}>Insights</span>
          </div>

          <div className="flex flex-col items-center justify-start cursor-pointer">
            <div className="flex items-center justify-center mb-2" style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: '#C89B3C' }}>
              <FileText size={20} color="#ffffff" strokeWidth={1.5} />
            </div>
            <span style={{ fontSize: '10px', color: 'var(--text-main)', textAlign: 'center' }}>Fares</span>
          </div>

          <div className="flex flex-col items-center justify-start cursor-pointer">
            <div className="flex items-center justify-center mb-2" style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: '#8B3A33' }}>
              <AlertTriangle size={20} color="#ffffff" strokeWidth={1.5} />
            </div>
            <span style={{ fontSize: '10px', color: 'var(--text-main)', textAlign: 'center' }}>Report</span>
          </div>

          <div onClick={onPrivacyClick} className="flex flex-col items-center justify-start cursor-pointer">
            <div className="flex items-center justify-center mb-2" style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: '#4A5568' }}>
              <User size={20} color="#ffffff" strokeWidth={1.5} />
            </div>
            <span style={{ fontSize: '10px', color: 'var(--text-main)', textAlign: 'center' }}>Privacy</span>
          </div>
          
        </div>
      </div>

      {/* 2. Standardized Card Styling: Pending Verification Card */}
      <div style={{ padding: '0 16px', marginBottom: '16px' }}>
        <div 
          className="flex items-center cursor-pointer" 
          onClick={onTripClick}
          style={{ border: '1px solid var(--border-color)', borderRadius: '4px', padding: '16px', backgroundColor: 'var(--bg-main)', gap: '16px' }}
        >
          {/* Vertically centered route icon against text */}
          <div className="flex items-center justify-center flex-shrink-0" style={{ width: '40px', height: '40px', border: '1px solid var(--color-warning)', borderRadius: '4px' }}>
            <AlertTriangle size={20} color="var(--color-warning)" strokeWidth={2} />
          </div>
          
          <div className="flex flex-1 justify-between items-center gap-2">
            <span className="text-sm font-semibold">1 Trip Pending Verification</span>
            <ArrowRight size={16} color="var(--text-muted)" />
          </div>
        </div>
      </div>

      {/* 2 & 3. Standardized Card Styling: Live Trip Card (16px internal padding, exact icon alignment) */}
      {hasLiveTrip && (
        <div style={{ padding: '0 16px', marginBottom: '24px' }}>
          <div style={{ border: '1px solid var(--color-primary)', borderRadius: '4px', backgroundColor: 'var(--bg-main)', overflow: 'hidden' }}>
            
            {/* Header (Optional depending on card type, perfectly styled) */}
            <div className="flex justify-between items-center" style={{ borderBottom: '1px solid var(--border-color)', padding: '12px 16px' }}>
              <div className="flex items-center gap-2">
                <div style={{ width: '8px', height: '8px', backgroundColor: 'var(--color-primary)', borderRadius: '50%', animation: 'pulse 2s infinite' }}></div>
                <span className="text-xs font-semibold" style={{ color: 'var(--color-primary)' }}>Live Trip</span>
              </div>
              <span className="text-xs text-muted" style={{ cursor: 'pointer', textDecoration: 'underline' }}>View Map</span>
            </div>
            
            {/* Body - Top and bottom internal padding match (16px) */}
            <div className="flex items-center" style={{ padding: '16px 16px 12px 16px', gap: '16px' }}>
              {/* Vertically centered route icon (40x40px) against two-line text block */}
              <div className="flex items-center justify-center flex-shrink-0" style={{ width: '40px', height: '40px', border: '1px solid var(--color-primary)', borderRadius: '4px' }}>
                <Bus size={20} color="var(--text-main)" />
              </div>
              
              <div className="flex flex-col" style={{ gap: '4px' }}>
                <h3 className="text-sm" style={{ margin: 0, lineHeight: 1.2 }}>Route 21 • East Fort to Kovalam</h3>
                <div className="flex text-xs text-muted" style={{ gap: '12px' }}>
                  <span>14.2 km so far</span>
                  <span>32 min elapsed</span>
                </div>
              </div>
            </div>
            
            {/* 4. Align progress bar's left/right edges to match the text content above it (72px total left gap) */}
            <div style={{ padding: '0 16px 16px 72px' }}>
              <div style={{ width: '100%', height: '4px', backgroundColor: 'var(--border-color)', borderRadius: '2px', overflow: 'hidden' }}>
                <div style={{ width: '60%', height: '100%', backgroundColor: 'var(--color-primary)' }}></div>
              </div>
            </div>
            
          </div>
        </div>
      )}

      {/* 5. Consistent top margin (24px) before Detected Activity, consistent underline (not full bleed) */}
      <div style={{ padding: '0 16px', marginTop: '24px', marginBottom: '12px' }}>
        <h3 className="section-heading" style={{ margin: 0 }}>Detected Activity</h3>
      </div>

      {/* Activity List - leveraging updated index.css styling */}
      <div className="list-item" onClick={onTripClick}>
        <div className="item-icon" style={{ borderLeft: '3px solid #3b82f6' }}>
          <Train size={20} strokeWidth={2} />
        </div>
        <div className="flex flex-1 justify-between items-center gap-2">
          <div className="flex flex-col" style={{ gap: '4px' }}>
            <h3 className="text-sm" style={{ margin: 0, lineHeight: 1.2 }}>Trivandrum Central → Technopark</h3>
            <div className="flex text-xs text-muted" style={{ gap: '12px' }}>
              <span>08:30 - 09:15</span>
              <span>8.5 km</span>
            </div>
          </div>
          
          <span className="badge badge-success flex-shrink-0" style={{ whiteSpace: 'nowrap' }}>
            <div style={{ width: '4px', height: '4px', borderRadius: '50%', backgroundColor: 'var(--color-success)' }}></div>
            High Confidence
          </span>
        </div>
      </div>

      <div className="list-item" onClick={onTripClick}>
        <div className="item-icon" style={{ borderLeft: '3px solid var(--color-warning)' }}>
          <Footprints size={20} strokeWidth={2} />
        </div>
        <div className="flex flex-1 justify-between items-center gap-2">
          <div className="flex flex-col" style={{ gap: '4px' }}>
            <h3 className="text-sm" style={{ margin: 0, lineHeight: 1.2 }}>Technopark Gate → TCS Peepal Park</h3>
            <div className="flex text-xs text-muted" style={{ gap: '12px' }}>
              <span>09:15 - 09:25</span>
              <span>0.8 km</span>
            </div>
          </div>
          
          <span className="badge" style={{ backgroundColor: '#fff7ed', color: 'var(--color-warning)', flexShrink: 0, whiteSpace: 'nowrap' }}>
            <div style={{ width: '4px', height: '4px', borderRadius: '50%', backgroundColor: 'var(--color-warning)' }}></div>
            Medium Confidence
          </span>
        </div>
      </div>

      <div className="list-item" onClick={onTripClick}>
        <div className="item-icon" style={{ borderLeft: '3px solid var(--color-success)' }}>
          <Bus size={20} strokeWidth={2} />
        </div>
        <div className="flex flex-1 justify-between items-center gap-2">
          <div className="flex flex-col" style={{ gap: '4px' }}>
            <h3 className="text-sm" style={{ margin: 0, lineHeight: 1.2 }}>TCS Peepal Park → Kazhakootam</h3>
            <div className="flex text-xs text-muted" style={{ gap: '12px' }}>
              <span>18:00 - 18:20</span>
              <span>3.2 km</span>
            </div>
          </div>
          
          <span className="badge badge-success flex-shrink-0" style={{ whiteSpace: 'nowrap' }}>
            <div style={{ width: '4px', height: '4px', borderRadius: '50%', backgroundColor: 'var(--color-success)' }}></div>
            High Confidence
          </span>
        </div>
      </div>

      {/* Week Summary Footer */}
      <div style={{ padding: '24px 16px', textAlign: 'center' }}>
        <div className="flex justify-between items-center" style={{ borderTop: '1px solid var(--border-color)', borderBottom: '1px solid var(--border-color)', padding: '12px 0' }}>
          <div className="text-sm font-semibold">
            This Week: 18 Trips | 94 km | 3h 40m
          </div>
          <div onClick={onExploreClick} style={{ cursor: 'pointer', fontSize: '12px', fontWeight: 700, color: 'var(--color-primary)', textDecoration: 'underline' }}>
            View Details
          </div>
        </div>
      </div>

    </div>
  );
}
