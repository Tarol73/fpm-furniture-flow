
import React from 'react';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

interface ErrorStateProps {
  error: string;
}

const ErrorState = ({ error }: ErrorStateProps) => {
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
          <Alert variant="destructive" className="mb-6">
            <AlertTitle>Ошибка при загрузке проекта</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ErrorState;
