
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { ProjectCard } from '@/components/projects/ProjectCard';
import { ProjectFilter } from '@/components/projects/ProjectFilter';
import ProjectsNotFound from '@/components/projects/ProjectsNotFound';
import { ExtendedProject } from '@/types/project';
import { useLocation } from 'react-router-dom';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertCircle, Search, X } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { fetchCategories } from '@/services/categoryService';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

type ProjectWithDetails = ExtendedProject & {
  image?: string;
};

const Projects = () => {
  const [allProjects, setAllProjects] = useState<ProjectWithDetails[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<ProjectWithDetails[]>([]);
  const [categories, setCategories] = useState<string[]>(['Все проекты']);
  const [selectedCategories, setSelectedCategories] = useState<string[]>(['Все проекты']);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');

  useEffect(() => {
    // Fetch projects, their main photos, tags, and categories from Supabase
    const fetchProjects = async () => {
      try {
        setLoading(true);
        
        // Get all projects ordered by display_order
        const { data: projectsData, error: projectsError } = await supabase
          .from('projects')
          .select('*')
          .order('display_order', { ascending: true });
        
        if (projectsError) throw new Error('Не удалось загрузить проекты');
        
        // Get main photos for all projects
        const { data: photosData, error: photosError } = await supabase
          .from('project_photos')
          .select('*')
          .eq('is_main', true);
        
        if (photosError) throw new Error('Не удалось загрузить фотографии проектов');
        
        // Get tags for all projects
        const { data: projectTagsData, error: projectTagsError } = await supabase
          .from('project_tags')
          .select(`
            project_id,
            tags(name)
          `);
        
        if (projectTagsError) throw new Error('Не удалось загрузить теги проектов');
        
        // Get project categories for all projects
        const { data: projectCategoriesData, error: projectCategoriesError } = await supabase
          .from('project_categories')
          .select(`
            project_id,
            categories:category_id(id, name)
          `);
          
        if (projectCategoriesError) throw new Error('Не удалось загрузить категории проектов');
        
        // Get all categories
        const allCategories = await fetchCategories();
        const categoryNames = allCategories.map(cat => cat.name);
        setCategories(['Все проекты', ...categoryNames]);
        
        // Combine the data
        const projectsWithDetails = projectsData.map(project => {
          const mainPhoto = photosData?.find(photo => photo.project_id === project.id);
          const projectTags = projectTagsData
            ?.filter(tag => tag.project_id === project.id)
            ?.map(tag => tag.tags?.name)
            ?.filter(Boolean) || [];
          
          // Get all categories for this project
          const projectCategories = projectCategoriesData
            ?.filter(pc => pc.project_id === project.id)
            ?.map(pc => pc.categories);
          
          return {
            ...project,
            image: mainPhoto?.image_url || '/placeholder.svg',
            tags: projectTags as string[],
            categories: projectCategories.filter(Boolean) // Filter out any null/undefined categories
          };
        });
        
        setAllProjects(projectsWithDetails);
        setFilteredProjects(projectsWithDetails);
        
      } catch (error) {
        console.error('Error fetching projects:', error);
        setError(error instanceof Error ? error.message : 'Произошла ошибка при загрузке проектов');
      } finally {
        setLoading(false);
      }
    };
    
    fetchProjects();
  }, []);
  
  // Функция для фильтрации проектов на основе выбранных категорий и поискового запроса
  const filterProjects = () => {
    let filtered = allProjects;
    
    // Фильтрация по категориям
    if (!selectedCategories.includes('Все проекты')) {
      filtered = filtered.filter(project => {
        // Проверка на совпадение хотя бы с одной выбранной категорией
        return (
          selectedCategories.includes(project.category) || 
          (project.categories && project.categories.some(cat => 
            selectedCategories.includes(cat?.name || '')
          ))
        );
      });
    }
    
    // Фильтрация по поисковому запросу
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(project => 
        project.title.toLowerCase().includes(query) || 
        project.description.toLowerCase().includes(query) || 
        project.location.toLowerCase().includes(query) || 
        project.client?.toLowerCase().includes(query) || 
        project.tags?.some(tag => tag.toLowerCase().includes(query))
      );
    }
    
    setFilteredProjects(filtered);
  };
  
  // Вызываем фильтрацию при изменении выбранных категорий или поискового запроса
  useEffect(() => {
    filterProjects();
  }, [selectedCategories, searchQuery, allProjects]);

  const location = useLocation();
  // Get the category from URL if present
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const categoryParam = searchParams.get('category');
    
    if (categoryParam && categories.includes(categoryParam)) {
      setSelectedCategories([categoryParam]);
    }
  }, [location.search, categories]);

  const handleCategoryToggle = (category: string) => {
    if (category === 'Все проекты') {
      setSelectedCategories(['Все проекты']);
      return;
    }
    
    // Исключаем "Все проекты" из выбора и добавляем или удаляем категорию
    setSelectedCategories(prev => {
      // Если категория уже выбрана, удаляем ее
      const withoutCategory = prev.filter(c => c !== category && c !== 'Все проекты');
      
      // Если удаление последней категории, возвращаем "Все проекты"
      if (prev.includes(category) && withoutCategory.length === 0) {
        return ['Все проекты'];
      }
      
      // Иначе добавляем категорию
      if (!prev.includes(category)) {
        return [...withoutCategory, category];
      }
      
      return withoutCategory;
    });
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const clearSearch = () => {
    setSearchQuery('');
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="container mx-auto px-4 py-12 max-w-7xl flex-grow">
        <h1 className="text-4xl text-center mb-8 font-light">Наши проекты</h1>
        
        {error ? (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Ошибка</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        ) : (
          <>
            <div className="mb-6">
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Поиск по названию, тегам, заказчику или локации"
                  value={searchQuery}
                  onChange={handleSearch}
                  className="pl-10 pr-10"
                />
                {searchQuery && (
                  <button 
                    className="absolute right-3 top-1/2 transform -translate-y-1/2"
                    onClick={clearSearch}
                  >
                    <X className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                  </button>
                )}
              </div>
              
              <ProjectFilter 
                categories={categories}
                activeFilter={selectedCategories}
                onFilterChange={handleCategoryToggle}
              />
              
              {selectedCategories.length > 0 && !selectedCategories.includes('Все проекты') && (
                <div className="flex flex-wrap gap-2 mt-4">
                  <span className="text-sm text-gray-500">Выбрано:</span>
                  {selectedCategories.map(category => (
                    <Badge 
                      key={category} 
                      variant="outline" 
                      className="bg-fpm-teal/10 border-fpm-teal text-fpm-teal"
                    >
                      {category}
                      <button 
                        className="ml-1 hover:text-red-500"
                        onClick={() => handleCategoryToggle(category)}
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>
            
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
                {[...Array(6)].map((_, index) => (
                  <div key={index} className="flex flex-col">
                    <Skeleton className="w-full h-64 rounded-md mb-3" />
                    <Skeleton className="w-3/4 h-6 rounded-md mb-2" />
                    <Skeleton className="w-full h-4 rounded-md mb-1" />
                    <Skeleton className="w-2/3 h-4 rounded-md" />
                  </div>
                ))}
              </div>
            ) : filteredProjects.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
                {filteredProjects.map(project => (
                  <ProjectCard 
                    key={project.id}
                    project={project}
                  />
                ))}
              </div>
            ) : (
              <ProjectsNotFound />
            )}
          </>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Projects;
