import { useState } from 'react';
import { Search, Train, Ship, Zap, Trees, Map, Calendar, Bell, FileText, ArrowRight } from 'lucide-react';
import ImpactView from './ImpactView';

export default function ExploreView() {
  const [activeTab, setActiveTab] = useState('discovery'); // discovery, impact

  return (
    <div>
      {/* 1. Proper Tab Bar */}
      <div className="flex" style={{ borderBottom: '1px solid var(--border-color)' }}>
        <div 
          onClick={() => setActiveTab('discovery')}
          style={{ 
            flex: 1, 
            textAlign: 'center', 
            padding: '16px 0', 
            fontSize: '13px', 
            fontWeight: 700, 
            cursor: 'pointer',
            color: activeTab === 'discovery' ? 'var(--color-primary)' : 'var(--text-muted)',
            borderBottom: activeTab === 'discovery' ? '2px solid var(--color-primary)' : '2px solid transparent',
            marginBottom: '-1px' /* Pull active border down to overlap the container border perfectly */
          }}
        >
          Discovery
        </div>
        <div 
          onClick={() => setActiveTab('impact')}
          style={{ 
            flex: 1, 
            textAlign: 'center', 
            padding: '16px 0', 
            fontSize: '13px', 
            fontWeight: 700, 
            cursor: 'pointer',
            color: activeTab === 'impact' ? 'var(--color-primary)' : 'var(--text-muted)',
            borderBottom: activeTab === 'impact' ? '2px solid var(--color-primary)' : '2px solid transparent',
            marginBottom: '-1px'
          }}
        >
          Your Impact
        </div>
      </div>

      {activeTab === 'discovery' ? (
        <div className="flex flex-col gap-5 px-5 pt-5 pb-8">
          
          {/* 2 & 3. Search Bar using strict heights for perfect optical alignment */}
          <div className="flex items-center" style={{ width: '100%', height: '48px', border: '1px solid var(--border-color)', borderRadius: '4px', backgroundColor: 'var(--bg-main)', overflow: 'hidden' }}>
            <div className="flex items-center justify-center" style={{ width: '44px', height: '48px' }}>
              <Search size={18} color="var(--text-muted)" style={{ marginTop: '2px' }} /> {/* Slight optical nudge to match font baseline */}
            </div>
            <input 
              type="text" 
              placeholder="Search destinations, routes, or activities" 
              style={{ 
                flex: 1,
                height: '48px',
                padding: '0 16px 0 0', 
                fontSize: '14px', 
                lineHeight: '48px',
                border: 'none', 
                backgroundColor: 'transparent', 
                color: 'var(--text-main)', 
                outline: 'none' 
              }}
            />
          </div>

          {/* 4 & 5. Recommended for You (Bordered Cards, Consistent Spacing) */}
          <div>
            <h3 className="section-heading" style={{ margin: '0 0 16px 0' }}>Recommended for You</h3>
            
            <div className="flex flex-col gap-3">
              {/* Recommendation Card 1 */}
              <div style={{ border: '1px solid var(--border-color)', borderRadius: '4px', padding: '16px', backgroundColor: 'var(--bg-main)' }}>
                {/* Icon and Text paired symmetrically on the left */}
                <div className="flex items-center gap-2 mb-2">
                  <Trees size={18} color="var(--color-primary)" />
                  <span className="font-semibold text-sm">Vembanad Backwaters</span>
                </div>
                <p className="text-xs mb-3 text-muted">Quiet canals, matching your 'Eco Tourism' interest.</p>
                <div className="flex items-center gap-1 text-xs font-semibold" style={{ color: 'var(--color-primary)' }}>
                  View Details <ArrowRight size={14} />
                </div>
              </div>
              
              {/* Recommendation Card 2 */}
              <div style={{ border: '1px solid var(--border-color)', borderRadius: '4px', padding: '16px', backgroundColor: 'var(--bg-main)' }}>
                {/* Icon and Text paired symmetrically on the left */}
                <div className="flex items-center gap-2 mb-2">
                  <Map size={18} color="var(--color-primary)" />
                  <span className="font-semibold text-sm">Munnar Tea Trails</span>
                </div>
                <p className="text-xs mb-3 text-muted">High altitude routes for nature lovers.</p>
                <div className="flex items-center gap-1 text-xs font-semibold" style={{ color: 'var(--color-primary)' }}>
                  View Details <ArrowRight size={14} />
                </div>
              </div>
            </div>
          </div>

          {/* 6. All Services (Proper 2-Column Grid with Tiles) */}
          <div className="mt-2">
            <h3 className="section-heading" style={{ margin: '0 0 16px 0' }}>All Services</h3>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
              
              <div className="flex flex-col items-center justify-center gap-2 cursor-pointer" style={{ border: '1px solid var(--border-color)', borderRadius: '4px', padding: '20px 12px', backgroundColor: 'var(--bg-main)', textAlign: 'center' }}>
                <Train size={24} color="var(--color-primary)" strokeWidth={1.5} />
                <span className="text-xs font-semibold">Public Transport</span>
              </div>
              
              <div className="flex flex-col items-center justify-center gap-2 cursor-pointer" style={{ border: '1px solid var(--border-color)', borderRadius: '4px', padding: '20px 12px', backgroundColor: 'var(--bg-main)', textAlign: 'center' }}>
                <Ship size={24} color="var(--color-primary)" strokeWidth={1.5} />
                <span className="text-xs font-semibold">Waterways</span>
              </div>
              
              <div className="flex flex-col items-center justify-center gap-2 cursor-pointer" style={{ border: '1px solid var(--border-color)', borderRadius: '4px', padding: '20px 12px', backgroundColor: 'var(--bg-main)', textAlign: 'center' }}>
                <Zap size={24} color="var(--color-primary)" strokeWidth={1.5} />
                <span className="text-xs font-semibold">EV Stations</span>
              </div>
              
              <div className="flex flex-col items-center justify-center gap-2 cursor-pointer" style={{ border: '1px solid var(--border-color)', borderRadius: '4px', padding: '20px 12px', backgroundColor: 'var(--bg-main)', textAlign: 'center' }}>
                <Trees size={24} color="var(--color-primary)" strokeWidth={1.5} />
                <span className="text-xs font-semibold">Eco Tourism</span>
              </div>
              
              <div className="flex flex-col items-center justify-center gap-2 cursor-pointer" style={{ border: '1px solid var(--border-color)', borderRadius: '4px', padding: '20px 12px', backgroundColor: 'var(--bg-main)', textAlign: 'center' }}>
                <Map size={24} color="var(--color-primary)" strokeWidth={1.5} />
                <span className="text-xs font-semibold">City Maps</span>
              </div>
              
              <div className="flex flex-col items-center justify-center gap-2 cursor-pointer" style={{ border: '1px solid var(--border-color)', borderRadius: '4px', padding: '20px 12px', backgroundColor: 'var(--bg-main)', textAlign: 'center' }}>
                <Calendar size={24} color="var(--color-primary)" strokeWidth={1.5} />
                <span className="text-xs font-semibold">Events</span>
              </div>
              
              <div className="flex flex-col items-center justify-center gap-2 cursor-pointer" style={{ border: '1px solid var(--border-color)', borderRadius: '4px', padding: '20px 12px', backgroundColor: 'var(--bg-main)', textAlign: 'center' }}>
                <Bell size={24} color="var(--color-primary)" strokeWidth={1.5} />
                <span className="text-xs font-semibold">Alerts</span>
              </div>
              
              <div className="flex flex-col items-center justify-center gap-2 cursor-pointer" style={{ border: '1px solid var(--border-color)', borderRadius: '4px', padding: '20px 12px', backgroundColor: 'var(--bg-main)', textAlign: 'center' }}>
                <FileText size={24} color="var(--color-primary)" strokeWidth={1.5} />
                <span className="text-xs font-semibold">Policy</span>
              </div>
              
            </div>
          </div>
          
        </div>
      ) : (
        <ImpactView />
      )}
    </div>
  );
}
