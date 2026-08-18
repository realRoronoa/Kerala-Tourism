import React from 'react';

const DashboardTitleBar: React.FC = () => {
  return (
    <div className="bg-gov-blue-secondary text-white py-6 px-8 md:px-12 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-md">
      <div>
        <h2 className="text-xl font-medium tracking-wide">Mobility Intelligence Dashboard — Kerala</h2>
        <p className="text-sm text-blue-200 mt-1">
          Last Updated: {new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })} 
          <span className="mx-2">|</span> 
          Data Source: Live Sensor Network & GTFS Feeds
        </p>
      </div>

    </div>
  );
};

export default DashboardTitleBar;
