import React from 'react';

const LogoHeader: React.FC = () => {
  return (
    <header className="bg-white px-8 md:px-12 py-6 flex flex-col md:flex-row items-center justify-between gap-6 border-b-4 border-gov-blue-primary">
      {/* Left side: Emblems and Title */}
      <div className="flex items-center gap-6">
        {/* Placeholder for State Emblem & Kerala Govt Logo */}
        <div className="flex gap-4 items-center">
          <img 
            src="/emblem-india.svg" 
            alt="State Emblem of India" 
            className="h-20 w-auto object-contain"
          />
          <img 
            src="/kerala-logo.png" 
            alt="Kerala Government Logo" 
            className="h-20 w-auto object-contain"
          />
        </div>
        <div className="flex flex-col border-l-2 border-gray-200 pl-6">
          <h1 className="text-2xl md:text-3xl font-medium text-gov-blue-primary uppercase tracking-tight">
            National Transportation Planning and Research Centre
          </h1>
          <h2 className="text-lg md:text-xl font-medium text-gray-700 mt-1">
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
