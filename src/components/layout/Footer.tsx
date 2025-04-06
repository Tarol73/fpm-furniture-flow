
import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-fpm-blue text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <Link to="/" className="flex items-center">
              <h3 className="text-2xl font-bold">FPM</h3>
            </Link>
            <p className="mt-4 text-sm text-gray-300">
              Профессиональное управление проектами мебельного оснащения коммерческих пространств
            </p>
          </div>

          <div className="md:col-span-1">
            <h4 className="text-lg font-semibold mb-4">Услуги</h4>
            <ul className="space-y-2">
              <li><Link to="/services" className="text-sm text-gray-300 hover:text-white transition-colors">Анализ проекта</Link></li>
              <li><Link to="/services" className="text-sm text-gray-300 hover:text-white transition-colors">Подбор производителей</Link></li>
              <li><Link to="/services" className="text-sm text-gray-300 hover:text-white transition-colors">Контроль производства</Link></li>
              <li><Link to="/services" className="text-sm text-gray-300 hover:text-white transition-colors">Логистика и сборка</Link></li>
            </ul>
          </div>

          <div className="md:col-span-1">
            <h4 className="text-lg font-semibold mb-4">Навигация</h4>
            <ul className="space-y-2">
              <li><Link to="/" className="text-sm text-gray-300 hover:text-white transition-colors">Главная</Link></li>
              <li><Link to="/projects" className="text-sm text-gray-300 hover:text-white transition-colors">Кейсы</Link></li>
              <li><Link to="/partners" className="text-sm text-gray-300 hover:text-white transition-colors">Для партнеров</Link></li>
              <li><Link to="/about" className="text-sm text-gray-300 hover:text-white transition-colors">О компании</Link></li>
              <li><Link to="/contact" className="text-sm text-gray-300 hover:text-white transition-colors">Контакты</Link></li>
            </ul>
          </div>

          <div className="md:col-span-1">
            <h4 className="text-lg font-semibold mb-4">Свяжитесь с нами</h4>
            <ul className="space-y-4">
              <li className="flex items-start">
                <Phone size={18} className="mr-2 mt-1 text-fpm-orange" />
                <span className="text-sm">+7 (916) 555-58-55</span>
              </li>
              <li className="flex items-start">
                <Mail size={18} className="mr-2 mt-1 text-fpm-orange" />
                <span className="text-sm">info@f-p-m.group</span>
              </li>
              <li className="flex items-start">
                <MapPin size={18} className="mr-2 mt-1 text-fpm-orange" />
                <span className="text-sm">Москва, ул. Примерная, 123</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-gray-700 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-gray-400">© 2024 FPM Furniture Project Management. Все права защищены.</p>
          <div className="mt-4 md:mt-0">
            <ul className="flex space-x-4">
              <li>
                <a href="#" className="text-sm text-gray-400 hover:text-white transition-colors">Политика конфиденциальности</a>
              </li>
              <li>
                <a href="#" className="text-sm text-gray-400 hover:text-white transition-colors">Условия использования</a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
