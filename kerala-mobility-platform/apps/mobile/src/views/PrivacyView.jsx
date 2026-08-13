import { CheckCircle2, XCircle, Trash2, Pause, AlertTriangle, ExternalLink } from 'lucide-react';

export default function PrivacyView() {
  return (
    <div>
      <div className="p-5">
        <h1 className="mb-2">Privacy Center</h1>
        <p>Control how we use your data to improve public transport services.</p>
      </div>

      <div style={{ padding: '0 20px', marginBottom: '24px' }}>
        <h3 className="section-heading">App Permissions</h3>
        
        <div className="flex justify-between items-center mb-4">
          <div style={{ flex: 1, paddingRight: '16px' }}>
            <div className="font-semibold text-sm mb-1">Location Tracking</div>
            <div className="text-xs text-muted">Used for real-time bus tracking and route suggestions.</div>
          </div>
          <div style={{ width: '40px', height: '24px', backgroundColor: 'var(--color-primary)', borderRadius: '12px', position: 'relative' }}>
            <div style={{ width: '20px', height: '20px', backgroundColor: 'white', borderRadius: '50%', position: 'absolute', right: '2px', top: '2px' }}></div>
          </div>
        </div>

        <div className="flex justify-between items-center mb-4">
          <div style={{ flex: 1, paddingRight: '16px' }}>
            <div className="font-semibold text-sm mb-1">Trip History</div>
            <div className="text-xs text-muted">Store your past trips for easier future planning.</div>
          </div>
          <div style={{ width: '40px', height: '24px', backgroundColor: 'var(--color-primary)', borderRadius: '12px', position: 'relative' }}>
            <div style={{ width: '20px', height: '20px', backgroundColor: 'white', borderRadius: '50%', position: 'absolute', right: '2px', top: '2px' }}></div>
          </div>
        </div>

        <div className="flex justify-between items-center">
          <div style={{ flex: 1, paddingRight: '16px' }}>
            <div className="font-semibold text-sm mb-1">Background Tracking</div>
            <div className="text-xs text-muted">Allow app to update location while not in use for better accuracy.</div>
          </div>
          <div style={{ width: '40px', height: '24px', border: '1px solid var(--border-color)', borderRadius: '12px', position: 'relative' }}>
            <div style={{ width: '20px', height: '20px', backgroundColor: 'var(--border-color)', borderRadius: '50%', position: 'absolute', left: '2px', top: '1px' }}></div>
          </div>
        </div>
      </div>

      <div style={{ padding: '0 20px', marginBottom: '24px' }}>
        <h3 className="section-heading">Data Transparency</h3>
        
        <div style={{ border: '1px solid var(--border-color)', borderRadius: '4px', padding: '16px', marginBottom: '16px' }}>
          <div className="font-semibold text-sm mb-3">What we collect</div>
          <div className="flex items-center mb-2 text-xs text-muted" style={{ gap: '8px' }}>
            <CheckCircle2 size={16} color="var(--color-success)" style={{ flexShrink: 0 }} /> 
            <span>Anonymized route searches</span>
          </div>
          <div className="flex items-center mb-2 text-xs text-muted" style={{ gap: '8px' }}>
            <CheckCircle2 size={16} color="var(--color-success)" style={{ flexShrink: 0 }} /> 
            <span>General device location (when enabled)</span>
          </div>
          <div className="flex items-center text-xs text-muted" style={{ gap: '8px' }}>
            <CheckCircle2 size={16} color="var(--color-success)" style={{ flexShrink: 0 }} /> 
            <span>Basic usage metrics for app stability</span>
          </div>
        </div>

        <div style={{ border: '1px solid var(--border-color)', borderRadius: '4px', padding: '16px', backgroundColor: '#fdfdfd' }}>
          <div className="font-semibold text-sm mb-3">What NATPAC receives</div>
          <div className="flex items-center mb-2 text-xs text-muted" style={{ gap: '8px' }}>
            <CheckCircle2 size={16} color="var(--color-success)" style={{ flexShrink: 0 }} /> 
            <span>Aggregated boarding/alighting data</span>
          </div>
          <div className="flex items-center mb-2 text-xs" style={{ gap: '8px', opacity: 0.6 }}>
            <XCircle size={16} color="#999" style={{ flexShrink: 0 }} /> 
            <span style={{ textDecoration: 'line-through' }}>Personal identification (PII)</span>
          </div>
          <div className="flex items-center text-xs" style={{ gap: '8px', opacity: 0.6 }}>
            <XCircle size={16} color="#999" style={{ flexShrink: 0 }} /> 
            <span style={{ textDecoration: 'line-through' }}>Exact start/end addresses</span>
          </div>
        </div>
      </div>

      <div style={{ padding: '0 20px', marginBottom: '40px' }}>
        <h3 className="section-heading">Account Actions</h3>
        
        <div 
          className="flex justify-between items-center font-semibold cursor-pointer" 
          style={{ padding: '14px 0', borderBottom: '1px solid var(--border-color)', borderTop: '1px solid var(--border-color)', fontSize: '13px' }}
        >
          <div className="flex items-center" style={{ gap: '8px' }}>
            <Pause size={18} /> 
            <span>Pause Tracking</span>
          </div>
          <span style={{ color: 'var(--text-muted)' }}>&gt;</span>
        </div>
        
        <div 
          className="flex justify-between items-center font-semibold cursor-pointer" 
          style={{ padding: '14px 0', borderBottom: '1px solid var(--border-color)', fontSize: '13px', color: '#dc2626' }}
        >
          <div className="flex items-center" style={{ gap: '8px' }}>
            <Trash2 size={18} /> 
            <span>Delete Trip History</span>
          </div>
          <Trash2 size={18} />
        </div>
        
        <div 
          className="flex justify-between items-center font-semibold cursor-pointer" 
          style={{ padding: '14px 0', borderBottom: '1px solid var(--border-color)', fontSize: '13px', color: '#dc2626' }}
        >
          <div className="flex items-center" style={{ gap: '8px' }}>
            <AlertTriangle size={18} /> 
            <span>Delete Account</span>
          </div>
          <AlertTriangle size={18} />
        </div>
        
        <div 
          className="flex justify-between items-center font-semibold cursor-pointer" 
          style={{ padding: '14px 0', borderBottom: '1px solid var(--border-color)', fontSize: '13px' }}
        >
          <span>Manage Permissions (OS Settings)</span>
          <ExternalLink size={18} color="var(--text-muted)" />
        </div>
      </div>
    </div>
  );
}
