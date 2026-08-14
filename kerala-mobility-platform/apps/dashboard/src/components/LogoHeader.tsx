import React from 'react';

const LogoHeader: React.FC = () => {
  return (
    <header className="bg-white px-2 sm:px-4 md:px-12 py-3 md:py-6 flex flex-row items-center justify-between gap-2 md:gap-6 border-b-4 border-gov-blue-primary">
      
      {/* Left side: Emblems and Title */}
      <div className="flex flex-row items-center gap-2 md:gap-6 text-left flex-1 min-w-0">
        
        {/* Left Emblems */}
        <div className="flex gap-1.5 sm:gap-3 md:gap-4 items-center shrink-0">
          <img 
            src="/emblem-india.svg" 
            alt="State Emblem of India" 
            className="h-10 sm:h-12 md:h-20 w-auto object-contain"
          />
          <img 
            src="/kerala-logo.png" 
            alt="Kerala Government Logo" 
            className="h-10 sm:h-12 md:h-20 w-auto object-contain"
          />
        </div>
        
        {/* Title Block */}
        <div className="flex flex-col border-l-2 border-gray-200 pl-2 sm:pl-3 md:pl-6 flex-1 min-w-0">
          <h1 className="text-[9px] sm:text-xs md:text-3xl font-bold md:font-medium text-gov-blue-primary uppercase tracking-tight leading-tight truncate sm:whitespace-normal">
            National Transportation Planning <span className="hidden sm:inline">and Research Centre</span>
          </h1>
          <h2 className="text-[8px] sm:text-[10px] md:text-xl font-medium text-gray-700 mt-0.5 md:mt-1 truncate sm:whitespace-normal">
            NATPAC — Mobility Intelligence Platform
          </h2>
          <p className="text-[7px] sm:text-[9px] md:text-sm text-gray-500 mt-0.5 md:mt-1 hidden sm:block truncate md:whitespace-normal">
            An Institution of Kerala State Council for Science, Technology and Environment (KSCSTE)
          </p>
        </div>
      </div>

      {/* Right side: Operated By & KSCSTE Logo */}
      <div className="flex flex-col items-end gap-1 md:gap-2 text-right shrink-0">
        <span className="text-[8px] md:text-sm font-medium text-gray-500 uppercase hidden md:block">Operated By</span>
        <div className="flex items-center gap-1.5 md:gap-4">
          <div className="flex flex-col items-end hidden lg:flex">
            <span className="font-semibold text-gov-blue-primary">KSCSTE</span>
            <span className="font-semibold text-gov-blue-secondary">NATPAC</span>
          </div>
          <div className="flex">
            <img 
              src="/kscste-logo.jpg" 
              alt="KSCSTE Logo" 
              className="h-10 sm:h-12 md:h-14 w-auto object-contain"
            />
          </div>
        </div>
      </div>

    </header>
  );
};

export default LogoHeader;
