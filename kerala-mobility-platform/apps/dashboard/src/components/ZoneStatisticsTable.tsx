import React from 'react';
import { MOCK_ZONE_STATS } from '../data/mockDashboardData';
import { Download, Printer } from 'lucide-react';

const ZoneStatisticsTable: React.FC = () => {
  return (
    <div className="bg-white border border-gray-300 shadow-sm flex flex-col lg:col-span-2">
      <div className="border-b border-gray-300 bg-gray-50 p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-xl font-semibold text-gov-blue-primary uppercase">Zone-Wise Statistics — Top 10 High-Activity Zones</h3>
          <p className="text-sm text-gray-600 mt-1">Detailed metrics for priority traffic analysis zones</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-400 text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors">
            <Download className="w-4 h-4" /> CSV
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-400 text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors">
            <Printer className="w-4 h-4" /> Print
          </button>
        </div>
      </div>
      <div className="p-6 overflow-x-auto">
        <table className="w-full text-left border-collapse border border-gray-300 min-w-[800px]">
          <thead>
            <tr className="bg-gov-blue-primary text-white">
              <th className="border border-gray-400 p-4 font-semibold uppercase tracking-wide text-sm">Zone ID</th>
              <th className="border border-gray-400 p-4 font-semibold uppercase tracking-wide text-sm">Zone Name</th>
              <th className="border border-gray-400 p-4 font-semibold uppercase tracking-wide text-sm text-right">Total Trips</th>
              <th className="border border-gray-400 p-4 font-semibold uppercase tracking-wide text-sm text-right">Avg Distance (KM)</th>
              <th className="border border-gray-400 p-4 font-semibold uppercase tracking-wide text-sm text-right">Congestion %</th>
            </tr>
          </thead>
          <tbody>
            {MOCK_ZONE_STATS.map((stat, index) => (
              <tr key={stat.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                <td className="border border-gray-300 p-4 font-medium text-gray-700">{stat.id.toUpperCase()}</td>
                <td className="border border-gray-300 p-4 font-medium text-gray-900">{stat.zoneName}</td>
                <td className="border border-gray-300 p-4 text-right font-normal text-gray-700">{stat.totalTrips.toLocaleString()}</td>
                <td className="border border-gray-300 p-4 text-right font-normal text-gray-700">{stat.avgDistanceKm.toFixed(1)}</td>
                <td className="border border-gray-300 p-4 text-right">
                  <span className={`px-2 py-1 font-semibold text-sm border ${
                    stat.congestionPercentage > 90 ? 'bg-status-critical text-white border-red-800' :
                    stat.congestionPercentage > 80 ? 'bg-status-veryHigh text-white border-orange-700' :
                    'bg-status-high text-white border-orange-600'
                  }`}>
                    {stat.congestionPercentage}%
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ZoneStatisticsTable;
