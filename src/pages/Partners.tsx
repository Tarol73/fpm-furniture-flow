
import React from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

const Partners = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold text-fpm-blue mb-8">Для партнеров</h1>
          <p className="text-lg text-gray-600">
            Страница находится в разработке. Скоро здесь будет информация о партнерских программах.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Partners;
