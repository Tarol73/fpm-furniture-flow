
import React from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { ProjectCard } from '@/components/projects/ProjectCard';
import { ProjectFilter } from '@/components/projects/ProjectFilter';

// Sample project data
const projectsData = [
  {
    id: 1,
    title: 'Бизнес-центр "Горизонт"',
    category: 'Офисное пространство',
    location: 'Москва',
    year: '2023',
    description: 'Комплексное оснащение офисного пространства площадью 3500 м² с индивидуальными рабочими местами и зонами для коллективной работы.',
    image: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80',
    tags: ['Офис', 'Мебель на заказ', 'Интеграция']
  },
  {
    id: 2,
    title: 'Ресторан "Морской бриз"',
    category: 'Ресторан',
    location: 'Санкт-Петербург',
    year: '2022',
    description: 'Проектирование и производство эксклюзивной мебели для ресторана в морском стиле. Уникальные решения для интерьера с высокой проходимостью.',
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80',
    tags: ['Ресторан', 'Премиум', 'Дизайнерская мебель']
  },
  {
    id: 3,
    title: 'Отель "Панорама"',
    category: 'Гостиничный комплекс',
    location: 'Сочи',
    year: '2023',
    description: 'Комплексное оснащение номерного фонда и общественных зон пятизвездочного отеля. Поставка и монтаж мебели, декоративных панелей и элементов интерьера.',
    image: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80',
    tags: ['Отель', 'Люкс', 'Комплексное оснащение']
  },
  {
    id: 4,
    title: 'ТРЦ "Меридиан"',
    category: 'Торговый центр',
    location: 'Казань',
    year: '2022',
    description: 'Создание мебельного оснащения для зон отдыха и фудкорта крупного торгового центра. Разработка и реализация интерьерных решений для коммерческих помещений.',
    image: 'https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80',
    tags: ['Торговый центр', 'Массовый сегмент', 'Зоны отдыха']
  },
  {
    id: 5,
    title: 'Коворкинг "Импульс"',
    category: 'Коворкинг',
    location: 'Екатеринбург',
    year: '2023',
    description: 'Разработка и реализация креативных пространств для совместной работы. Мебель с учетом эргономики и повышенной функциональности.',
    image: 'https://images.unsplash.com/photo-1527192491265-7e15c55b1ed2?ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80',
    tags: ['Коворкинг', 'Современный дизайн', 'Эргономика']
  },
  {
    id: 6,
    title: 'Медицинский центр "Здоровье"',
    category: 'Медицинское учреждение',
    location: 'Новосибирск',
    year: '2022',
    description: 'Комплексное оснащение клиники с учетом специфических требований медицинских учреждений. Мебель, соответствующая санитарным нормам и требованиям безопасности.',
    image: 'https://images.unsplash.com/photo-1516574187841-cb9cc2ca948b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80',
    tags: ['Медицина', 'Специализированная мебель', 'Безопасность']
  }
];

const Projects = () => {
  const [filteredProjects, setFilteredProjects] = React.useState(projectsData);
  const [activeFilter, setActiveFilter] = React.useState('Все проекты');

  const handleFilterChange = (category: string) => {
    setActiveFilter(category);
    if (category === 'Все проекты') {
      setFilteredProjects(projectsData);
    } else {
      setFilteredProjects(projectsData.filter(project => project.category === category));
    }
  };

  const categories = ['Все проекты', ...Array.from(new Set(projectsData.map(project => project.category)))];

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-light text-fpm-blue mb-8">Кейсы</h1>
          
          <div className="mb-10">
            <p className="text-lg text-gray-600 max-w-3xl font-light">
              Изучите наши реализованные проекты в различных сегментах коммерческой недвижимости. 
              Каждый проект демонстрирует наш комплексный подход к управлению процессами мебельного оснащения.
            </p>
          </div>
          
          <ProjectFilter 
            categories={categories} 
            activeFilter={activeFilter} 
            onFilterChange={handleFilterChange} 
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-10">
            {filteredProjects.map(project => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
          
          <div className="mt-16 text-center">
            <p className="text-lg text-gray-600 mb-6 font-light">
              Хотите обсудить ваш проект или узнать больше о нашем подходе?
            </p>
            <button className="bg-fpm-teal hover:bg-fpm-teal/90 text-white font-light py-3 px-8 rounded-md transition-colors">
              Связаться с нами
            </button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Projects;
