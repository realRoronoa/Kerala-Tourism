import React from 'react';

export default function AnalyticsCharts() {
  const modeData = [
    { mode: 'Bus / KSRTC', percentage: 42, color: '#38bdf8' },
    { mode: 'Car / Taxi', percentage: 28, color: '#4ade80' },
    { mode: 'Auto / Two-Wheeler', percentage: 18, color: '#fbbf24' },
    { mode: 'Walking', percentage: 8, color: '#a855f7' },
    { mode: 'Train', percentage: 4, color: '#f43f5e' },
  ];

  return (
    <div>
      <div style={{ marginBottom: '20px' }}>
        <h3 style={{ fontSize: '14px', color: '#94a3b8', marginBottom: '12px' }}>MODAL SPLIT DISTRIBUTION</h3>
        {modeData.map(item => (
          <div key={item.mode} style={{ marginBottom: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', marginBottom: '4px' }}>
              <span>{item.mode}</span>
              <span style={{ fontWeight: 'bold' }}>{item.percentage}%</span>
            </div>
            <div style={{ width: '100%', background: '#334155', height: '10px', borderRadius: '5px', overflow: 'hidden' }}>
              <div style={{ width: `${item.percentage}%`, background: item.color, height: '100%' }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
