import React from 'react';
import { MOCK_OD_PAIRS } from '../data/mockDashboardData';

const OriginDestinationPanel: React.FC = () => {
  const maxVolume = Math.max(...MOCK_OD_PAIRS.map(pair => pair.volume));

  return (
    <div className="bg-white border border-gray-300 shadow-sm flex flex-col">
      <div className="border-b border-gray-300 bg-gray-50 p-6">
        <h3 className="text-xl font-semibold text-gov-blue-primary uppercase">Top Origin-Destination Flows</h3>
        <p className="text-sm text-gray-600 mt-1">Inter-district mobility volume (Daily Average)</p>
      </div>
      <div className="p-6 flex-1 flex flex-col justify-center gap-6">
        {MOCK_OD_PAIRS.map((pair) => (
          <div key={pair.id} className="flex flex-col gap-2">
            <div className="flex justify-between items-end text-sm font-medium text-gray-800">
              <span>{pair.origin} → {pair.destination}</span>
              <span className="text-gov-blue-primary">{pair.volume.toLocaleString()} trips</span>
            </div>
            <div className="w-full bg-gray-200 h-6 border border-gray-300">
              <div 
                className="bg-gov-blue-primary h-full border-r border-gov-blue-secondary transition-all duration-500" 
                style={{ width: `${(pair.volume / maxVolume) * 100}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OriginDestinationPanel;
