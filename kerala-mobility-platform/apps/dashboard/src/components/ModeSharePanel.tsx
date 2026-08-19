import React from 'react';

// Professional monochromatic data visualization palette
const MOCK_MODE_SHARE = [
  { mode: 'Bus / KSRTC Transit', percentage: 42, colorClass: 'bg-[#0B1F44]' }, // Very Dark Navy
  { mode: 'Private Vehicles & Cars', percentage: 28, colorClass: 'bg-[#254382]' }, // Mid Navy
  { mode: 'Auto Rickshaws', percentage: 18, colorClass: 'bg-[#4B6FA6]' }, // Muted Steel Blue
  { mode: 'Walking / Active Micro-Mobility', percentage: 12, colorClass: 'bg-[#7388A8]' }, // Slate Blue
];

const ModeSharePanel: React.FC = () => {
  const data = MOCK_MODE_SHARE;

  return (
    <div className="font-sans h-full flex flex-col">
      <div className="mb-3">
        <h3 className="text-[16px] font-bold text-[#0a1a4a] m-0 border-l-[3px] border-[#FF9933] pl-2 leading-tight">
          Modal Split Distribution
        </h3>
        <p className="text-[12px] text-[#5a5f6d] mt-1 pl-3 m-0">Distribution of primary transport modes</p>
      </div>

      <div className="bg-white border border-[#d7dce6] p-5 flex-1 flex flex-col justify-center gap-6">
        {/* Segmented Bar */}
        <div className="w-full h-6 flex border border-[#d7dce6] rounded-none overflow-hidden">
          {data.map((mode, index) => (
            <div 
              key={index} 
              className={`${mode.colorClass} h-full border-r border-white last:border-r-0 flex items-center justify-center text-[11px] font-bold text-white`}
              style={{ width: `${mode.percentage}%` }}
              title={`${mode.mode}: ${mode.percentage}%`}
            >
              {mode.percentage > 5 ? `${mode.percentage}%` : ''}
            </div>
          ))}
        </div>

        {/* Legend */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-4">
          {data.map((mode, index) => (
            <div key={index} className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-none flex-shrink-0 border border-[#d7dce6] ${mode.colorClass}`}></div>
              <div className="flex flex-col">
                <span className="text-[12px] font-medium text-[#1a1a1a] leading-tight">{mode.mode}</span>
                <span className="text-[11px] text-[#5a5f6d]">{mode.percentage}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ModeSharePanel;
