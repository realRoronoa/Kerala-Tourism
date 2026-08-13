import React from 'react';
import { MOCK_STATS } from '../data/mockDashboardData';
import { Activity, MapPin, Clock, AlertTriangle, Users, CheckCircle } from 'lucide-react';

const iconMap: Record<string, React.ReactNode> = {
  'activity': <Activity className="w-8 h-8 text-gov-blue-primary" />,
  'map-pin': <MapPin className="w-8 h-8 text-gov-blue-primary" />,
  'clock': <Clock className="w-8 h-8 text-gov-blue-primary" />,
  'alert-triangle': <AlertTriangle className="w-8 h-8 text-accent-orange" />,
  'users': <Users className="w-8 h-8 text-gov-blue-primary" />,
  'check-circle': <CheckCircle className="w-8 h-8 text-status-low" />,
};

const HeroStatsBanner: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {MOCK_STATS.map((stat) => (
        <div key={stat.id} className="bg-white border border-gray-300 p-6 shadow-sm flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-xs font-normal text-gray-500 uppercase tracking-widest mb-2">{stat.label}</span>
            <span className="text-2xl font-medium text-gov-blue-primary">{stat.value}</span>
          </div>
          <div className="bg-gray-100 p-4 rounded-sm">
            {iconMap[stat.iconName]}
          </div>
        </div>
      ))}
    </div>
  );
};

export default HeroStatsBanner;
