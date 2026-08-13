import React, { useState, useEffect } from 'react';

interface ModeShare {
  mode: string;
  percentage: number;
  colorClass: string;
}

const colorMap: Record<string, string> = {
  'Bus / KSRTC Transit': 'bg-red-600',
  'Private Vehicles & Cars': 'bg-blue-600',
  'Auto Rickshaws': 'bg-yellow-500',
  'Walking / Active Micro-Mobility': 'bg-green-500',
  'default': 'bg-gray-500'
};

const ModeSharePanel: React.FC = () => {
  const [data, setData] = useState<ModeShare[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchModeSplit = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/v1/analytics/mode-split');
        if (response.ok) {
          const result = await response.json();
          // Assuming result is an array of { mode: "...", percentage: 42 }
          const formattedData = result.map((item: any) => ({
            ...item,
            colorClass: colorMap[item.mode] || colorMap['default']
          }));
          setData(formattedData);
        }
      } catch (error) {
        console.error('Failed to fetch mode split data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchModeSplit();
  }, []);

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
        
        {loading ? (
          <div className="w-full h-12 bg-gray-200 animate-pulse border border-gray-400"></div>
        ) : (
          <>
            {/* Segmented Bar */}
            <div className="w-full h-12 flex border border-gray-400 overflow-hidden">
              {data.map((mode, index) => (
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
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {data.map((mode, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className={`w-6 h-6 border border-gray-400 flex-shrink-0 ${mode.colorClass}`}></div>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-gray-800 leading-tight">{mode.mode}</span>
                    <span className="text-xs text-gray-600 font-normal">{mode.percentage}%</span>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

      </div>
    </div>
  );
};

export default ModeSharePanel;
