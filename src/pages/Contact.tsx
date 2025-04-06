
import React, { useEffect } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Phone, Mail, MapPin, Clock, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ContactDialog from '@/components/contact/ContactDialog';

const Contact = () => {
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
            <h1 className="text-4xl md:text-5xl font-light mb-6 animate-on-scroll">Контакты</h1>
            <p className="text-xl md:text-2xl font-light leading-relaxed animate-on-scroll">
              Свяжитесь с нами для обсуждения вашего проекта или сотрудничества
            </p>
          </div>
        </div>
      </section>

      {/* Contact info section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Contact info */}
            <div className="animate-on-scroll">
              <h2 className="text-3xl font-light text-fpm-blue mb-8">Наши контакты</h2>
              
              <div className="space-y-8">
                <div className="flex items-start">
                  <div className="w-12 h-12 rounded-full bg-fpm-teal/10 flex items-center justify-center mr-4">
                    <Phone className="w-6 h-6 text-fpm-teal" />
                  </div>
                  <div>
                    <h3 className="text-xl font-light mb-2">Телефон</h3>
                    <p className="text-lg text-gray-700">+7 (916) 555-58-55</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="w-12 h-12 rounded-full bg-fpm-teal/10 flex items-center justify-center mr-4">
                    <Mail className="w-6 h-6 text-fpm-teal" />
                  </div>
                  <div>
                    <h3 className="text-xl font-light mb-2">Email</h3>
                    <p className="text-lg text-gray-700">info@f-p-m.group</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="w-12 h-12 rounded-full bg-fpm-teal/10 flex items-center justify-center mr-4">
                    <MapPin className="w-6 h-6 text-fpm-teal" />
                  </div>
                  <div>
                    <h3 className="text-xl font-light mb-2">Адрес</h3>
                    <p className="text-lg text-gray-700">Москва, ул. Примерная, 123</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="w-12 h-12 rounded-full bg-fpm-teal/10 flex items-center justify-center mr-4">
                    <Clock className="w-6 h-6 text-fpm-teal" />
                  </div>
                  <div>
                    <h3 className="text-xl font-light mb-2">Режим работы</h3>
                    <p className="text-lg text-gray-700">Пн-Пт: 9:00 - 18:00</p>
                    <p className="text-lg text-gray-700">Сб-Вс: Выходной</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Contact form */}
            <div className="animate-on-scroll">
              <h2 className="text-3xl font-light text-fpm-blue mb-8">Напишите нам</h2>
              
              <div className="bg-gray-50 p-8 rounded-lg">
                <p className="text-lg text-gray-700 mb-6">
                  Заполните форму ниже, и мы свяжемся с вами в ближайшее время для обсуждения вашего проекта.
                </p>
                <Button className="bg-fpm-teal hover:bg-fpm-teal/90 text-white px-8 py-3 text-lg w-full contact-btn">
                  Заполнить форму
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Map section */}
      <section className="pb-16 md:pb-24">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-light text-fpm-blue mb-8 text-center animate-on-scroll">Мы на карте</h2>
          
          <div className="rounded-lg overflow-hidden shadow-lg h-[400px] animate-on-scroll">
            {/* Placeholder for map - in a real project, you would integrate Google Maps or similar */}
            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
              <div className="text-center">
                <MapPin className="w-16 h-16 text-fpm-teal mx-auto mb-4" />
                <p className="text-xl text-gray-700">Москва, ул. Примерная, 123</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA section */}
      <section className="py-16 md:py-24 bg-fpm-blue text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center animate-on-scroll">
            <div className="flex items-center justify-center mb-6">
              <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center">
                <Users className="w-8 h-8 text-white" />
              </div>
            </div>
            <h2 className="text-3xl md:text-4xl font-light mb-6">Готовы начать сотрудничество?</h2>
            <p className="text-xl leading-relaxed mb-8">
              Наша команда профессионалов готова помочь вам с проектом мебельного оснащения. 
              Свяжитесь с нами сегодня для консультации.
            </p>
            <Button className="bg-fpm-teal hover:bg-fpm-teal/90 text-white px-8 py-3 text-lg contact-btn">
              Обсудить проект
            </Button>
          </div>
        </div>
      </section>
      
      <Footer />
      <ContactDialog />
    </div>
  );
};

export default Contact;
