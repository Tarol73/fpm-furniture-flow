import React, { useEffect } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Factory, Users, FileText, Search, BarChart4, Truck } from 'lucide-react';
import ContactDialog from '@/components/contact/ContactDialog';

const AboutPage = () => {
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

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      {/* Hero section */}
      <section className="pt-28 pb-16 md:pt-40 md:pb-20 bg-fpm-blue text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-light mb-6 animate-on-scroll">О компании</h1>
            <p className="text-xl md:text-2xl font-light leading-relaxed animate-on-scroll">
              FPM – профессиональный интегратор процессов оснащения коммерческих пространств.
            </p>
          </div>
        </div>
      </section>
      
      {/* About intro */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-lg text-gray-700 leading-relaxed mb-6 animate-on-scroll">
                Мы специализируемся на управлении проектами для генеральных подрядчиков, архитекторов, дизайнеров и производителей мебели, превращая разрозненные этапы в слаженную систему. Наша цель — обеспечить безупречное исполнение проектов: от концепции до финальной приемки, с сохранением сроков, бюджета и качества.
              </p>
              <div className="flex items-center space-x-6 animate-on-scroll">
                <div className="w-16 h-1 bg-fpm-teal"></div>
                <span className="text-fpm-teal font-medium">Ваш надежный партнер</span>
              </div>
            </div>
            <div className="animate-on-scroll">
              <img 
                src="/lovable-uploads/141b5a58-6139-43d8-a533-792a3b3866b9.png" 
                alt="FPM управление проектами" 
                className="rounded-lg shadow-lg w-full h-auto"
              />
            </div>
          </div>
        </div>
      </section>
      
      {/* Key functions */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-light text-center mb-16 animate-on-scroll">Ключевые функции FPM</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Function 1 */}
            <div className="bg-white p-8 rounded-lg shadow-md hover-lift animate-on-scroll">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 rounded-full bg-fpm-teal/10 flex items-center justify-center mr-4">
                  <Search className="w-6 h-6 text-fpm-teal" />
                </div>
                <h3 className="text-xl font-medium">Поиск и подбор производителей</h3>
              </div>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start">
                  <span className="text-fpm-teal mr-2">•</span>
                  <p>Используем собственную базу проверенных поставщиков мебели, дверей, стеновых панелей в различных ценовых сегментах.</p>
                </li>
                <li className="flex items-start">
                  <span className="text-fpm-teal mr-2">•</span>
                  <p>Оперативно подбираем партнеров, соответствующих требованиям проекта по качеству, срокам и бюджету, исключая недобросовестных подрядчиков.</p>
                </li>
              </ul>
            </div>
            
            {/* Function 2 */}
            <div className="bg-white p-8 rounded-lg shadow-md hover-lift animate-on-scroll">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 rounded-full bg-fpm-teal/10 flex items-center justify-center mr-4">
                  <Users className="w-6 h-6 text-fpm-teal" />
                </div>
                <h3 className="text-xl font-medium">Организация взаимодействия</h3>
              </div>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start">
                  <span className="text-fpm-teal mr-2">•</span>
                  <p>Выстраиваем прозрачную коммуникацию между заказчиками, архитекторами, дизайнерами и производителями, устраняя «разрывы» в цепочке.</p>
                </li>
                <li className="flex items-start">
                  <span className="text-fpm-teal mr-2">•</span>
                  <p>Минимизируем риски конфликтов и недопонимания за счет четкого распределения задач и контроля исполнения.</p>
                </li>
              </ul>
            </div>
            
            {/* Function 3 */}
            <div className="bg-white p-8 rounded-lg shadow-md hover-lift animate-on-scroll">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 rounded-full bg-fpm-teal/10 flex items-center justify-center mr-4">
                  <FileText className="w-6 h-6 text-fpm-teal" />
                </div>
                <h3 className="text-xl font-medium">Координация документации</h3>
              </div>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start">
                  <span className="text-fpm-teal mr-2">•</span>
                  <p>Согласовываем техническое задание и конструкторские чертежи, обеспечивая их соответствие проектным требованиям.</p>
                </li>
                <li className="flex items-start">
                  <span className="text-fpm-teal mr-2">•</span>
                  <p>Контролируем точность исполнения на каждом этапе: от дизайн-концепции до рабочих документов.</p>
                </li>
              </ul>
            </div>
            
            {/* Function 4 */}
            <div className="bg-white p-8 rounded-lg shadow-md hover-lift animate-on-scroll">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 rounded-full bg-fpm-teal/10 flex items-center justify-center mr-4">
                  <BarChart4 className="w-6 h-6 text-fpm-teal" />
                </div>
                <h3 className="text-xl font-medium">Аудит производств</h3>
              </div>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start">
                  <span className="text-fpm-teal mr-2">•</span>
                  <p>Проводим регулярные проверки производственных мощностей, оценивая их технологические возможности.</p>
                </li>
                <li className="flex items-start">
                  <span className="text-fpm-teal mr-2">•</span>
                  <p>Гарантируем, что партнеры из нашей базы соответствуют высоким стандартам надежности.</p>
                </li>
              </ul>
            </div>
            
            {/* Function 5 */}
            <div className="bg-white p-8 rounded-lg shadow-md hover-lift animate-on-scroll">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 rounded-full bg-fpm-teal/10 flex items-center justify-center mr-4">
                  <Truck className="w-6 h-6 text-fpm-teal" />
                </div>
                <h3 className="text-xl font-medium">Контроль логистики и сборки</h3>
              </div>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start">
                  <span className="text-fpm-teal mr-2">•</span>
                  <p>Координируем сроки поставки, отслеживаем сборку на объекте, оперативно решаем вопросы с браком.</p>
                </li>
                <li className="flex items-start">
                  <span className="text-fpm-teal mr-2">•</span>
                  <p>Проводим финальную проверку по качеству и количеству, защищая интересы всех участников проекта.</p>
                </li>
              </ul>
            </div>
            
            {/* Function 6 - placeholder for grid balance */}
            <div className="bg-white p-8 rounded-lg shadow-md hover-lift animate-on-scroll">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 rounded-full bg-fpm-teal/10 flex items-center justify-center mr-4">
                  <Factory className="w-6 h-6 text-fpm-teal" />
                </div>
                <h3 className="text-xl font-medium">Синергия участников</h3>
              </div>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start">
                  <span className="text-fpm-teal mr-2">•</span>
                  <p>Объединяем интересы всех сторон, превращая оснащение пространств в предсказуемый процесс.</p>
                </li>
                <li className="flex items-start">
                  <span className="text-fpm-teal mr-2">•</span>
                  <p>Наша экспертиза — в умении видеть проект целиком, закрывая «слепые зоны» там, где другие теряют время и бюджет.</p>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
      
      {/* For whom section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-light text-center mb-16 animate-on-scroll">Почему FPM — критически важное звено для всех сторон?</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* For contractors - Changed from numbered list to bullet points */}
            <div className="bg-gray-50 p-8 rounded-lg animate-on-scroll">
              <h3 className="text-2xl font-light text-fpm-blue mb-6">Для генеральных подрядчиков</h3>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <span className="text-fpm-teal mr-2">•</span>
                  <p className="text-gray-700">Снижение операционной нагрузки: Берем на себя управление мебельным оснащением — от поиска фабрик до приемки, что сокращает простои и риски срыва сроков.</p>
                </li>
                <li className="flex items-start">
                  <span className="text-fpm-teal mr-2">•</span>
                  <p className="text-gray-700">Финансовая прозрачность: Исключаем переплаты за счет аудита производств и жесткого контроля бюджета.</p>
                </li>
              </ul>
            </div>
            
            {/* For architects - Changed from numbered list to bullet points */}
            <div className="bg-gray-50 p-8 rounded-lg animate-on-scroll">
              <h3 className="text-2xl font-light text-fpm-blue mb-6">Для архитекторов и дизайнеров</h3>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <span className="text-fpm-teal mr-2">•</span>
                  <p className="text-gray-700">Реализация амбициозных идей: Подбираем фабрики, способные воплотить сложные дизайн-решения (нестандартная мебель, авторские панели).</p>
                </li>
                <li className="flex items-start">
                  <span className="text-fpm-teal mr-2">•</span>
                  <p className="text-gray-700">Техническая поддержка: Помогаем адаптировать креатив к производственным возможностям и нормам, сохраняя эстетику и функциональность.</p>
                </li>
              </ul>
            </div>
            
            {/* For manufacturers - Changed from numbered list to bullet points */}
            <div className="bg-gray-50 p-8 rounded-lg animate-on-scroll">
              <h3 className="text-2xl font-light text-fpm-blue mb-6">Для производителей мебели</h3>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <span className="text-fpm-teal mr-2">•</span>
                  <p className="text-gray-700">Доступ к крупным проектам: Становимся их «окном» в сегмент коммерческих заказов, где требуется не только продукт, но и управленческая экспертиза.</p>
                </li>
                <li className="flex items-start">
                  <span className="text-fpm-teal mr-2">•</span>
                  <p className="text-gray-700">Четкие требования: Структурируем ТЗ заказчиков, сокращая количество ошибок и доработок.</p>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
      
      {/* Conclusion */}
      <section className="py-16 md:py-24 bg-fpm-blue text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center animate-on-scroll">
            <h2 className="text-3xl md:text-4xl font-light mb-8">FPM — это гарантия синергии между креативом, технологиями и логистикой.</h2>
            <p className="text-lg leading-relaxed mb-8">
              Мы объединяем интересы всех сторон, превращая оснащение пространств в предсказуемый и управляемый процесс. Наша экспертиза — в умении видеть проект целиком, закрывая «слепые зоны» там, где другие теряют время и бюджет.
            </p>
            <div className="inline-block">
              <button className="inline-block px-8 py-3 bg-fpm-teal text-white rounded-md hover:bg-fpm-teal/90 transition-colors contact-btn">
                Обсудить ваш проект
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

export default AboutPage;
