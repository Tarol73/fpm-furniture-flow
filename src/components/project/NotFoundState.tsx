
import React from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const NotFoundState = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <Link to="/projects" className="inline-flex items-center text-fpm-teal hover:text-fpm-teal/80 transition-colors mb-6">
              <ArrowLeft className="mr-2 h-4 w-4" />
              <span>Вернуться ко всем проектам</span>
            </Link>
          </div>
          <h1 className="text-4xl md:text-5xl font-light text-fpm-blue mb-8">Проект не найден</h1>
          <p>Запрашиваемый проект не существует или был удален.</p>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default NotFoundState;
