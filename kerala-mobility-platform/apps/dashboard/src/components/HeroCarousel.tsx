import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const slides = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?q=80&w=2070&auto=format&fit=crop', // Urban traffic
    title: 'Pioneering Mobility Intelligence',
    subtitle: 'Data-driven solutions for smarter, safer, and sustainable transportation across Kerala.'
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1464938050520-ef2270bb8ce8?q=80&w=2053&auto=format&fit=crop', // Highway/Bridge
    title: 'Advanced Transport Planning',
    subtitle: 'Integrating technology and research to shape the future of urban mobility.'
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?q=80&w=2069&auto=format&fit=crop', // Bus/Public transport
    title: 'Enhancing Public Transit',
    subtitle: 'Optimizing public transport systems to ensure equitable access and efficiency.'
  }
];

const HeroCarousel: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  // Auto-slide effect
  React.useEffect(() => {
    const slideInterval = setInterval(nextSlide, 4000); // 4 seconds
    return () => clearInterval(slideInterval);
  }, []);

  return (
    <div className="relative w-full h-[300px] md:h-[350px] lg:h-[400px] overflow-hidden bg-[#06142E]">
      {/* Slides */}
      <div className="w-full h-full relative">
        {slides.map((slide, index) => (
          <div 
            key={slide.id}
            className={`absolute inset-0 w-full h-full transition-opacity duration-700 ease-in-out ${index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
          >
            {/* Background Image */}
            <div 
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${slide.image})` }}
            >
              <div className="absolute inset-0 bg-[#06142E]/60 mix-blend-multiply"></div>
              <div className="absolute inset-0 bg-gradient-to-t from-natpac-primary/80 via-transparent to-transparent"></div>
            </div>

            {/* Content Container */}
            <div className="relative z-20 flex flex-col items-center justify-center h-full text-center px-12 md:px-24">
              <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold text-white mb-3 drop-shadow-lg tracking-tight">
                {slide.title}
              </h1>
              <p className="text-sm md:text-lg lg:text-xl text-gray-200 max-w-3xl drop-shadow-md">
                {slide.subtitle}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Controls */}
      <button 
        onClick={prevSlide}
        className="absolute left-0 top-1/2 -translate-y-1/2 z-30 bg-black/40 hover:bg-black/60 text-white p-3 md:p-4 transition-colors backdrop-blur-sm"
        aria-label="Previous Slide"
      >
        <ChevronLeft className="w-6 h-6 md:w-8 md:h-8" />
      </button>

      <button 
        onClick={nextSlide}
        className="absolute right-0 top-1/2 -translate-y-1/2 z-30 bg-black/40 hover:bg-black/60 text-white p-3 md:p-4 transition-colors backdrop-blur-sm"
        aria-label="Next Slide"
      >
        <ChevronRight className="w-6 h-6 md:w-8 md:h-8" />
      </button>

      {/* Slide Indicators */}
      <div className="absolute bottom-16 md:bottom-24 left-1/2 -translate-x-1/2 z-30 flex gap-3">
        {slides.map((_, idx) => (
          <button 
            key={idx}
            onClick={() => setCurrentSlide(idx)}
            className={`w-3 h-3 rounded-full transition-all ${idx === currentSlide ? 'bg-natpac-accent w-8' : 'bg-white/50 hover:bg-white'}`}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>

      {/* Bottom SVG Wave */}
      <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-[0] z-30 transform translate-y-[1px]">
        {/* translate-y ensures no 1px gap line appears at the bottom on certain zoom levels */}
        <svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none" className="relative block w-full h-[40px] md:h-[60px] lg:h-[80px]">
          <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V95.8C59.71,118.08,130.83,115.46,192.5,98.6,238.16,86.07,281.94,70.21,321.39,56.44Z" className="fill-[#f8fafc]"></path>
        </svg>
      </div>
    </div>
  );
};

export default HeroCarousel;
