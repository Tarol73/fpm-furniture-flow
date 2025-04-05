
import React from 'react';
import { Button } from '@/components/ui/button';

const HeroSection = () => {
  return (
    <section className="relative h-screen flex items-center">
      {/* Background image */}
      <div className="absolute inset-0 bg-black/40 z-10"></div>
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ 
          backgroundImage: `url('https://images.unsplash.com/photo-1721322800607-8c38375eef04?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80')` 
        }}
      ></div>
      
      {/* Content */}
      <div className="container mx-auto px-4 relative z-20 text-white">
        <div className="flex flex-col max-w-3xl">
          <div className="flex items-center mb-8">
            <img 
              src="/lovable-uploads/c828dd8c-3f9c-4993-b8c4-56f44713a36a.png" 
              alt="FPM Logo" 
              className="h-16 md:h-24"
            />
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight animate-fade-in font-roboto">
            Профессиональное управление проектами мебельного оснащения коммерческих пространств
          </h1>
          <p className="mt-6 text-xl md:text-2xl text-gray-200 animate-fade-in font-roboto" style={{ animationDelay: '200ms' }}>
            От согласования ТЗ до финальной приемки — ваш проект в надежных руках
          </p>
          <div className="mt-8 flex flex-wrap gap-4 animate-fade-in" style={{ animationDelay: '400ms' }}>
            <Button size="lg" className="bg-fpm-purple hover:bg-fpm-purple/90 text-white font-medium">
              Обсудить проект
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="bg-transparent hover:bg-white/10 text-white border-white"
            >
              Узнать больше
            </Button>
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
