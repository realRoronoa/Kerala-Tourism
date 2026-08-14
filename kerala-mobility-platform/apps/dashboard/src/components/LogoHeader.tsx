import React from 'react';

const LogoHeader: React.FC = () => {
  return (
    <header className="bg-white px-4 md:px-12 py-4 md:py-6 flex flex-col md:flex-row items-center justify-between gap-4 md:gap-6 border-b-4 border-gov-blue-primary">
      {/* Left side: Emblems and Title */}
      <div className="flex flex-col md:flex-row items-center gap-4 md:gap-6 text-center md:text-left">
        {/* Placeholder for State Emblem & Kerala Govt Logo */}
        <div className="flex gap-4 sm:gap-6 items-center justify-center">
          <img 
            src="/emblem-india.svg" 
            alt="State Emblem of India" 
            className="h-12 sm:h-16 md:h-20 w-auto object-contain"
          />
          <img 
            src="/kerala-logo.png" 
            alt="Kerala Government Logo" 
            className="h-12 sm:h-16 md:h-20 w-auto object-contain"
          />
        </div>
        <div className="flex flex-col border-t-2 md:border-t-0 md:border-l-2 border-gray-200 pt-3 md:pt-0 pl-0 md:pl-6 w-full max-w-lg">
          <h1 className="text-xl md:text-3xl font-medium text-gov-blue-primary uppercase tracking-tight">
            National Transportation Planning and Research Centre
          </h1>
          <h2 className="text-base md:text-xl font-medium text-gray-700 mt-1">
            NATPAC — Mobility Intelligence Platform
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            An Institution of Kerala State Council for Science, Technology and Environment (KSCSTE)
          </p>
        </div>
      </div>

      {/* Right side: Operated By */}
      <div className="flex flex-col items-end gap-2 text-right hidden lg:flex">
        <span className="text-sm font-medium text-gray-500 uppercase">Operated By</span>
        <div className="flex items-center gap-4">
          <div className="flex flex-col items-end">
            <span className="font-semibold text-gov-blue-primary">KSCSTE</span>
            <span className="font-semibold text-gov-blue-secondary">NATPAC</span>
          </div>
          <div className="flex gap-2">
              <img 
                src="/kscste-logo.jpg" 
                alt="KSCSTE Logo" 
                className="h-14 w-auto object-contain"
              />
            </div>
        </div>
      </div>
    </header>
  );
};

export default LogoHeader;
