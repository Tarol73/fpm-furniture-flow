
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import Layout from '@/components/layout/Layout';
import ProjectCard from '@/components/projects/ProjectCard';
import ProjectFilter from '@/components/projects/ProjectFilter';
import { Project } from '@/types/project';
import ProjectsNotFound from '@/components/projects/ProjectsNotFound';
import { useLocation } from 'react-router-dom';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { fetchCategories } from '@/services/categoryService';

type ProjectWithDetails = Project & {
  image?: string;
};

const Projects = () => {
  const [allProjects, setAllProjects] = useState<ProjectWithDetails[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<ProjectWithDetails[]>([]);
  const [categories, setCategories] = useState<string[]>(['Все проекты']);
  const [selectedCategory, setSelectedCategory] = useState<string>('Все проекты');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Fetch projects, their main photos, tags, and categories from Supabase
    const fetchProjects = async () => {
      try {
        setLoading(true);
        
        // Get all projects
        const { data: projectsData, error: projectsError } = await supabase
          .from('projects')
          .select('*')
          .order('id', { ascending: false });
        
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
          
          return {
            ...project,
            image: mainPhoto?.image_url || '/placeholder.svg',
            tags: projectTags as string[]
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
  
  // Update filtered projects when category changes
  useEffect(() => {
    if (selectedCategory === 'Все проекты') {
      setFilteredProjects(allProjects);
    } else {
      setFilteredProjects(
        allProjects.filter(project => project.category === selectedCategory)
      );
    }
  }, [selectedCategory, allProjects]);

  const location = useLocation();
  // Get the category from URL if present
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const categoryParam = searchParams.get('category');
    
    if (categoryParam && categories.includes(categoryParam)) {
      setSelectedCategory(categoryParam);
    }
  }, [location.search, categories]);

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12 max-w-7xl">
        <h1 className="text-4xl text-center mb-8 font-light">Наши проекты</h1>
        
        {error ? (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Ошибка</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        ) : (
          <>
            <ProjectFilter 
              categories={categories}
              selectedCategory={selectedCategory}
              onCategoryChange={handleCategoryChange}
            />
            
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
                    id={project.id} 
                    title={project.title} 
                    description={project.description}
                    image={project.image}
                    category={project.category}
                    location={project.location}
                    year={project.year}
                  />
                ))}
              </div>
            ) : (
              <ProjectsNotFound />
            )}
          </>
        )}
      </div>
    </Layout>
  );
};

export default Projects;
