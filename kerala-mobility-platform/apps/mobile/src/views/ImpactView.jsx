import { Sparkles } from 'lucide-react';

export default function ImpactView() {
  return (
    <div>
      <div className="p-5" style={{ paddingTop: '10px' }}>
        <h1 className="mb-2">Your Impact</h1>
        <p>A summary of your mobility patterns and their contribution.</p>
      </div>

      <div style={{ padding: '0 20px', marginBottom: '24px' }}>
        <div style={{ border: '1px solid var(--border-color)', borderRadius: '4px', padding: '16px', marginBottom: '16px' }}>
          <div className="text-xs text-muted mb-1">Total Trips</div>
          <div className="font-bold text-2xl" style={{ fontSize: '28px' }}>142</div>
        </div>
        
        <div style={{ border: '1px solid var(--border-color)', borderRadius: '4px', padding: '16px', marginBottom: '16px' }}>
          <div className="text-xs text-muted mb-1">Total Distance</div>
          <div className="font-bold text-2xl" style={{ fontSize: '28px' }}>850 <span className="text-sm font-normal">km</span></div>
        </div>
        
        <div style={{ border: '1px solid var(--border-color)', borderRadius: '4px', padding: '16px', marginBottom: '24px' }}>
          <div className="text-xs text-muted mb-1">Travel Time</div>
          <div className="font-bold text-2xl" style={{ fontSize: '28px' }}>48 <span className="text-sm font-normal">hrs</span></div>
        </div>

        <h3 className="section-heading">Mobility Trends</h3>
        
        <div style={{ border: '1px solid var(--border-color)', borderRadius: '4px', padding: '16px', marginBottom: '24px' }}>
          <div className="flex w-full" style={{ height: '16px', borderRadius: '8px', overflow: 'hidden', marginBottom: '16px' }}>
            <div style={{ width: '45%', backgroundColor: '#000' }}></div>
            <div style={{ width: '30%', backgroundColor: '#666' }}></div>
            <div style={{ width: '15%', backgroundColor: '#999' }}></div>
            <div style={{ width: '10%', backgroundColor: '#ccc' }}></div>
          </div>
          
          <div className="flex flex-wrap gap-4 text-xs text-muted">
            <div className="flex items-center gap-1"><div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#000' }}></div> Bus (45%)</div>
            <div className="flex items-center gap-1"><div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#666' }}></div> Walk (30%)</div>
            <div className="flex items-center gap-1"><div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#999' }}></div> Bike (15%)</div>
            <div className="flex items-center gap-1"><div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#ccc' }}></div> Other (10%)</div>
          </div>
        </div>

        <h3 className="section-heading">Weekly Trend</h3>
        
        <div style={{ border: '1px solid var(--border-color)', borderRadius: '4px', padding: '16px 16px 8px 16px', marginBottom: '24px' }}>
          <div className="flex items-end justify-between" style={{ height: '120px', paddingBottom: '8px', borderBottom: '1px solid var(--border-color)' }}>
            <div style={{ width: '8px', height: '40px', backgroundColor: '#000', borderRadius: '4px' }}></div>
            <div style={{ width: '8px', height: '60px', backgroundColor: '#000', borderRadius: '4px' }}></div>
            <div style={{ width: '8px', height: '80px', backgroundColor: '#000', borderRadius: '4px' }}></div>
            <div style={{ width: '8px', height: '100px', backgroundColor: '#000', borderRadius: '4px' }}></div>
            <div style={{ width: '8px', height: '50px', backgroundColor: '#000', borderRadius: '4px' }}></div>
            <div style={{ width: '8px', height: '20px', backgroundColor: '#000', borderRadius: '4px' }}></div>
            <div style={{ width: '8px', height: '10px', backgroundColor: '#000', borderRadius: '4px' }}></div>
          </div>
          <div className="flex justify-between text-xs text-muted mt-2" style={{ padding: '0 2px' }}>
            <span>Mon</span>
            <span>Tue</span>
            <span>Wed</span>
            <span>Thu</span>
            <span>Fri</span>
            <span>Sat</span>
            <span>Sun</span>
          </div>
        </div>

        <div style={{ backgroundColor: '#f8f8f8', border: '1px solid var(--border-color)', borderRadius: '4px', padding: '16px', display: 'flex', gap: '16px' }}>
          <Sparkles size={24} color="#000" style={{ flexShrink: 0 }} />
          <div>
            <h3 className="mb-1 text-sm">Direct Impact</h3>
            <p className="text-xs text-muted" style={{ lineHeight: '1.6' }}>
              Your data helped NATPAC identify a need for increased bus frequency on the Kochi-Kakkanad route.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
