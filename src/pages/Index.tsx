
import React from 'react';
import HeroSection from '@/components/home/HeroSection';
import WhyFPMSection from '@/components/home/WhyFPMSection';
import ForWhomSection from '@/components/home/ForWhomSection';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import ContactDialog from '@/components/contact/ContactDialog';

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
      <ContactDialog />
    </div>
  );
};

export default Index;
