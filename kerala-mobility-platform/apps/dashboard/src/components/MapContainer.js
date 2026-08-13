import React from 'react';

export default function MapContainer() {
  return (
    <div style={{
      height: '320px',
      borderRadius: '8px',
      background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)',
      border: '1px solid #334155',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
      padding: '20px'
    }}>
      <div style={{ fontSize: '48px', marginBottom: '12px' }}>📍🗺️</div>
      <div style={{ fontSize: '18px', fontWeight: '600', color: '#38bdf8' }}>Thiruvananthapuram — Kochi — Kozhikode Corridor</div>
      <div style={{ fontSize: '13px', color: '#94a3b8', marginTop: '8px', maxWidth: '360px' }}>
        Mapbox GL JS spatial heatmap rendering active origin-destination matrix and real-time passenger congestion density.
      </div>
    </div>
  );
}
