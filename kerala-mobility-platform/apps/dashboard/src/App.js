import React, { useState, useEffect } from 'react';
import AnalyticsPage from './pages/AnalyticsPage';

function App() {
  const [analyticsData, setAnalyticsData] = useState({
    total_trips: 12450,
    verified_trips: 9820,
    unverified_trips: 2630,
    verification_rate: 0.788
  });

  useEffect(() => {
    fetch('http://localhost:8000/api/v1/analytics/summary')
      .then(res => res.json())
      .then(data => setAnalyticsData(data))
      .catch(err => console.log('Using initial dashboard state:', err));
  }, []);

  return (
    <div style={{ fontFamily: 'Inter, sans-serif', backgroundColor: '#0f172a', color: '#f8fafc', minHeight: '100vh', padding: '24px' }}>
      <header style={{ borderBottom: '1px solid #334155', paddingBottom: '16px', marginBottom: '24px' }}>
        <h1 style={{ margin: 0, fontSize: '28px', color: '#38bdf8' }}>NATPAC Mobility Intelligence Platform</h1>
        <p style={{ margin: '4px 0 0 0', color: '#94a3b8' }}>Government of Kerala — Smart State-Wide Transit & Passenger Flow Dashboard</p>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '32px' }}>
        <div style={{ background: '#1e293b', padding: '20px', borderRadius: '12px', borderLeft: '4px solid #38bdf8' }}>
          <div style={{ fontSize: '14px', color: '#94a3b8' }}>Total Trips Recorded</div>
          <div style={{ fontSize: '32px', fontWeight: 'bold', marginTop: '8px' }}>{analyticsData.total_trips?.toLocaleString()}</div>
        </div>
        <div style={{ background: '#1e293b', padding: '20px', borderRadius: '12px', borderLeft: '4px solid #4ade80' }}>
          <div style={{ fontSize: '14px', color: '#94a3b8' }}>Human Verified Trips</div>
          <div style={{ fontSize: '32px', fontWeight: 'bold', marginTop: '8px', color: '#4ade80' }}>{analyticsData.verified_trips?.toLocaleString()}</div>
        </div>
        <div style={{ background: '#1e293b', padding: '20px', borderRadius: '12px', borderLeft: '4px solid #fbbf24' }}>
          <div style={{ fontSize: '14px', color: '#94a3b8' }}>Pending Verification</div>
          <div style={{ fontSize: '32px', fontWeight: 'bold', marginTop: '8px', color: '#fbbf24' }}>{analyticsData.unverified_trips?.toLocaleString()}</div>
        </div>
        <div style={{ background: '#1e293b', padding: '20px', borderRadius: '12px', borderLeft: '4px solid #a855f7' }}>
          <div style={{ fontSize: '14px', color: '#94a3b8' }}>Verification Rate</div>
          <div style={{ fontSize: '32px', fontWeight: 'bold', marginTop: '8px', color: '#a855f7' }}>{((analyticsData.verification_rate || 0) * 100).toFixed(1)}%</div>
        </div>
      </div>

      <AnalyticsPage />
    </div>
  );
}

export default App;
