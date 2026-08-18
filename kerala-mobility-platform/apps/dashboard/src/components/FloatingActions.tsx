import React, { useState, useEffect } from 'react';
import { ChevronUp } from 'lucide-react';

const FloatingActions: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 500) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <div className={`fixed bottom-6 right-6 flex flex-col gap-3 z-50 transition-opacity duration-300 ${isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
      {/* Accessibility button removed as requested */}
      <button 
        onClick={scrollToTop}
        className="w-12 h-12 rounded-full bg-white text-natpac-primary border border-gray-200 shadow-lg flex items-center justify-center hover:bg-gray-100 hover:-translate-y-1 transition-all group"
        aria-label="Scroll to top"
      >
        <ChevronUp className="w-6 h-6 group-hover:scale-110 transition-transform" />
      </button>
    </div>
  );
};

export default FloatingActions;
