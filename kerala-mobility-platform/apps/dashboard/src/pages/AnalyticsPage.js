import React from 'react';
import AnalyticsCharts from '../components/AnalyticsCharts';
import MapContainer from '../components/MapContainer';

export default function AnalyticsPage() {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
      <div style={{ background: '#1e293b', padding: '24px', borderRadius: '12px' }}>
        <h2 style={{ fontSize: '20px', color: '#f8fafc', marginBottom: '16px' }}>Transit Corridor Demand & Modal Split</h2>
        <AnalyticsCharts />
      </div>
      <div style={{ background: '#1e293b', padding: '24px', borderRadius: '12px' }}>
        <h2 style={{ fontSize: '20px', color: '#f8fafc', marginBottom: '16px' }}>Kerala Spatial Mobility Heatmap</h2>
        <MapContainer />
      </div>
    </div>
  );
}
