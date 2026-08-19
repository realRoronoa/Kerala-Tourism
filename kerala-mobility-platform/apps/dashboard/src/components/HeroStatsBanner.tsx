import React from 'react';
import { MOCK_STATS } from '../data/mockDashboardData';

const HeroStatsBanner: React.FC = () => {
  return (
    <div className="font-sans mb-6">
      <div className="bg-[#f8fafc] border border-[#d7dce6]">
        <div className="bg-[#0a1a4a] px-4 py-2 border-b border-[#d7dce6]">
           <h3 className="text-[13px] font-semibold text-white m-0 tracking-wide uppercase">System Summary Statistics</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-[#d7dce6]">
          <div className="px-5 py-4">
            <div className="text-[12px] font-medium text-[#5a5f6d] mb-1">Total Processed Citizen Journeys</div>
            <div className="text-[18px] font-bold text-[#1a1a1a] tabular-nums">{MOCK_STATS[0].value}</div>
          </div>
          <div className="px-5 py-4">
            <div className="text-[12px] font-medium text-[#5a5f6d] mb-1">Verified Ground-Truth Trips</div>
            <div className="text-[18px] font-bold text-[#1a1a1a] tabular-nums">{MOCK_STATS[1].value}</div>
          </div>
          <div className="px-5 py-4">
            <div className="text-[12px] font-medium text-[#5a5f6d] mb-1">Ground-Truth Model Accuracy</div>
            <div className="text-[18px] font-bold text-[#1e7e34] tabular-nums">{MOCK_STATS[3].value}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroStatsBanner;
