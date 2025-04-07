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
import ProjectGalleryImage from '@/components/project/ProjectGalleryImage';
import { useIsMobile } from '@/hooks/use-mobile';
import { supabase } from '@/integrations/supabase/client';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Project } from '@/components/projects/ProjectCard';
import { Database } from '@/integrations/supabase/types';

interface ProjectPhoto {
  id: number;
  project_id: number;
  image_url: string;
  is_main: boolean;
  display_order: number;
}

interface ExtendedProject extends Project {
  photos?: ProjectPhoto[];
  mainImage?: string;
}

const ProjectDetail = () => {
  const { id } = useParams();
  const [project, setProject] = useState<ExtendedProject | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [relatedProjects, setRelatedProjects] = useState<ExtendedProject[]>([]);
  const isMobile = useIsMobile();
  
  useEffect(() => {
    window.scrollTo(0, 0);
    
    const fetchProjectDetails = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch the project
        const { data: projectData, error: projectError } = await supabase
          .from('projects')
          .select('*')
          .eq('id', id)
          .single();
        
        if (projectError) throw new Error('Проект не найден');
        
        // Fetch project photos
        const { data: photosData, error: photosError } = await supabase
          .from('project_photos')
          .select('*')
          .eq('project_id', id)
          .order('display_order', { ascending: true });
        
        if (photosError) throw new Error('Не удалось загрузить фотографии проекта');
        
        // Fetch project tags
        const { data: tagsData, error: tagsError } = await supabase
          .from('project_tags')
          .select('tags(name)')
          .eq('project_id', id);
        
        if (tagsError) throw new Error('Не удалось загрузить теги проекта');
        
        // Extract the main image
        const mainPhoto = photosData.find(photo => photo.is_main);
        const mainImage = mainPhoto ? mainPhoto.image_url : (photosData.length > 0 ? photosData[0].image_url : '/placeholder.svg');
        
        // Extract tags
        const tags = tagsData.map(tag => tag.tags?.name).filter(Boolean) as string[];
        
        const projectWithDetails: ExtendedProject = {
          ...projectData,
          photos: photosData,
          tags: tags,
          mainImage: mainImage
        };
        
        setProject(projectWithDetails);
        
        // Fetch related projects (same category, excluding current)
        if (projectData) {
          const { data: relatedData, error: relatedError } = await supabase
            .from('projects')
            .select('*')
            .eq('category', projectData.category)
            .neq('id', id)
            .limit(3);
          
          if (!relatedError && relatedData && relatedData.length > 0) {
            // Fetch main photos for related projects
            const relatedIds = relatedData.map(p => p.id);
            
            const { data: relatedPhotos, error: relatedPhotosError } = await supabase
              .from('project_photos')
              .select('*')
              .in('project_id', relatedIds)
              .eq('is_main', true);
            
            const enhancedRelated = relatedData.map(relProj => {
              const photo = relatedPhotos?.find(p => p.project_id === relProj.id);
              return {
                ...relProj,
                mainImage: photo?.image_url || '/placeholder.svg'
              };
            });
            
            setRelatedProjects(enhancedRelated);
          } else {
            // If no related projects by category, get any 3 projects except current
            const { data: anyRelated, error: anyRelatedError } = await supabase
              .from('projects')
              .select('*')
              .neq('id', id)
              .limit(3);
              
            if (!anyRelatedError && anyRelated && anyRelated.length > 0) {
              const relatedIds = anyRelated.map(p => p.id);
              
              const { data: relatedPhotos } = await supabase
                .from('project_photos')
                .select('*')
                .in('project_id', relatedIds)
                .eq('is_main', true);
              
              const enhancedRelated = anyRelated.map(relProj => {
                const photo = relatedPhotos?.find(p => p.project_id === relProj.id);
                return {
                  ...relProj,
                  mainImage: photo?.image_url || '/placeholder.svg'
                };
              });
              
              setRelatedProjects(enhancedRelated);
            }
          }
        }
        
      } catch (err) {
        console.error('Error fetching project details:', err);
        setError(err instanceof Error ? err.message : 'Произошла ошибка при загрузке данных');
      } finally {
        setLoading(false);
      }
    };
    
    if (id) {
      fetchProjectDetails();
    }
  }, [id]);

  const handleImageClick = (index: number | null) => {
    setSelectedImageIndex(index);
  };

  const handleNextImage = () => {
    if (selectedImageIndex !== null && project?.photos) {
      setSelectedImageIndex((selectedImageIndex + 1) % project.photos.length);
    }
  };

  const handlePrevImage = () => {
    if (selectedImageIndex !== null && project?.photos) {
      setSelectedImageIndex((selectedImageIndex - 1 + project.photos.length) % project.photos.length);
    }
  };

  const handleCloseDialog = () => {
    setSelectedImageIndex(null);
  };

  const handleContactClick = () => {
    document.dispatchEvent(new CustomEvent('open-contact-dialog'));
  };

  if (loading) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <main className="pt-24 pb-16">
          <div className="container mx-auto px-4">
            <div className="flex items-center mb-8">
              <Skeleton className="h-4 w-40 mr-2" />
            </div>
            <Skeleton className="h-12 w-3/4 mb-4" />
            <div className="flex flex-wrap gap-6 mb-8">
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-6 w-32" />
            </div>
            <Skeleton className="h-[60vh] w-full mb-12 rounded-lg" />
            <Skeleton className="h-8 w-60 mb-6" />
            <div className="grid grid-cols-4 gap-4 mb-16">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-40 w-full rounded-md" />
              ))}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mb-16">
              <div className="lg:col-span-2">
                <Skeleton className="h-8 w-40 mb-4" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-3/4 mb-6" />
                <Skeleton className="h-[400px] w-full rounded-md" />
              </div>
              <div className="lg:col-span-1">
                <Skeleton className="h-[400px] w-full rounded-lg" />
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error) {
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
            </div>
            <Alert variant="destructive" className="mb-6">
              <AlertTitle>Ошибка при загрузке проекта</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!project) {
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
            </div>
            <h1 className="text-4xl md:text-5xl font-light text-fpm-blue mb-8">Проект не найден</h1>
            <p>Запрашиваемый проект не существует или был удален.</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

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
          
          <div className="relative mb-12 rounded-lg overflow-hidden shadow-md">
            <Dialog onOpenChange={(open) => !open && handleCloseDialog()}>
              <DialogTrigger asChild>
                <div className="cursor-zoom-in relative" onClick={() => handleImageClick(0)}>
                  <img 
                    src={project.mainImage} 
                    alt={project.title} 
                    className={`w-full ${isMobile ? 'h-auto object-contain' : 'h-[60vh] object-cover'}`}
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
                  {selectedImageIndex !== null && project.photos && (
                    <img 
                      src={project.photos[selectedImageIndex].image_url} 
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
          
          {project.photos && project.photos.length > 0 && (
            <div className="mb-16">
              <h2 className="text-2xl font-light text-fpm-blue mb-6">Галерея проекта</h2>
              <Carousel className="w-full">
                <CarouselContent>
                  {project.photos.map((photo, index) => (
                    <CarouselItem key={index} className="basis-1/1 sm:basis-1/2 md:basis-1/3 lg:basis-1/4">
                      <ProjectGalleryImage
                        src={photo.image_url}
                        alt={`${project.title} - изображение ${index + 1}`}
                        index={index}
                        onClick={handleImageClick}
                        selectedImageIndex={selectedImageIndex}
                        onPrev={handlePrevImage}
                        onNext={handleNextImage}
                      />
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
              </Carousel>
            </div>
          )}
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mb-16">
            <div className="lg:col-span-2">
              <h2 className="text-2xl font-light text-fpm-blue mb-4">О проекте</h2>
              <p className="text-gray-700 mb-6 font-light">{project.description}</p>
              
              <ScrollArea className="h-[400px] w-full rounded-md border p-6">
                <div className="space-y-6">
                  <p className="text-gray-700 font-light whitespace-pre-line">{project.full_description}</p>
                  
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
                  
                  {project.tags && project.tags.length > 0 && (
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
                  )}
                </div>
              </div>
            </div>
          </div>
          
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
          
          {relatedProjects.length > 0 && (
            <div className="mb-16">
              <h2 className="text-2xl font-light text-fpm-blue mb-6">Похожие проекты</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {relatedProjects.map((relatedProject) => (
                  <div key={relatedProject.id} className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                    <Link to={`/projects/${relatedProject.id}`}>
                      <img 
                        src={relatedProject.mainImage} 
                        alt={relatedProject.title} 
                        className="w-full h-48 object-cover"
                      />
                    </Link>
                    <div className="p-4">
                      <Link to={`/projects/${relatedProject.id}`}>
                        <h3 className="font-light text-lg mb-2">{relatedProject.title}</h3>
                      </Link>
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
          )}
        </div>
      </main>
      <Footer />
      <ContactDialog />
    </div>
  );
};

export default ProjectDetail;
