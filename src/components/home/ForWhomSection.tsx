
import React, { useState } from 'react';
import { Building, Users, Briefcase } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';

const audiences = [
  {
    id: 'contractors',
    icon: <Building className="w-16 h-16 mb-4 text-fpm-blue" />,
    title: 'Генеральные подрядчики',
    description: 'Избавим от простоев и переделок. Наша экспертиза в управлении мебельными проектами позволит вам сократить время реализации и избежать частых проблем.',
    cta: 'Узнать больше',
    link: '/partners#contractors'
  },
  {
    id: 'designers',
    icon: <Users className="w-16 h-16 mb-4 text-fpm-blue" />,
    title: 'Архитекторы и дизайнеры',
    description: 'Воплотим ваши идеи в жизнь. Мы обеспечим техническую поддержку ваших дизайн-концепций и проследим за точным соответствием готовой мебели проекту.',
    cta: 'Подробнее',
    link: '/partners#designers'
  },
  {
    id: 'manufacturers',
    icon: <Briefcase className="w-16 h-16 mb-4 text-fpm-blue" />,
    title: 'Производители мебели',
    description: 'Откроем доступ к крупным проектам. Станьте частью нашей сети проверенных производителей и получайте регулярные заказы от ведущих компаний.',
    cta: 'Стать партнером',
    link: '/partners#manufacturers'
  }
];

const ForWhomSection = () => {
  const [activeTab, setActiveTab] = useState('contractors');
  const isMobile = useIsMobile();

  return (
    <section className="section-padding">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-fpm-blue">Для кого мы работаем</h2>
          <p className="mt-4 text-lg text-gray-600">
            Наши услуги созданы для решения специфических задач разных участников мебельных проектов
          </p>
        </div>
        
        {/* Tabs - hidden on mobile */}
        {!isMobile && (
          <div className="flex flex-wrap justify-center mb-8 gap-4">
            {audiences.map((audience) => (
              <button
                key={audience.id}
                className={cn(
                  'px-6 py-3 rounded-full text-sm font-medium transition-colors',
                  activeTab === audience.id 
                    ? 'bg-fpm-blue text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                )}
                onClick={() => setActiveTab(audience.id)}
              >
                {audience.title}
              </button>
            ))}
          </div>
        )}
        
        {/* Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
          {audiences.map((audience) => (
            <div
              key={audience.id}
              className={cn(
                'bg-white rounded-lg shadow-lg p-8 text-center transition-all duration-300',
                activeTab === audience.id && !isMobile
                  ? 'ring-2 ring-fpm-teal scale-105 z-10' 
                  : 'opacity-70 hover:opacity-100 hover-lift'
              )}
              onClick={() => setActiveTab(audience.id)}
            >
              <div className="flex justify-center">
                {audience.icon}
              </div>
              <h3 className="text-2xl font-bold text-fpm-blue mb-4">
                {audience.title}
              </h3>
              <p className="text-gray-600 mb-6">
                {audience.description}
              </p>
              <Button 
                className={cn(
                  'bg-fpm-teal hover:bg-fpm-teal/90 text-white',
                  activeTab !== audience.id && !isMobile && 'bg-gray-300 hover:bg-gray-400'
                )}
              >
                {audience.cta}
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ForWhomSection;
