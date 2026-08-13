import React from 'react';
import { MOCK_MODE_SHARE } from '../data/mockDashboardData';

const ModeSharePanel: React.FC = () => {
  return (
    <div className="bg-white border border-gray-300 shadow-sm flex flex-col h-full">
      <div className="border-b border-gray-300 bg-gray-50 p-6 flex items-center gap-3">
        <span className="text-2xl">🚍</span>
        <div>
          <h3 className="text-base font-semibold text-gov-blue-primary uppercase tracking-wide">Modal Split Distribution</h3>
          <p className="text-sm text-gray-600 mt-1">Distribution of primary transport modes</p>
        </div>
      </div>
      <div className="p-6 flex-1 flex flex-col justify-center gap-8">
        
        {/* Segmented Bar */}
        <div className="w-full h-12 flex border border-gray-400 overflow-hidden">
          {MOCK_MODE_SHARE.map((mode, index) => (
            <div 
              key={index} 
              className={`${mode.colorClass} h-full border-r border-white last:border-r-0 flex items-center justify-center text-xs font-semibold text-white shadow-inner`}
              style={{ width: `${mode.percentage}%` }}
              title={`${mode.mode}: ${mode.percentage}%`}
            >
              {mode.percentage > 5 ? `${mode.percentage}%` : ''}
            </div>
          ))}
        </div>

        {/* Legend */}
        <div className="grid grid-cols-2 gap-4">
          {MOCK_MODE_SHARE.map((mode, index) => (
            <div key={index} className="flex items-center gap-3">
              <div className={`w-6 h-6 border border-gray-400 flex-shrink-0 ${mode.colorClass}`}></div>
              <div className="flex flex-col">
                <span className="text-sm font-medium text-gray-800 leading-tight">{mode.mode}</span>
                <span className="text-xs text-gray-600 font-normal">{mode.percentage}%</span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default ModeSharePanel;
