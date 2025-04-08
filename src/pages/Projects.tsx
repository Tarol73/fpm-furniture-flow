
import React, { useEffect, useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { ProjectCard, Project } from '@/components/projects/ProjectCard';
import { ProjectFilter } from '@/components/projects/ProjectFilter';
import ContactDialog from '@/components/contact/ContactDialog';
import { supabase } from '@/integrations/supabase/client';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { fetchCategories } from '@/services/categoryService';

type ProjectWithDetails = Project & {
  image?: string;
  tags?: string[];
};

const Projects = () => {
  const [projects, setProjects] = useState<ProjectWithDetails[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<ProjectWithDetails[]>([]);
  const [activeFilter, setActiveFilter] = useState('Все проекты');
  const [categories, setCategories] = useState<string[]>(['Все проекты']);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Fetch projects, their main photos, tags, and categories from Supabase
    const fetchProjects = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Get all projects
        const { data: projectsData, error: projectsError } = await supabase
          .from('projects')
          .select('*');
        
        if (projectsError) throw new Error('Не удалось загрузить проекты');
        
        // Get all photos and filter for main photos
        const { data: photosData, error: photosError } = await supabase
          .from('project_photos')
          .select('*')
          .eq('is_main', true);
        
        if (photosError) throw new Error('Не удалось загрузить фотографии проектов');
        
        // Get all project tags
        const { data: projectTagsData, error: projectTagsError } = await supabase
          .from('project_tags')
          .select('project_id, tags(name)');
        
        if (projectTagsError) throw new Error('Не удалось загрузить теги проектов');
        
        // Get all categories
        const allCategories = await fetchCategories();
        const categoryNames = allCategories.map(cat => cat.name);
        setCategories(['Все проекты', ...categoryNames]);
        
        // Combine the data
        const projectsWithDetails = projectsData.map(project => {
          // Find main photo for this project
          const mainPhoto = photosData.find(photo => photo.project_id === project.id);
          
          // Find tags for this project
          const projectTags = projectTagsData
            .filter(pt => pt.project_id === project.id)
            .map(pt => pt.tags?.name)
            .filter(Boolean) as string[];
          
          return {
            ...project,
            image: mainPhoto?.image_url,
            tags: projectTags
          };
        });
        
        setProjects(projectsWithDetails);
        setFilteredProjects(projectsWithDetails);
        
      } catch (err) {
        console.error('Error fetching projects:', err);
        setError(err instanceof Error ? err.message : 'Произошла ошибка при загрузке данных');
      } finally {
        setLoading(false);
      }
    };
    
    fetchProjects();
  }, []);

  const handleFilterChange = (category: string) => {
    setActiveFilter(category);
    if (category === 'Все проекты') {
      setFilteredProjects(projects);
    } else {
      setFilteredProjects(projects.filter(project => project.category === category));
    }
  };

  // Function to trigger the contact dialog
  const handleContactClick = () => {
    document.dispatchEvent(new CustomEvent('open-contact-dialog'));
  };

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
          
          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Ошибка</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-10">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="flex flex-col space-y-3">
                  <Skeleton className="h-60 w-full rounded-md" />
                  <Skeleton className="h-6 w-3/4 rounded-md" />
                  <Skeleton className="h-4 w-1/2 rounded-md" />
                  <Skeleton className="h-20 w-full rounded-md" />
                  <div className="flex space-x-2">
                    <Skeleton className="h-6 w-16 rounded-full" />
                    <Skeleton className="h-6 w-16 rounded-full" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-10">
              {filteredProjects.map(project => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          )}
          
          <div className="mt-16 text-center">
            <p className="text-lg text-gray-600 mb-6 font-light">
              Хотите обсудить ваш проект или узнать больше о нашем подходе?
            </p>
            <button 
              className="bg-fpm-teal hover:bg-fpm-teal/90 text-white font-light py-3 px-8 rounded-md transition-colors contact-btn"
              onClick={handleContactClick}
            >
              Связаться с нами
            </button>
          </div>
        </div>
      </main>
      <Footer />
      <ContactDialog />
    </div>
  );
};

export default Projects;
