import React, { useState, useEffect } from 'react';
import { Activity, CheckCircle, MapPin } from 'lucide-react';

interface SummaryData {
  total_trips: number | string;
  verified_trips: number | string;
  verification_rate: string | number;
}

const HeroStatsBanner: React.FC = () => {
  const [data, setData] = useState<SummaryData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/v1/analytics/summary');
        if (response.ok) {
          const result = await response.json();
          setData(result);
        }
      } catch (error) {
        console.error('Failed to fetch summary data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchSummary();
  }, []);

  const stats = [
    {
      id: 'total',
      label: 'Total Processed Citizen Journeys',
      value: data ? data.total_trips : '...',
      icon: <Activity className="w-8 h-8 text-gov-blue-primary" />
    },
    {
      id: 'verified',
      label: 'Verified Ground-Truth Trips',
      value: data ? data.verified_trips : '...',
      icon: <CheckCircle className="w-8 h-8 text-status-low" />
    },
    {
      id: 'accuracy',
      label: 'Ground-Truth Model Accuracy %',
      value: data ? (typeof data.verification_rate === 'number' ? `${data.verification_rate}%` : data.verification_rate) : '...',
      icon: <MapPin className="w-8 h-8 text-gov-blue-primary" />
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {stats.map((stat) => (
        <div key={stat.id} className="bg-white border border-gray-300 p-6 shadow-sm flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-xs font-normal text-gray-500 uppercase tracking-widest mb-2">{stat.label}</span>
            <span className="text-2xl font-medium text-gov-blue-primary">
              {loading ? <span className="animate-pulse w-16 h-8 bg-gray-200 block"></span> : stat.value}
            </span>
          </div>
          <div className="bg-gray-100 p-4 rounded-sm">
            {stat.icon}
          </div>
        </div>
      ))}
    </div>
  );
};

export default HeroStatsBanner;
