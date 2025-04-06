import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Badge } from '@/components/ui/badge';
import { 
  Carousel, 
  CarouselContent, 
  CarouselItem, 
  CarouselNext, 
  CarouselPrevious 
} from '@/components/ui/carousel';
import { 
  Dialog, 
  DialogContent, 
  DialogTitle,
  DialogTrigger,
  DialogDescription 
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from '@/components/ui/button';
import { ArrowLeft, Calendar, MapPin, ChevronLeft, ChevronRight } from 'lucide-react';
import ContactDialog from '@/components/contact/ContactDialog';

// Sample detailed project data
const projectsDetailData = [
  {
    id: 1,
    title: 'Бизнес-центр "Горизонт"',
    category: 'Офисное пространство',
    location: 'Москва',
    year: '2023',
    description: 'Комплексное оснащение офисного пространства площадью 3500 м² с индивидуальными рабочими местами и зонами для коллективной работы. В рамках проекта была разработана концепция офисного пространства, отвечающая корпоративным ценностям компании и современным требованиям к эргономике рабочего места.',
    fullDescription: 'Бизнес-центр "Горизонт" – это современный деловой комплекс класса А, расположенный в центральном деловом районе Москвы. Проект включал в себя полное оснащение шести этажей офисного здания, включая рецепцию, рабочие зоны открытого и закрытого типа, переговорные комнаты, зоны отдыха и коллективной работы.\n\nНаша команда провела детальный анализ потребностей заказчика, который хотел создать пространство, способствующее как эффективной индивидуальной работе, так и командному взаимодействию. Основываясь на этом анализе, мы разработали концепцию, совмещающую функциональность, эргономику и эстетику.\n\nОсобое внимание было уделено качеству и долговечности мебели. Для проекта были подобраны производители, специализирующиеся на офисной мебели высокого класса. Все рабочие места оснащены эргономичными креслами и столами с электрической регулировкой высоты, что позволяет сотрудникам чередовать работу сидя и стоя.\n\nВ переговорных комнатах установлены модульные столы, которые можно трансформировать под различные форматы встреч. Зоны отдыха оборудованы комфортной мягкой мебелью и акустическими панелями для снижения уровня шума.\n\nПроект был реализован в установленные сроки, несмотря на сложную логистику поставок от различных производителей. Наша команда обеспечила контроль качества на всех этапах, от производства до сборки и установки мебели.',
    challenge: 'Основной сложностью проекта был сжатый график реализации – всего 3 месяца от проектирования до полной готовности пространства к эксплуатации. Кроме того, требовалось интегрировать существующие инженерные системы здания с новым офисным оснащением.',
    solution: 'Мы разработали детальный план реализации с еженедельным контролем всех этапов. Для ускорения процесса были выбраны производители с готовыми складскими программами, что позволило сократить время на производство. Параллельно с поставками осуществлялся монтаж, благодаря чему удалось завершить проект в срок.',
    results: 'Созданное офисное пространство полностью соответствует ожиданиям заказчика и получило высокую оценку сотрудников компании. Эргономичные рабочие места способствуют повышению производительности, а современный дизайн отражает инновационный характер бизнеса клиента.',
    mainImage: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1497366754035-f200968a6e72?ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80',
      'https://images.unsplash.com/photo-1604328698692-f76ea9498e76?ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80',
      'https://images.unsplash.com/photo-1556761175-b413da4baf72?ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80',
      'https://images.unsplash.com/photo-1568992687947-868a62a9f521?ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80',
      'https://images.unsplash.com/photo-1577412647305-991150c7d163?ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80',
      'https://images.unsplash.com/photo-1524758631624-e2822e304c36?ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80',
    ],
    tags: ['Офис', 'Мебель на заказ', 'Интеграция', 'Эргономика', 'Рабочие места'],
    client: 'ООО "ТехноГоризонт"',
    duration: '3 месяца',
    area: '3500 м²',
    budget: 'Конфиденциально',
  },
];

const ProjectDetail = () => {
  const { id } = useParams();
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
  
  // Find project by ID (in a real app, you would fetch this from a database)
  const project = projectsDetailData.find(p => p.id === Number(id)) || projectsDetailData[0];
  
  if (!project) {
    return <div>Проект не найден</div>;
  }

  const handleImageClick = (index: number) => {
    setSelectedImageIndex(index);
  };

  const handleNextImage = () => {
    if (selectedImageIndex !== null) {
      setSelectedImageIndex((selectedImageIndex + 1) % project.gallery.length);
    }
  };

  const handlePrevImage = () => {
    if (selectedImageIndex !== null) {
      setSelectedImageIndex((selectedImageIndex - 1 + project.gallery.length) % project.gallery.length);
    }
  };

  const handleCloseDialog = () => {
    setSelectedImageIndex(null);
  };

  const handleContactClick = () => {
    document.dispatchEvent(new CustomEvent('open-contact-dialog'));
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <Link to="/projects" className="inline-flex items-center text-fpm-teal hover:text-fpm-teal/80 transition-colors mb-6">
              <ArrowLeft className="mr-2 h-4 w-4" />
              <span>Вернуться ко всем проектам</span>
            </Link>
            
            <h1 className="text-4xl md:text-5xl font-light text-fpm-blue mb-4">{project.title}</h1>
            
            <div className="flex flex-wrap items-center gap-6 text-gray-600 mb-8">
              <div className="flex items-center">
                <MapPin className="h-5 w-5 mr-1 text-fpm-orange" />
                <span>{project.location}</span>
              </div>
              <div className="flex items-center">
                <Calendar className="h-5 w-5 mr-1 text-fpm-orange" />
                <span>{project.year}</span>
              </div>
              <div>
                <span className="font-medium text-gray-700">{project.category}</span>
              </div>
            </div>
          </div>
          
          {/* Main project image */}
          <div className="relative mb-12 rounded-lg overflow-hidden shadow-md">
            <Dialog onOpenChange={(open) => !open && handleCloseDialog()}>
              <DialogTrigger asChild>
                <div className="cursor-zoom-in relative" onClick={() => handleImageClick(0)}>
                  <img 
                    src={project.mainImage} 
                    alt={project.title} 
                    className="w-full h-[60vh] object-cover"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-10 transition-all duration-300 flex items-center justify-center">
                    <span className="text-white opacity-0 hover:opacity-100 text-lg font-medium">
                      Увеличить
                    </span>
                  </div>
                </div>
              </DialogTrigger>
              <DialogContent className="max-w-5xl w-full p-2 bg-black/90 border-none">
                <DialogTitle className="sr-only">Просмотр изображения</DialogTitle>
                <div className="relative">
                  {selectedImageIndex !== null && (
                    <img 
                      src={project.gallery[selectedImageIndex]} 
                      alt={`${project.title} - изображение ${selectedImageIndex + 1}`} 
                      className="w-full h-auto object-contain max-h-[80vh]"
                    />
                  )}
                  <button 
                    onClick={handlePrevImage}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-colors z-10"
                    aria-label="Предыдущее изображение"
                  >
                    <ChevronLeft className="h-6 w-6" />
                  </button>
                  <button 
                    onClick={handleNextImage}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-colors z-10"
                    aria-label="Следующее изображение"
                  >
                    <ChevronRight className="h-6 w-6" />
                  </button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
          
          {/* Project gallery */}
          <div className="mb-16">
            <h2 className="text-2xl font-light text-fpm-blue mb-6">Галерея проекта</h2>
            <Carousel className="w-full">
              <CarouselContent>
                {project.gallery.map((image, index) => (
                  <CarouselItem key={index} className="basis-1/1 sm:basis-1/2 md:basis-1/3 lg:basis-1/4">
                    <Dialog onOpenChange={(open) => !open && handleCloseDialog()}>
                      <DialogTrigger asChild>
                        <div 
                          className="cursor-zoom-in p-1 relative group" 
                          onClick={() => handleImageClick(index)}
                        >
                          <div className="overflow-hidden rounded-lg">
                            <img 
                              src={image} 
                              alt={`${project.title} - изображение ${index + 1}`} 
                              className="w-full h-48 object-cover rounded-lg transition-transform duration-300 group-hover:scale-105"
                            />
                          </div>
                        </div>
                      </DialogTrigger>
                      <DialogContent className="max-w-5xl w-full p-2 bg-black/90 border-none">
                        <DialogTitle className="sr-only">Просмотр изображения</DialogTitle>
                        <div className="relative">
                          {selectedImageIndex !== null && (
                            <img 
                              src={project.gallery[selectedImageIndex]} 
                              alt={`${project.title} - изображение ${selectedImageIndex + 1}`} 
                              className="w-full h-auto object-contain max-h-[80vh]"
                            />
                          )}
                          <button 
                            onClick={handlePrevImage}
                            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-colors z-10"
                            aria-label="Предыдущее изображение"
                          >
                            <ChevronLeft className="h-6 w-6" />
                          </button>
                          <button 
                            onClick={handleNextImage}
                            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-colors z-10"
                            aria-label="Следующее изображение"
                          >
                            <ChevronRight className="h-6 w-6" />
                          </button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          </div>
          
          {/* Project details */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mb-16">
            <div className="lg:col-span-2">
              <h2 className="text-2xl font-light text-fpm-blue mb-4">О проекте</h2>
              <p className="text-gray-700 mb-6 font-light">{project.description}</p>
              
              <ScrollArea className="h-[400px] w-full rounded-md border p-6">
                <div className="space-y-6">
                  <p className="text-gray-700 font-light whitespace-pre-line">{project.fullDescription}</p>
                  
                  <h3 className="text-xl font-light text-fpm-blue mt-8">Вызов</h3>
                  <p className="text-gray-700 font-light">{project.challenge}</p>
                  
                  <h3 className="text-xl font-light text-fpm-blue mt-6">Решение</h3>
                  <p className="text-gray-700 font-light">{project.solution}</p>
                  
                  <h3 className="text-xl font-light text-fpm-blue mt-6">Результаты</h3>
                  <p className="text-gray-700 font-light">{project.results}</p>
                </div>
              </ScrollArea>
            </div>
            
            <div className="lg:col-span-1">
              <div className="bg-gray-50 rounded-lg p-6 shadow-sm">
                <h3 className="text-xl font-light text-fpm-blue mb-4">Информация о проекте</h3>
                
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm text-gray-500 font-light">Клиент</h4>
                    <p className="text-gray-700 font-light">{project.client}</p>
                  </div>
                  
                  <div>
                    <h4 className="text-sm text-gray-500 font-light">Длительность проекта</h4>
                    <p className="text-gray-700 font-light">{project.duration}</p>
                  </div>
                  
                  <div>
                    <h4 className="text-sm text-gray-500 font-light">Площадь</h4>
                    <p className="text-gray-700 font-light">{project.area}</p>
                  </div>
                  
                  <div>
                    <h4 className="text-sm text-gray-500 font-light">Бюджет</h4>
                    <p className="text-gray-700 font-light">{project.budget}</p>
                  </div>
                  
                  <div>
                    <h4 className="text-sm text-gray-500 font-light mb-2">Теги</h4>
                    <div className="flex flex-wrap gap-2">
                      {project.tags.map((tag, index) => (
                        <Badge key={index} variant="outline" className="bg-gray-100 text-gray-700 hover:bg-gray-200 font-light">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Contact section */}
          <div className="bg-gray-50 rounded-lg p-8 text-center mb-16">
            <h2 className="text-2xl font-light text-fpm-blue mb-4">Хотите реализовать подобный проект?</h2>
            <p className="text-gray-600 mb-6 max-w-3xl mx-auto font-light">
              Наша команда готова помочь вам воплотить в жизнь проект любой сложности. 
              Расскажите нам о своих потребностях, и мы предложим оптимальное решение.
            </p>
            <Button 
              className="bg-fpm-teal hover:bg-fpm-teal/90 text-white font-light contact-btn" 
              onClick={handleContactClick}
            >
              Связаться с нами
            </Button>
          </div>
          
          {/* Related projects section */}
          <div className="mb-16">
            <h2 className="text-2xl font-light text-fpm-blue mb-6">Похожие проекты</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {projectsDetailData.slice(0, 3).map((relatedProject) => (
                <div key={relatedProject.id} className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                  <img 
                    src={relatedProject.mainImage} 
                    alt={relatedProject.title} 
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4">
                    <h3 className="font-light text-lg mb-2">{relatedProject.title}</h3>
                    <p className="text-gray-600 text-sm mb-3 font-light">{relatedProject.category}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500 font-light">{relatedProject.location}</span>
                      <Link to={`/projects/${relatedProject.id}`}>
                        <Button variant="ghost" size="sm" className="text-fpm-teal hover:text-fpm-teal/80 p-0">
                          Подробнее
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
      <Footer />
      <ContactDialog />
    </div>
  );
};

export default ProjectDetail;
