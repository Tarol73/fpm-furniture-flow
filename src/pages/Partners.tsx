
import React, { useEffect } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Check, Users } from 'lucide-react';
import ContactDialog from '@/components/contact/ContactDialog';

const Partners = () => {
  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
    
    // Initialize animation on scroll
    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, { threshold: 0.1 });
    
    animatedElements.forEach(el => {
      observer.observe(el);
    });
    
    return () => {
      animatedElements.forEach(el => {
        observer.unobserve(el);
      });
    };
  }, []);

  // Initialize event listeners for contact buttons
  useEffect(() => {
    const contactButtons = document.querySelectorAll('.contact-btn');
    contactButtons.forEach(button => {
      button.addEventListener('click', () => {
        // Dispatch custom event to open dialog
        document.dispatchEvent(new CustomEvent('open-contact-dialog'));
      });
    });
    
    return () => {
      contactButtons.forEach(button => {
        button.removeEventListener('click', () => {});
      });
    };
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      {/* Hero section */}
      <section className="pt-28 pb-16 md:pt-40 md:pb-20 bg-fpm-blue text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-light mb-6 animate-on-scroll">Для наших будущих партнеров</h1>
            <p className="text-xl md:text-2xl font-light leading-relaxed animate-on-scroll">
              Совместная работа для создания совершенных коммерческих пространств
            </p>
          </div>
        </div>
      </section>
      
      {/* Benefits section - only show manufacturer benefits */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-light mb-8 animate-on-scroll">Преимущества сотрудничества с FPM</h2>
            <p className="text-lg text-gray-700 leading-relaxed animate-on-scroll">
              Мы создаем эффективные процессы взаимодействия между заказчиками, архитекторами, 
              дизайнерами и производителями мебели. Работая с нами, вы получаете надежного партнера, 
              который гарантирует результат.
            </p>
          </div>
          
          {/* Benefits for manufacturers */}
          <div className="bg-gray-50 p-8 rounded-lg animate-on-scroll max-w-4xl mx-auto">
            <h3 className="text-2xl font-light text-fpm-blue mb-6">Для производителей мебели</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <ul className="space-y-4">
                <li className="flex items-start">
                  <div className="w-8 h-8 rounded-full bg-fpm-teal/10 flex items-center justify-center mr-3 mt-1">
                    <Check className="w-4 h-4 text-fpm-teal" />
                  </div>
                  <div>
                    <h4 className="font-medium text-fpm-blue">Доступ к крупным проектам</h4>
                    <p className="text-gray-700">Становимся вашим «окном» в сегмент коммерческих заказов, где требуется не только продукт, но и управленческая экспертиза.</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="w-8 h-8 rounded-full bg-fpm-teal/10 flex items-center justify-center mr-3 mt-1">
                    <Check className="w-4 h-4 text-fpm-teal" />
                  </div>
                  <div>
                    <h4 className="font-medium text-fpm-blue">Четкие требования</h4>
                    <p className="text-gray-700">Структурируем ТЗ заказчиков, сокращая количество ошибок, доработок и потенциальных конфликтов.</p>
                  </div>
                </li>
              </ul>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <div className="w-8 h-8 rounded-full bg-fpm-teal/10 flex items-center justify-center mr-3 mt-1">
                    <Check className="w-4 h-4 text-fpm-teal" />
                  </div>
                  <div>
                    <h4 className="font-medium text-fpm-blue">Прозрачная коммуникация</h4>
                    <p className="text-gray-700">Обеспечиваем четкую коммуникацию с заказчиком и своевременную обратную связь по всем вопросам.</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="w-8 h-8 rounded-full bg-fpm-teal/10 flex items-center justify-center mr-3 mt-1">
                    <Check className="w-4 h-4 text-fpm-teal" />
                  </div>
                  <div>
                    <h4 className="font-medium text-fpm-blue">Долгосрочное партнерство</h4>
                    <p className="text-gray-700">Развиваем долгосрочные отношения с надежными производителями, интегрируя их в наши будущие проекты.</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA section */}
      <section className="py-16 md:py-24 bg-fpm-blue text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center animate-on-scroll">
            <h2 className="text-3xl md:text-4xl font-light mb-8">Заинтересованы в сотрудничестве?</h2>
            <p className="text-lg leading-relaxed mb-8">
              Свяжитесь с нами, чтобы обсудить потенциальное партнерство и узнать, как мы можем 
              помочь в реализации вашего следующего проекта.
            </p>
            <div className="inline-block">
              <button className="inline-block px-8 py-3 bg-fpm-teal text-white rounded-md hover:bg-fpm-teal/90 transition-colors contact-btn">
                Обсудить сотрудничество
              </button>
            </div>
          </div>
        </div>
      </section>
      
      <Footer />
      <ContactDialog />
    </div>
  );
};

export default Partners;
