import React, { useState, useEffect } from 'react';
import { API_BASE_URL } from '../apiConfig';

interface OriginDestinationPair {
  id: string | number;
  origin: string;
  destination: string;
  volume: number;
}

const OriginDestinationPanel: React.FC = () => {
  const [data, setData] = useState<OriginDestinationPair[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchODMatrix = async () => {
      try {
        const token = localStorage.getItem('natpac_admin_token');
        const headers: Record<string, string> = {};
        if (token) headers['Authorization'] = `Bearer ${token}`;

        const response = await fetch(`${API_BASE_URL}/api/v1/analytics/od-matrix`, { headers });
        if (response.ok) {
          const result = await response.json();
          setData(result);
        }
      } catch (error) {
        console.error('Failed to fetch OD matrix data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchODMatrix();
  }, []);

  const maxVolume = data.length > 0 ? Math.max(...data.map(pair => pair.volume)) : 1;

  return (
    <div className="bg-white border border-gray-300 shadow-sm flex flex-col">
      <div className="border-b border-gray-300 bg-gray-50 p-6">
        <h3 className="text-xl font-semibold text-gov-blue-primary uppercase">Top Origin-Destination Flows</h3>
        <p className="text-sm text-gray-600 mt-1">Inter-district mobility volume (Daily Average)</p>
      </div>
      <div className="p-6 flex-1 flex flex-col justify-center gap-6 min-h-[300px]">
        {loading ? (
          <div className="w-full h-full flex flex-col gap-6 justify-center">
            {[1, 2, 3, 4, 5].map(i => (
               <div key={i} className="w-full h-8 bg-gray-200 animate-pulse"></div>
            ))}
          </div>
        ) : data.length > 0 ? (
          data.map((pair, index) => (
            <div key={pair.id || index} className="flex flex-col gap-2">
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
          ))
        ) : (
          <div className="text-sm text-gray-500 text-center">No origin-destination data available.</div>
        )}
      </div>
    </div>
  );
};

export default OriginDestinationPanel;
