
import { supabase } from '@/integrations/supabase/client';
import { ExtendedProject, ProjectPhoto } from '@/types/project';
import { Category } from './categoryService';

export const fetchProjectById = async (id: string): Promise<ExtendedProject> => {
  // Convert ID to a number since Supabase expects numeric IDs
  const projectId = parseInt(id, 10);
  
  if (isNaN(projectId)) {
    throw new Error('Некорректный ID проекта');
  }
  
  // Fetch the project
  const { data: projectData, error: projectError } = await supabase
    .from('projects')
    .select('*')
    .eq('id', projectId)
    .single();
  
  if (projectError) throw new Error('Проект не найден');
  
  // Fetch project photos
  const { data: photosData, error: photosError } = await supabase
    .from('project_photos')
    .select('*')
    .eq('project_id', projectId)
    .order('display_order', { ascending: true });
  
  if (photosError) throw new Error('Не удалось загрузить фотографии проекта');
  
  // Fetch project tags
  const { data: tagsData, error: tagsError } = await supabase
    .from('project_tags')
    .select('tags(name)')
    .eq('project_id', projectId);
  
  if (tagsError) throw new Error('Не удалось загрузить теги проекта');
  
  // Fetch project categories
  const { data: categoriesData, error: categoriesError } = await supabase
    .from('project_categories')
    .select('categories(id, name)')
    .eq('project_id', projectId);
  
  if (categoriesError) throw new Error('Не удалось загрузить категории проекта');
  
  // Extract the main image
  const mainPhoto = photosData.find(photo => photo.is_main);
  const mainImage = mainPhoto ? mainPhoto.image_url : (photosData.length > 0 ? photosData[0].image_url : '/placeholder.svg');
  
  // Extract tags
  const tags = tagsData.map(tag => tag.tags?.name).filter(Boolean) as string[];
  
  // Extract categories
  const categories = categoriesData.map(item => item.categories as Category);
  
  const projectWithDetails: ExtendedProject = {
    ...projectData,
    photos: photosData,
    tags: tags,
    mainImage: mainImage,
    categories: categories
  };
  
  return projectWithDetails;
};

export const fetchRelatedProjects = async (projectId: number, category: string): Promise<ExtendedProject[]> => {
  // First try to get related projects by common categories
  const { data: projectCategories } = await supabase
    .from('project_categories')
    .select('category_id')
    .eq('project_id', projectId);
  
  let projectsToEnhance = [];
  
  if (projectCategories && projectCategories.length > 0) {
    const categoryIds = projectCategories.map(pc => pc.category_id);
    
    // Get projects that share at least one category with this project
    const { data: relatedByCategory } = await supabase
      .from('project_categories')
      .select('project_id')
      .in('category_id', categoryIds)
      .neq('project_id', projectId);
    
    if (relatedByCategory && relatedByCategory.length > 0) {
      const relatedIds = [...new Set(relatedByCategory.map(r => r.project_id))].slice(0, 3);
      
      const { data: relatedProjects } = await supabase
        .from('projects')
        .select('*')
        .in('id', relatedIds);
      
      if (relatedProjects && relatedProjects.length > 0) {
        projectsToEnhance = relatedProjects;
      }
    }
  }
  
  // If we don't have enough related projects by category, fall back to general category field
  if (projectsToEnhance.length < 3) {
    const { data: relatedData } = await supabase
      .from('projects')
      .select('*')
      .eq('category', category)
      .neq('id', projectId)
      .limit(3 - projectsToEnhance.length);
    
    if (relatedData && relatedData.length > 0) {
      projectsToEnhance = [...projectsToEnhance, ...relatedData];
    }
  }
  
  // If still not enough, get any projects
  if (projectsToEnhance.length < 3) {
    const { data: anyRelated } = await supabase
      .from('projects')
      .select('*')
      .neq('id', projectId)
      .limit(3 - projectsToEnhance.length);
      
    if (anyRelated && anyRelated.length > 0) {
      projectsToEnhance = [...projectsToEnhance, ...anyRelated];
    }
  }
  
  // If we have projects to enhance, fetch their main images
  if (projectsToEnhance.length > 0) {
    const relatedIds = projectsToEnhance.map(p => p.id);
    
    const { data: relatedPhotos } = await supabase
      .from('project_photos')
      .select('*')
      .in('project_id', relatedIds)
      .eq('is_main', true);
    
    const enhancedRelated = projectsToEnhance.map(relProj => {
      const photo = relatedPhotos?.find(p => p.project_id === relProj.id);
      return {
        ...relProj,
        mainImage: photo?.image_url || '/placeholder.svg'
      };
    });
    
    return enhancedRelated;
  }
  
  return [];
};
