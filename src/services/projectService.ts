
import { supabase } from '@/integrations/supabase/client';
import { ExtendedProject, ProjectPhoto } from '@/types/project';

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
  
  return projectWithDetails;
};

export const fetchRelatedProjects = async (projectId: number, category: string): Promise<ExtendedProject[]> => {
  // Try to fetch related projects by category first
  const { data: relatedData, error: relatedError } = await supabase
    .from('projects')
    .select('*')
    .eq('category', category)
    .neq('id', projectId)
    .limit(3);
  
  let projectsToEnhance = [];
  
  if (!relatedError && relatedData && relatedData.length > 0) {
    projectsToEnhance = relatedData;
  } else {
    // If no related projects by category, get any 3 projects except current
    const { data: anyRelated, error: anyRelatedError } = await supabase
      .from('projects')
      .select('*')
      .neq('id', projectId)
      .limit(3);
      
    if (!anyRelatedError && anyRelated && anyRelated.length > 0) {
      projectsToEnhance = anyRelated;
    } else {
      return [];
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
