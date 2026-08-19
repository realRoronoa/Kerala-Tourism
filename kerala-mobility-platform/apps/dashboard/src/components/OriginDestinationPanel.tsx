import React from 'react';
import { MOCK_OD_PAIRS } from '../data/mockDashboardData';

const OriginDestinationPanel: React.FC = () => {
  const data = MOCK_OD_PAIRS;

  return (
    <div className="font-sans">
      <div className="mb-3">
        <h3 className="text-[16px] font-bold text-[#0a1a4a] m-0 border-l-[3px] border-[#FF9933] pl-2 leading-tight">
          Top Origin-Destination Flows
        </h3>
        <p className="text-[12px] text-[#5a5f6d] mt-1 pl-3 m-0">Inter-district mobility volume (Daily Average)</p>
      </div>

      <div className="bg-white border border-[#d7dce6] overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[500px]">
          <thead>
            <tr className="bg-[#0a1a4a]">
              <th scope="col" className="px-3 py-2 font-semibold text-[12px] text-white border-r border-[#ffffff]/20 w-16">Rank</th>
              <th scope="col" className="px-3 py-2 font-semibold text-[12px] text-white border-r border-[#ffffff]/20">Route</th>
              <th scope="col" className="text-right px-3 py-2 font-semibold text-[12px] text-white w-32">Daily Vol.</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#d7dce6]">
            {data.map((pair, index) => (
              <tr key={pair.id || index} className={index % 2 === 0 ? 'bg-white' : 'bg-[#f8fafc]'}>
                <td className="px-3 py-2 text-[13px] text-[#1a1a1a] font-semibold border-r border-[#d7dce6]">
                  #{index + 1}
                </td>
                <td className="px-3 py-2 text-[13px] text-[#0b3d91] underline hover:text-[#14307a] cursor-pointer border-r border-[#d7dce6]">
                  {pair.origin} → {pair.destination}
                </td>
                <td className="px-3 py-2 text-[13px] text-[#1a1a1a] font-medium text-right tabular-nums">
                  {pair.volume.toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OriginDestinationPanel;
