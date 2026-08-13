import { Train, Bus, Ship, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function TripsHistoryView({ onTripClick }) {
  return (
    <div style={{ paddingBottom: '32px' }}>
      
      {/* Page Header: 24px top gap, 16px horizontal padding */}
      <div style={{ padding: '24px 16px 0 16px' }}>
        <h1 style={{ margin: '0 0 2px 0' }}>Trip History</h1>
        {/* 20px gap to the next section */}
        <p className="text-sm text-muted" style={{ margin: '0 0 20px 0' }}>Review your past and pending journeys.</p>
      </div>

      {/* Action Required Heading: 12px below to divider */}
      <div style={{ padding: '0 16px', marginBottom: '12px' }}>
        <h3 className="section-heading" style={{ margin: 0 }}>Action Required</h3>
      </div>

      {/* Trip Card: 16px padding on all sides, 16px gap to icon */}
      <div 
        className="flex items-center cursor-pointer" 
        onClick={onTripClick}
        style={{ padding: '16px', borderBottom: '1px solid var(--border-color)', gap: '16px' }}
      >
        {/* Fixed 40x40px icon box */}
        <div className="flex items-center justify-center flex-shrink-0" style={{ width: '40px', height: '40px', border: '1px solid var(--color-warning)', borderRadius: '4px' }}>
          <AlertCircle size={20} color="var(--color-warning)" strokeWidth={2} />
        </div>
        
        {/* Center aligned badge */}
        <div className="flex flex-1 justify-between items-center gap-2">
          {/* 4px gap between text lines */}
          <div className="flex flex-col" style={{ gap: '4px' }}>
            <h3 className="text-sm" style={{ margin: 0, lineHeight: 1.2 }}>Trivandrum Central → Technopark</h3>
            <div className="flex text-xs text-muted" style={{ gap: '12px' }}>
              <span>Today, 08:30 - 09:15</span>
              <span>8.5 km</span>
            </div>
          </div>
          
          <span className="badge" style={{ backgroundColor: '#fff7ed', color: 'var(--color-warning)', flexShrink: 0, whiteSpace: 'nowrap' }}>
            Pending Verification
          </span>
        </div>
      </div>

      {/* Past Verified Trips Heading: 24px above, 12px below */}
      <div style={{ padding: '0 16px', marginTop: '24px', marginBottom: '12px' }}>
        <h3 className="section-heading" style={{ margin: 0 }}>Past Verified Trips</h3>
      </div>

      {/* Verified Trip Card 1 */}
      <div 
        className="flex items-center cursor-pointer" 
        style={{ padding: '16px', borderBottom: '1px solid var(--border-color)', gap: '16px' }}
      >
        <div className="flex items-center justify-center flex-shrink-0" style={{ width: '40px', height: '40px', border: '1px solid var(--border-color)', borderRadius: '4px' }}>
          <Train size={20} strokeWidth={2} />
        </div>
        
        <div className="flex flex-1 justify-between items-center gap-2">
          <div className="flex flex-col" style={{ gap: '4px' }}>
            <h3 className="text-sm" style={{ margin: 0, lineHeight: 1.2 }}>Kochi → Alappuzha</h3>
            <div className="flex text-xs text-muted" style={{ gap: '12px' }}>
              <span>Yesterday, 10:00 - 11:30</span>
              <span>53 km</span>
            </div>
          </div>
          
          <span className="badge badge-success flex-shrink-0" style={{ whiteSpace: 'nowrap' }}>
            <CheckCircle2 size={12} /> Verified
          </span>
        </div>
      </div>

      {/* Verified Trip Card 2 */}
      <div 
        className="flex items-center cursor-pointer" 
        style={{ padding: '16px', borderBottom: '1px solid var(--border-color)', gap: '16px' }}
      >
        <div className="flex items-center justify-center flex-shrink-0" style={{ width: '40px', height: '40px', border: '1px solid var(--border-color)', borderRadius: '4px' }}>
          <Ship size={20} strokeWidth={2} />
        </div>
        
        <div className="flex flex-1 justify-between items-center gap-2">
          <div className="flex flex-col" style={{ gap: '4px' }}>
            <h3 className="text-sm" style={{ margin: 0, lineHeight: 1.2 }}>Vaikom → Ernakulam</h3>
            <div className="flex text-xs text-muted" style={{ gap: '12px' }}>
              <span>11 Nov, 16:15 - 17:45</span>
              <span>34 km</span>
            </div>
          </div>
          
          <span className="badge badge-success flex-shrink-0" style={{ whiteSpace: 'nowrap' }}>
            <CheckCircle2 size={12} /> Verified
          </span>
        </div>
      </div>

      {/* Verified Trip Card 3 */}
      <div 
        className="flex items-center cursor-pointer" 
        style={{ padding: '16px', borderBottom: '1px solid var(--border-color)', gap: '16px' }}
      >
        <div className="flex items-center justify-center flex-shrink-0" style={{ width: '40px', height: '40px', border: '1px solid var(--border-color)', borderRadius: '4px' }}>
          <Bus size={20} strokeWidth={2} />
        </div>
        
        <div className="flex flex-1 justify-between items-center gap-2">
          <div className="flex flex-col" style={{ gap: '4px' }}>
            <h3 className="text-sm" style={{ margin: 0, lineHeight: 1.2 }}>Kakkanad → MG Road</h3>
            <div className="flex text-xs text-muted" style={{ gap: '12px' }}>
              <span>10 Nov, 09:00 - 09:45</span>
              <span>12 km</span>
            </div>
          </div>
          
          <span className="badge badge-success flex-shrink-0" style={{ whiteSpace: 'nowrap' }}>
            <CheckCircle2 size={12} /> Verified
          </span>
        </div>
      </div>

      {/* CTA / Whitespace Filler */}
      <div style={{ padding: '24px 16px', textAlign: 'center' }}>
        <p className="text-xs text-muted" style={{ fontWeight: 600 }}>End of 30-day history. For older trips, download your full travel log.</p>
        <button style={{ marginTop: '12px', padding: '8px 16px', fontSize: '12px', fontWeight: 600, color: 'var(--color-primary)', backgroundColor: 'transparent', border: '1px solid var(--color-primary)', borderRadius: '4px', cursor: 'pointer' }}>
          Download History
        </button>
      </div>

    </div>
  );
}
