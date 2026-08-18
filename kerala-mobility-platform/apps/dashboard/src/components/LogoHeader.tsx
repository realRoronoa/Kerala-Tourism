import React from 'react';

const LogoHeader: React.FC = () => {
  return (
    <header className="bg-natpac-lightBg px-4 md:px-12 py-4 md:py-8 flex flex-col md:flex-row items-center justify-between gap-6 border-b border-gray-200">
      
      {/* Left side: Project Logo Placeholder */}
      <div className="flex items-center gap-3 shrink-0">
        <div className="w-16 h-16 md:w-20 md:h-20 bg-white rounded-full shadow flex items-center justify-center border-2 border-natpac-primary">
          <span className="text-natpac-primary font-bold text-xs text-center leading-tight">PROJECT<br/>LOGO</span>
        </div>
      </div>

      {/* Center: Title Block */}
      <div className="flex flex-col items-center text-center flex-1 min-w-0">
        <h1 className="text-lg sm:text-xl md:text-3xl font-bold text-natpac-primary uppercase tracking-tight leading-tight">
          National Transportation Planning and Research Centre
        </h1>
        <h2 className="text-xs sm:text-sm md:text-lg font-medium text-gray-700 mt-1 uppercase tracking-widest">
          NATPAC — Mobility Intelligence Platform
        </h2>
        <p className="text-[10px] sm:text-xs text-gray-500 mt-1 max-w-2xl">
          An Institution of Kerala State Council for Science, Technology and Environment (KSCSTE)
        </p>
      </div>

      {/* Right side: Optional Emblem Placeholder */}
      <div className="flex flex-col items-end gap-1 md:gap-2 text-right shrink-0 hidden lg:flex">
        <div className="w-16 h-16 md:w-20 md:h-20 bg-white rounded-full shadow flex items-center justify-center border-2 border-natpac-secondary">
          <span className="text-natpac-secondary font-bold text-[10px] text-center leading-tight">EMBLEM<br/>HERE</span>
        </div>
      </div>

    </header>
  );
};

export default LogoHeader;
