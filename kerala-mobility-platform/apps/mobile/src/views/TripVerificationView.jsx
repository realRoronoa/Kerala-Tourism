import { ArrowLeft, CheckCircle2 } from 'lucide-react';

export default function TripVerificationView({ onBack }) {
  return (
    <div style={{ paddingBottom: '40px' }}>
      {/* Back button sits inside/below the green header */}
      <div className="sub-header">
        <button onClick={onBack} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', fontWeight: 600 }}>
          <ArrowLeft size={16} /> Back to Home
        </button>
      </div>

      <div className="p-5">
        <div className="flex justify-between items-center mb-1">
          <h1>Route 144</h1>
          <span className="badge badge-success">
            <CheckCircle2 size={10} /> High Confidence
          </span>
        </div>
        <p className="text-sm text-muted mb-6">Trivandrum Central → Technopark</p>

        <h3 className="section-heading flex items-center gap-2">
          <div style={{ width: '16px', height: '16px', border: '1px solid var(--text-main)', borderRadius: '2px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px' }}>M</div>
          Journey Details
        </h3>
        
        <div style={{ border: '1px solid var(--border-color)', borderRadius: '4px', padding: '16px', marginBottom: '24px' }}>
          <div className="flex gap-4 mb-6">
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '6px' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--text-main)' }}></div>
              <div style={{ width: '1px', height: '40px', backgroundColor: 'var(--border-color)', margin: '4px 0' }}></div>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', border: '2px solid var(--text-main)', backgroundColor: 'white' }}></div>
            </div>
            
            <div className="flex-col w-full">
              <div className="mb-6">
                <div className="flex gap-2 text-xs text-muted font-semibold mb-1">
                  <span>08:45 AM</span> <span>•</span> <span>BOARDING</span>
                </div>
                <div className="font-semibold text-sm">Thampanoor Bus Stand</div>
              </div>
              
              <div>
                <div className="flex gap-2 text-xs text-muted font-semibold mb-1">
                  <span>09:20 AM</span> <span>•</span> <span>ALIGHTING</span>
                </div>
                <div className="font-semibold text-sm">Technopark Phase 1</div>
              </div>
            </div>
          </div>
        </div>

        <h3 className="section-heading flex items-center gap-2">
          <div style={{ width: '16px', height: '16px', border: '1px solid var(--text-main)', borderRadius: '2px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px' }}>₹</div>
          Fare Details
        </h3>

        <div style={{ border: '1px solid var(--border-color)', borderRadius: '4px', padding: '16px', marginBottom: '32px' }}>
          <div className="flex justify-between text-sm mb-3">
            <span className="text-muted">Base Fare</span>
            <span className="font-semibold">₹15.00</span>
          </div>
          <div className="flex justify-between text-sm pb-4 mb-4" style={{ borderBottom: '1px dashed var(--border-color)' }}>
            <span className="text-muted">Distance (12 km)</span>
            <span className="font-semibold">₹18.00</span>
          </div>
          <div className="flex justify-between font-semibold">
            <span>Total Estimated</span>
            <span>₹33.00</span>
          </div>
        </div>

        <h3 className="text-center mb-4">Did we get this trip right?</h3>
        
        <button className="btn btn-outline mb-3">Edit Details</button>
        {/* CONFIRM TRIP is now primary green */}
        <button className="btn btn-primary mb-6" onClick={onBack}>Confirm Trip</button>
        
        <p className="text-center text-xs text-muted" style={{ padding: '0 20px' }}>
          By confirming, you contribute to Kerala's sustainable mobility goals.
        </p>
      </div>
    </div>
  );
}
