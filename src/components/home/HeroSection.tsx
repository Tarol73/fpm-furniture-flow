
import React from 'react';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';

const HeroSection = () => {
  const isMobile = useIsMobile();
  
  return (
    <section className="relative h-screen flex items-center">
      {/* Background image */}
      <div className="absolute inset-0 bg-black/40 z-10"></div>
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ 
          backgroundImage: `url('https://images.unsplash.com/photo-1564069114553-7215e1ff1890?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80')` 
        }}
      ></div>
      
      {/* Content */}
      <div className="container mx-auto px-4 relative z-20 text-white">
        <div className="flex flex-col max-w-3xl">
          {/* Logo text */}
          <div className="flex items-start mb-8">
            <div className="flex">
              <h1 className="text-6xl md:text-7xl lg:text-8xl font-normal tracking-tight text-white mr-4">
                FPM
              </h1>
              <div className="flex flex-col justify-between">
                <span className="text-sm md:text-lg lg:text-xl font-light tracking-wide">FURNITURE</span>
                <span className="text-sm md:text-lg lg:text-xl font-light tracking-wide">PROJECT</span>
                <span className="text-sm md:text-lg lg:text-xl font-light tracking-wide">MANAGEMENT</span>
              </div>
            </div>
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-light leading-tight animate-fade-in font-roboto">
            Профессиональное управление проектами мебельного оснащения коммерческих пространств
          </h1>
          <p className="mt-6 text-xl md:text-2xl text-gray-200 animate-fade-in font-roboto font-light" style={{ animationDelay: '200ms' }}>
            От согласования ТЗ до финальной приемки — ваш проект в надежных руках
          </p>
          <div className="mt-8 flex flex-wrap gap-4 animate-fade-in" style={{ animationDelay: '400ms' }}>
            <Button size="lg" className="bg-fpm-teal hover:bg-fpm-teal/90 text-white font-medium">
              Обсудить проект
            </Button>
            {!isMobile && (
              <Button 
                size="lg" 
                variant="outline" 
                className="bg-transparent hover:bg-white/10 text-white border-white"
              >
                Узнать больше
              </Button>
            )}
          </div>
        </div>
      </div>
      
      {/* Scroll indicator */}
      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-20 animate-bounce">
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          width="24" 
          height="24" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          className="text-white"
        >
          <path d="M12 5v14M5 12l7 7 7-7"/>
        </svg>
      </div>
    </section>
  );
};

export default HeroSection;
