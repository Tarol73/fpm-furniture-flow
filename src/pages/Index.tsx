
import React from 'react';
import HeroSection from '@/components/home/HeroSection';
import WhyFPMSection from '@/components/home/WhyFPMSection';
import ForWhomSection from '@/components/home/ForWhomSection';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        <HeroSection />
        <WhyFPMSection />
        <ForWhomSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
