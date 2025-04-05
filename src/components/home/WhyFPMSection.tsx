
import React from 'react';
import { Check, Star, Clock, ShieldCheck } from 'lucide-react';

const features = [
  {
    icon: <Check className="w-12 h-12 text-fpm-orange" />,
    title: 'База проверенных производителей',
    description: 'Сотрудничаем с более чем 200 надежными фабриками, что гарантирует качество и своевременное выполнение заказов.'
  },
  {
    icon: <ShieldCheck className="w-12 h-12 text-fpm-orange" />,
    title: 'Снижение рисков на 30%',
    description: 'Наш опыт и методология позволяют значительно сократить риски срыва сроков и превышения бюджета.'
  },
  {
    icon: <Clock className="w-12 h-12 text-fpm-orange" />,
    title: 'Контроль сроков и бюджета',
    description: 'Внедряем эффективную систему контроля на всех этапах проекта, исключая непредвиденные расходы.'
  },
  {
    icon: <Star className="w-12 h-12 text-fpm-orange" />,
    title: 'Гарантия качества на всех этапах',
    description: 'Строгий контроль качества от выбора материалов до финальной сборки и приемки мебели на объекте.'
  }
];

const WhyFPMSection = () => {
  return (
    <section className="section-padding bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-fpm-blue">Почему FPM?</h2>
          <p className="mt-4 text-lg text-gray-600">
            Мы берем на себя все аспекты управления мебельными проектами, чтобы вы могли сосредоточиться на своем основном бизнесе
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="bg-white rounded-lg p-6 shadow-md hover-lift"
            >
              <div className="flex justify-center mb-4">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-center mb-3 text-fpm-blue">
                {feature.title}
              </h3>
              <p className="text-gray-600 text-center">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyFPMSection;
