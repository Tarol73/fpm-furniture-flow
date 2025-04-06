
import React, { useEffect } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Search, Users, FileText, BarChart4, Truck, Factory, Check } from 'lucide-react';
import ContactDialog from '@/components/contact/ContactDialog';

const Services = () => {
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
            <h1 className="text-4xl md:text-5xl font-light mb-6 animate-on-scroll">Для наших будущих Заказчиков</h1>
            <p className="text-xl md:text-2xl font-light leading-relaxed animate-on-scroll">
              Профессиональные решения для оснащения коммерческих пространств
            </p>
          </div>
        </div>
      </section>
      
      {/* Benefits for clients section - moved from Partners page */}
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
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            {/* Left column - Benefits for contractors */}
            <div className="bg-gray-50 p-8 rounded-lg animate-on-scroll">
              <h3 className="text-2xl font-light text-fpm-blue mb-6">Для генеральных подрядчиков</h3>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <div className="w-8 h-8 rounded-full bg-fpm-teal/10 flex items-center justify-center mr-3 mt-1">
                    <Check className="w-4 h-4 text-fpm-teal" />
                  </div>
                  <div>
                    <h4 className="font-medium text-fpm-blue">Снижение операционной нагрузки</h4>
                    <p className="text-gray-700">Мы берем на себя полное управление процессом мебельного оснащения — от поиска фабрик до приемки, что сокращает простои и риски срыва сроков.</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="w-8 h-8 rounded-full bg-fpm-teal/10 flex items-center justify-center mr-3 mt-1">
                    <Check className="w-4 h-4 text-fpm-teal" />
                  </div>
                  <div>
                    <h4 className="font-medium text-fpm-blue">Финансовая прозрачность</h4>
                    <p className="text-gray-700">Исключаем переплаты за счет тщательного аудита производств и жесткого контроля бюджета на всех этапах проекта.</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="w-8 h-8 rounded-full bg-fpm-teal/10 flex items-center justify-center mr-3 mt-1">
                    <Check className="w-4 h-4 text-fpm-teal" />
                  </div>
                  <div>
                    <h4 className="font-medium text-fpm-blue">Гарантия качества</h4>
                    <p className="text-gray-700">Контролируем качество на всех этапах производства и монтажа, минимизируя риски брака и последующих претензий.</p>
                  </div>
                </li>
              </ul>
            </div>
            
            {/* Right column - Benefits for designers */}
            <div className="bg-gray-50 p-8 rounded-lg animate-on-scroll">
              <h3 className="text-2xl font-light text-fpm-blue mb-6">Для архитекторов и дизайнеров</h3>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <div className="w-8 h-8 rounded-full bg-fpm-teal/10 flex items-center justify-center mr-3 mt-1">
                    <Check className="w-4 h-4 text-fpm-teal" />
                  </div>
                  <div>
                    <h4 className="font-medium text-fpm-blue">Реализация амбициозных идей</h4>
                    <p className="text-gray-700">Подбираем фабрики, способные воплотить сложные дизайн-решения, включая нестандартную мебель и авторские панели.</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="w-8 h-8 rounded-full bg-fpm-teal/10 flex items-center justify-center mr-3 mt-1">
                    <Check className="w-4 h-4 text-fpm-teal" />
                  </div>
                  <div>
                    <h4 className="font-medium text-fpm-blue">Техническая поддержка</h4>
                    <p className="text-gray-700">Помогаем адаптировать креативные идеи к производственным возможностям и техническим нормам, сохраняя эстетику и функциональность.</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="w-8 h-8 rounded-full bg-fpm-teal/10 flex items-center justify-center mr-3 mt-1">
                    <Check className="w-4 h-4 text-fpm-teal" />
                  </div>
                  <div>
                    <h4 className="font-medium text-fpm-blue">Защита дизайн-концепции</h4>
                    <p className="text-gray-700">Контролируем сохранение изначальной идеи дизайнера при адаптации к производственным требованиям.</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
      
      {/* Services Introduction */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-light mb-8 animate-on-scroll">Наш комплексный подход</h2>
            <p className="text-lg text-gray-700 leading-relaxed animate-on-scroll">
              FPM предлагает полный цикл услуг по управлению проектами оснащения коммерческих пространств. 
              Мы берем на себя все этапы — от анализа проектной документации и подбора производителей 
              до контроля монтажа и финальной приемки готовой мебели.
            </p>
          </div>
          
          {/* Main services grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Service 1 */}
            <div id="analysis" className="bg-white border border-gray-100 p-8 rounded-lg shadow-md hover-lift animate-on-scroll">
              <div className="w-16 h-16 rounded-full bg-fpm-teal/10 flex items-center justify-center mb-6">
                <Search className="w-8 h-8 text-fpm-teal" />
              </div>
              <h3 className="text-2xl font-light text-fpm-blue mb-4">Анализ проекта</h3>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start">
                  <span className="text-fpm-teal mr-2">•</span>
                  <p>Детальное изучение проектной документации, планировок и требований</p>
                </li>
                <li className="flex items-start">
                  <span className="text-fpm-teal mr-2">•</span>
                  <p>Выявление «узких мест» и потенциальных проблем на ранних этапах</p>
                </li>
                <li className="flex items-start">
                  <span className="text-fpm-teal mr-2">•</span>
                  <p>Составление оптимального плана реализации проекта</p>
                </li>
              </ul>
            </div>
            
            {/* Service 2 */}
            <div id="manufacturers" className="bg-white border border-gray-100 p-8 rounded-lg shadow-md hover-lift animate-on-scroll">
              <div className="w-16 h-16 rounded-full bg-fpm-teal/10 flex items-center justify-center mb-6">
                <Factory className="w-8 h-8 text-fpm-teal" />
              </div>
              <h3 className="text-2xl font-light text-fpm-blue mb-4">Подбор производителей</h3>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start">
                  <span className="text-fpm-teal mr-2">•</span>
                  <p>Формирование пула потенциальных производителей с учетом требований проекта</p>
                </li>
                <li className="flex items-start">
                  <span className="text-fpm-teal mr-2">•</span>
                  <p>Оценка возможностей фабрик по качеству, срокам и бюджету</p>
                </li>
                <li className="flex items-start">
                  <span className="text-fpm-teal mr-2">•</span>
                  <p>Организация тендера и помощь в выборе оптимального поставщика</p>
                </li>
              </ul>
            </div>
            
            {/* Service 3 */}
            <div className="bg-white border border-gray-100 p-8 rounded-lg shadow-md hover-lift animate-on-scroll">
              <div className="w-16 h-16 rounded-full bg-fpm-teal/10 flex items-center justify-center mb-6">
                <Users className="w-8 h-8 text-fpm-teal" />
              </div>
              <h3 className="text-2xl font-light text-fpm-blue mb-4">Координация взаимодействия</h3>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start">
                  <span className="text-fpm-teal mr-2">•</span>
                  <p>Организация эффективной коммуникации между всеми участниками проекта</p>
                </li>
                <li className="flex items-start">
                  <span className="text-fpm-teal mr-2">•</span>
                  <p>Ведение документооборота и протоколирование ключевых решений</p>
                </li>
                <li className="flex items-start">
                  <span className="text-fpm-teal mr-2">•</span>
                  <p>Оперативное решение спорных ситуаций и конфликтов интересов</p>
                </li>
              </ul>
            </div>
            
            {/* Service 4 */}
            <div className="bg-white border border-gray-100 p-8 rounded-lg shadow-md hover-lift animate-on-scroll">
              <div className="w-16 h-16 rounded-full bg-fpm-teal/10 flex items-center justify-center mb-6">
                <FileText className="w-8 h-8 text-fpm-teal" />
              </div>
              <h3 className="text-2xl font-light text-fpm-blue mb-4">Техническая документация</h3>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start">
                  <span className="text-fpm-teal mr-2">•</span>
                  <p>Разработка и согласование технических заданий с производителями</p>
                </li>
                <li className="flex items-start">
                  <span className="text-fpm-teal mr-2">•</span>
                  <p>Проверка и корректировка конструкторской документации</p>
                </li>
                <li className="flex items-start">
                  <span className="text-fpm-teal mr-2">•</span>
                  <p>Контроль соответствия производимой продукции утвержденным чертежам</p>
                </li>
              </ul>
            </div>
            
            {/* Service 5 */}
            <div id="control" className="bg-white border border-gray-100 p-8 rounded-lg shadow-md hover-lift animate-on-scroll">
              <div className="w-16 h-16 rounded-full bg-fpm-teal/10 flex items-center justify-center mb-6">
                <BarChart4 className="w-8 h-8 text-fpm-teal" />
              </div>
              <h3 className="text-2xl font-light text-fpm-blue mb-4">Контроль производства</h3>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start">
                  <span className="text-fpm-teal mr-2">•</span>
                  <p>Регулярные инспекции производства на разных этапах изготовления</p>
                </li>
                <li className="flex items-start">
                  <span className="text-fpm-teal mr-2">•</span>
                  <p>Проверка качества используемых материалов и фурнитуры</p>
                </li>
                <li className="flex items-start">
                  <span className="text-fpm-teal mr-2">•</span>
                  <p>Контроль соблюдения технологических процессов и сроков производства</p>
                </li>
              </ul>
            </div>
            
            {/* Service 6 */}
            <div id="logistics" className="bg-white border border-gray-100 p-8 rounded-lg shadow-md hover-lift animate-on-scroll">
              <div className="w-16 h-16 rounded-full bg-fpm-teal/10 flex items-center justify-center mb-6">
                <Truck className="w-8 h-8 text-fpm-teal" />
              </div>
              <h3 className="text-2xl font-light text-fpm-blue mb-4">Логистика и монтаж</h3>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start">
                  <span className="text-fpm-teal mr-2">•</span>
                  <p>Организация логистических процессов и контроль доставки</p>
                </li>
                <li className="flex items-start">
                  <span className="text-fpm-teal mr-2">•</span>
                  <p>Координация монтажных работ и согласование графиков с генподрядчиком</p>
                </li>
                <li className="flex items-start">
                  <span className="text-fpm-teal mr-2">•</span>
                  <p>Финальная приемка установленной мебели и оборудования</p>
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
            <h2 className="text-3xl md:text-4xl font-light mb-8">Готовы начать работу над вашим проектом?</h2>
            <p className="text-lg leading-relaxed mb-8">
              Свяжитесь с нами сегодня, чтобы обсудить ваши потребности и узнать, как мы можем помочь в реализации вашего проекта.
            </p>
            <div className="inline-block">
              <button className="inline-block px-8 py-3 bg-fpm-teal text-white rounded-md hover:bg-fpm-teal/90 transition-colors contact-btn">
                Обсудить проект
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

export default Services;
