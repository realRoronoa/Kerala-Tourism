import React from 'react';

const MobilityHeatmapPanel: React.FC = () => {
  return (
    <div className="bg-white border border-gray-300 shadow-sm flex flex-col h-full">
      <div className="border-b border-gray-300 bg-gray-50 p-6 flex items-center gap-3">
        <span className="text-2xl">🗺️</span>
        <div>
          <h3 className="text-base font-semibold text-gov-blue-primary uppercase tracking-wide">Kerala Spatial Density Heatmap</h3>
          <p className="text-sm text-gray-600 mt-1">Geospatial corridor density and hub distribution</p>
        </div>
      </div>
      <div className="p-8 flex-1 flex flex-col justify-center">
        <ul className="space-y-4 text-gray-800 font-normal text-lg list-disc pl-6">
          <li>Thiruvananthapuram — Kochi Corridor</li>
          <li>Kochi — Kozhikode Corridor</li>
          <li>Major Dwell Stop Hub Clusters</li>
          <li>District-Wise Origin-Destination OD</li>
        </ul>
      </div>
    </div>
  );
};

export default MobilityHeatmapPanel;
