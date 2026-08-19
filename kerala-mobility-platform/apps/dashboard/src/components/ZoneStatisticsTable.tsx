import React from 'react';
import { MOCK_ZONE_STATS } from '../data/mockDashboardData';
import { Download, Printer } from 'lucide-react';

const ZoneStatisticsTable: React.FC = () => {
  return (
    <div className="font-sans lg:col-span-2">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-3 gap-3">
        <div>
          <h3 className="text-[16px] font-bold text-[#0a1a4a] m-0 border-l-[3px] border-[#FF9933] pl-2 leading-tight">
            Zone-Wise Statistics — Top 10 High-Activity Zones
          </h3>
          <p className="text-[12px] text-[#5a5f6d] mt-1 pl-3 m-0">Detailed metrics for priority traffic analysis zones</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-1.5 px-3 py-1 bg-white border border-[#d7dce6] text-[11px] font-semibold text-[#1a1a1a] hover:bg-[#f4f6fb] rounded-sm">
            <Download className="w-3.5 h-3.5" /> CSV
          </button>
          <button className="flex items-center gap-1.5 px-3 py-1 bg-white border border-[#d7dce6] text-[11px] font-semibold text-[#1a1a1a] hover:bg-[#f4f6fb] rounded-sm">
            <Printer className="w-3.5 h-3.5" /> Print
          </button>
        </div>
      </div>

      <div className="bg-white border border-[#d7dce6] overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[800px]">
          <thead>
            <tr className="bg-[#0a1a4a]">
              <th scope="col" className="px-3 py-2 font-semibold text-[12px] text-white border-r border-[#ffffff]/20">Zone ID</th>
              <th scope="col" className="px-3 py-2 font-semibold text-[12px] text-white border-r border-[#ffffff]/20">Zone Name</th>
              <th scope="col" className="text-right px-3 py-2 font-semibold text-[12px] text-white border-r border-[#ffffff]/20">Total Trips</th>
              <th scope="col" className="text-right px-3 py-2 font-semibold text-[12px] text-white border-r border-[#ffffff]/20">Avg Dist (KM)</th>
              <th scope="col" className="text-center px-3 py-2 font-semibold text-[12px] text-white">Congestion Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#d7dce6]">
            {MOCK_ZONE_STATS.map((stat, index) => {
              const isDanger = stat.congestionPercentage > 90;
              const isWarning = stat.congestionPercentage > 80 && stat.congestionPercentage <= 90;
              
              const statusText = isDanger ? 'text-[#c0392b]' : isWarning ? 'text-[#b7791f]' : 'text-[#1e7e34]';
              const statusLabel = isDanger ? 'High' : isWarning ? 'Elevated' : 'Normal';

              return (
                <tr 
                  key={stat.id} 
                  className={index % 2 === 0 ? 'bg-white' : 'bg-[#f8fafc]'}
                >
                  <td className="px-3 py-2 font-medium text-[#1a1a1a] text-[13px] border-r border-[#d7dce6]">
                    {stat.id.toUpperCase()}
                  </td>
                  <td className="px-3 py-2 border-r border-[#d7dce6]">
                    <a href="#" className="text-[#0b3d91] underline hover:text-[#14307a] text-[13px]">
                      {stat.zoneName}
                    </a>
                  </td>
                  <td className="px-3 py-2 text-right text-[#1a1a1a] text-[13px] font-medium tabular-nums border-r border-[#d7dce6]">
                    {stat.totalTrips.toLocaleString()}
                  </td>
                  <td className="px-3 py-2 text-right text-[#1a1a1a] text-[13px] font-medium tabular-nums border-r border-[#d7dce6]">
                    {stat.avgDistanceKm.toFixed(1)}
                  </td>
                  <td className="px-3 py-2 text-center">
                    <span className={`text-[12px] font-bold ${statusText}`}>
                      {stat.congestionPercentage}% ({statusLabel})
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ZoneStatisticsTable;
