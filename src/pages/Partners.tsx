
import React, { useEffect } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Check, Users, BarChart4, Truck, Clock } from 'lucide-react';
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
            <h1 className="text-4xl md:text-5xl font-light mb-6 animate-on-scroll">Для подрядчиков</h1>
            <p className="text-xl md:text-2xl font-light leading-relaxed animate-on-scroll">
              Совместная работа для создания совершенных коммерческих пространств
            </p>
          </div>
        </div>
      </section>
      
      {/* Benefits section */}
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
      
      {/* How we work section */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-light mb-8 animate-on-scroll">Как мы работаем</h2>
            <p className="text-lg text-gray-700 leading-relaxed animate-on-scroll">
              Наш подход основан на четкой методологии, которая обеспечивает прозрачность процесса 
              и гарантирует достижение поставленных целей в рамках бюджета и сроков.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {/* Step 1 */}
            <div className="bg-white p-8 rounded-lg shadow-md hover-lift animate-on-scroll">
              <div className="w-16 h-16 rounded-full bg-fpm-teal/10 flex items-center justify-center mb-6">
                <Users className="w-8 h-8 text-fpm-teal" />
              </div>
              <h3 className="text-2xl font-light text-fpm-blue mb-4">1. Анализ и планирование</h3>
              <p className="text-gray-700 mb-4">
                Детальный анализ проекта, формирование требований и разработка стратегии реализации.
              </p>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start">
                  <span className="text-fpm-teal mr-2">•</span>
                  <p>Изучение проектной документации</p>
                </li>
                <li className="flex items-start">
                  <span className="text-fpm-teal mr-2">•</span>
                  <p>Определение ключевых этапов</p>
                </li>
                <li className="flex items-start">
                  <span className="text-fpm-teal mr-2">•</span>
                  <p>Формирование бюджета и графика</p>
                </li>
              </ul>
            </div>
            
            {/* Step 2 */}
            <div className="bg-white p-8 rounded-lg shadow-md hover-lift animate-on-scroll">
              <div className="w-16 h-16 rounded-full bg-fpm-teal/10 flex items-center justify-center mb-6">
                <BarChart4 className="w-8 h-8 text-fpm-teal" />
              </div>
              <h3 className="text-2xl font-light text-fpm-blue mb-4">2. Реализация и контроль</h3>
              <p className="text-gray-700 mb-4">
                Координация всех участников процесса и контроль качества на каждом этапе.
              </p>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start">
                  <span className="text-fpm-teal mr-2">•</span>
                  <p>Организация взаимодействия</p>
                </li>
                <li className="flex items-start">
                  <span className="text-fpm-teal mr-2">•</span>
                  <p>Контроль производства</p>
                </li>
                <li className="flex items-start">
                  <span className="text-fpm-teal mr-2">•</span>
                  <p>Управление изменениями</p>
                </li>
              </ul>
            </div>
            
            {/* Step 3 */}
            <div className="bg-white p-8 rounded-lg shadow-md hover-lift animate-on-scroll">
              <div className="w-16 h-16 rounded-full bg-fpm-teal/10 flex items-center justify-center mb-6">
                <Truck className="w-8 h-8 text-fpm-teal" />
              </div>
              <h3 className="text-2xl font-light text-fpm-blue mb-4">3. Завершение и приемка</h3>
              <p className="text-gray-700 mb-4">
                Организация финальных этапов проекта и закрытие всех формальностей.
              </p>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start">
                  <span className="text-fpm-teal mr-2">•</span>
                  <p>Координация поставок и монтажа</p>
                </li>
                <li className="flex items-start">
                  <span className="text-fpm-teal mr-2">•</span>
                  <p>Контроль качества исполнения</p>
                </li>
                <li className="flex items-start">
                  <span className="text-fpm-teal mr-2">•</span>
                  <p>Финальная приемка и документация</p>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
      
      {/* Success Metrics */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-light mb-8 animate-on-scroll">Наши показатели эффективности</h2>
            <p className="text-lg text-gray-700 leading-relaxed animate-on-scroll">
              Успех проекта измеряется не только его завершением, но и качеством процессов, 
              которые ведут к этому результату.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Metric 1 */}
            <div className="bg-gray-50 p-8 rounded-lg text-center animate-on-scroll">
              <div className="w-20 h-20 rounded-full bg-fpm-teal/10 flex items-center justify-center mx-auto mb-6">
                <Clock className="w-10 h-10 text-fpm-teal" />
              </div>
              <div className="text-4xl font-light text-fpm-blue mb-2">98%</div>
              <h3 className="text-xl font-light mb-4">Своевременность</h3>
              <p className="text-gray-700">
                Наших проектов завершаются в срок или раньше запланированной даты
              </p>
            </div>
            
            {/* Metric 2 */}
            <div className="bg-gray-50 p-8 rounded-lg text-center animate-on-scroll">
              <div className="w-20 h-20 rounded-full bg-fpm-teal/10 flex items-center justify-center mx-auto mb-6">
                <Users className="w-10 h-10 text-fpm-teal" />
              </div>
              <div className="text-4xl font-light text-fpm-blue mb-2">95%</div>
              <h3 className="text-xl font-light mb-4">Удовлетворенность</h3>
              <p className="text-gray-700">
                Клиентов полностью удовлетворены результатами нашей работы
              </p>
            </div>
            
            {/* Metric 3 */}
            <div className="bg-gray-50 p-8 rounded-lg text-center animate-on-scroll">
              <div className="w-20 h-20 rounded-full bg-fpm-teal/10 flex items-center justify-center mx-auto mb-6">
                <BarChart4 className="w-10 h-10 text-fpm-teal" />
              </div>
              <div className="text-4xl font-light text-fpm-blue mb-2">15%</div>
              <h3 className="text-xl font-light mb-4">Экономия</h3>
              <p className="text-gray-700">
                Средняя экономия бюджета благодаря оптимизации процессов
              </p>
            </div>
            
            {/* Metric 4 */}
            <div className="bg-gray-50 p-8 rounded-lg text-center animate-on-scroll">
              <div className="w-20 h-20 rounded-full bg-fpm-teal/10 flex items-center justify-center mx-auto mb-6">
                <Truck className="w-10 h-10 text-fpm-teal" />
              </div>
              <div className="text-4xl font-light text-fpm-blue mb-2">50+</div>
              <h3 className="text-xl font-light mb-4">Проектов</h3>
              <p className="text-gray-700">
                Успешно реализованных проектов различной сложности
              </p>
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
