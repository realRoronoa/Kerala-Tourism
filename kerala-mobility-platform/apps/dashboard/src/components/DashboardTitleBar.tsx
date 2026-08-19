import React from 'react';

const DashboardTitleBar: React.FC = () => {
  return (
    <div className="font-sans mb-6 border-b border-[#d7dce6] pb-4">
      {/* Breadcrumb */}
      <div className="text-[12px] text-[#5a5f6d] mb-2 font-medium">
        <a href="#" className="text-[#0b3d91] hover:underline">Home</a> &gt; <span>Data Repository</span>
      </div>

      <div className="flex flex-col md:flex-row md:items-end justify-between gap-3 mt-4">
        <div>
          <h2 className="text-[22px] font-bold text-[#0a1a4a] m-0 leading-tight">
            Mobility Intelligence Dashboard
          </h2>
        </div>
        <div className="text-[12px] text-[#5a5f6d] text-left md:text-right">
          <div><strong>Data Source:</strong> Live Sensor Network &amp; GTFS Feeds</div>
          <div className="mt-1"><strong>Last Updated:</strong> {new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</div>
        </div>
      </div>
    </div>
  );
};

export default DashboardTitleBar;
