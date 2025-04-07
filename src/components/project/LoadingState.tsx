
import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const LoadingState = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center mb-8">
            <Link to="/projects" className="inline-flex items-center text-fpm-teal hover:text-fpm-teal/80 transition-colors mb-6">
              <ArrowLeft className="mr-2 h-4 w-4" />
              <span>Вернуться ко всем проектам</span>
            </Link>
          </div>
          <Skeleton className="h-12 w-3/4 mb-4" />
          <div className="flex flex-wrap gap-6 mb-8">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-6 w-32" />
          </div>
          <Skeleton className="h-[60vh] w-full mb-12 rounded-lg" />
          <Skeleton className="h-8 w-60 mb-6" />
          <div className="grid grid-cols-4 gap-4 mb-16">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-40 w-full rounded-md" />
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mb-16">
            <div className="lg:col-span-2">
              <Skeleton className="h-8 w-40 mb-4" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-3/4 mb-6" />
              <Skeleton className="h-[400px] w-full rounded-md" />
            </div>
            <div className="lg:col-span-1">
              <Skeleton className="h-[400px] w-full rounded-lg" />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default LoadingState;
