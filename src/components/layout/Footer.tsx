
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Phone, Mail, MapPin } from 'lucide-react';

const Footer = () => {
  const navigate = useNavigate();

  // Function to navigate to services page and scroll to specific section
  const handleServiceClick = (sectionId: string) => {
    navigate('/services');
    
    // Use setTimeout to ensure navigation completes before scrolling
    setTimeout(() => {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  // Function to navigate to home and scroll to top
  const handleHomeClick = () => {
    navigate('/');
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  // Function to handle navigation and scroll to top
  const handleNavigate = (path: string) => {
    navigate(path);
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <footer className="bg-fpm-blue text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <button 
              onClick={handleHomeClick}
              className="flex items-center text-white hover:text-gray-200 transition-colors"
            >
              <h3 className="text-2xl font-light">FPM</h3>
            </button>
            <p className="mt-4 text-sm text-gray-300 font-light">
              Профессиональное управление проектами мебельного оснащения коммерческих пространств
            </p>
          </div>

          <div className="md:col-span-1">
            <h4 className="text-lg font-light mb-4">Заказчикам</h4>
            <ul className="space-y-2">
              <li>
                <button 
                  onClick={() => handleServiceClick('analysis')} 
                  className="text-sm text-gray-300 hover:text-white transition-colors font-light"
                >
                  Анализ проекта
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleServiceClick('manufacturers')} 
                  className="text-sm text-gray-300 hover:text-white transition-colors font-light"
                >
                  Подбор производителей
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleServiceClick('control')} 
                  className="text-sm text-gray-300 hover:text-white transition-colors font-light"
                >
                  Контроль производства
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleServiceClick('logistics')} 
                  className="text-sm text-gray-300 hover:text-white transition-colors font-light"
                >
                  Логистика и сборка
                </button>
              </li>
            </ul>
          </div>

          <div className="md:col-span-1">
            <h4 className="text-lg font-light mb-4">Навигация</h4>
            <ul className="space-y-2">
              <li><button onClick={() => handleNavigate('/')} className="text-sm text-gray-300 hover:text-white transition-colors font-light">Главная</button></li>
              <li><button onClick={() => handleNavigate('/services')} className="text-sm text-gray-300 hover:text-white transition-colors font-light">Заказчикам</button></li>
              <li><button onClick={() => handleNavigate('/partners')} className="text-sm text-gray-300 hover:text-white transition-colors font-light">Партнерам</button></li>
              <li><button onClick={() => handleNavigate('/projects')} className="text-sm text-gray-300 hover:text-white transition-colors font-light">Кейсы</button></li>
              <li><button onClick={() => handleNavigate('/about')} className="text-sm text-gray-300 hover:text-white transition-colors font-light">О компании</button></li>
              <li><button onClick={() => handleNavigate('/contact')} className="text-sm text-gray-300 hover:text-white transition-colors font-light">Контакты</button></li>
            </ul>
          </div>

          <div className="md:col-span-1">
            <h4 className="text-lg font-light mb-4">Свяжитесь с нами</h4>
            <ul className="space-y-4">
              <li className="flex items-start">
                <Phone size={18} className="mr-2 mt-1 text-fpm-orange" />
                <span className="text-sm font-light">+7 (916) 555-58-55</span>
              </li>
              <li className="flex items-start">
                <a href="mailto:info@f-p-m.group" className="flex items-start hover:text-gray-200 transition-colors">
                  <Mail size={18} className="mr-2 mt-1 text-fpm-orange" />
                  <span className="text-sm font-light">info@f-p-m.group</span>
                </a>
              </li>
              <li className="flex items-start">
                <MapPin size={18} className="mr-2 mt-1 text-fpm-orange" />
                <span className="text-sm font-light">Москва, ул. Дыбенко, д. 7/1, офис 460</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-gray-700 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-gray-400 font-light">© 2024 FPM Furniture Project Management. Все права защищены.</p>
          <div className="mt-4 md:mt-0">
            <ul className="flex space-x-4">
              <li>
                <a href="#" className="text-sm text-gray-400 hover:text-white transition-colors font-light">Политика конфиденциальности</a>
              </li>
              <li>
                <a href="#" className="text-sm text-gray-400 hover:text-white transition-colors font-light">Условия использования</a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
