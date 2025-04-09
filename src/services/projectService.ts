
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
  
  // Fetch project categories using a string literal to specify the table name
  const { data: categoriesData, error: categoriesError } = await supabase
    .from('project_categories')
    .select(`
      category_id,
      categories:category_id(id, name)
    `)
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
  // Сначала получаем категории текущего проекта
  const { data: projectCategories } = await supabase
    .from('project_categories')
    .select('category_id')
    .eq('project_id', projectId);
  
  // Список проектов для отображения
  let relatedProjects: ExtendedProject[] = [];
  
  // Если у текущего проекта есть категории
  if (projectCategories && projectCategories.length > 0) {
    const categoryIds = projectCategories.map(pc => pc.category_id);
    
    // Получаем проекты, которые имеют хотя бы одну общую категорию с текущим проектом
    const { data: relatedByCategory } = await supabase
      .from('project_categories')
      .select('project_id')
      .in('category_id', categoryIds)
      .neq('project_id', projectId);
    
    if (relatedByCategory && relatedByCategory.length > 0) {
      // Отбираем уникальные ID проектов
      const relatedProjectIds = [...new Set(relatedByCategory.map(r => r.project_id))];
      
      // Получаем данные проектов, но не больше 3-х
      const { data: relatedProjectsData } = await supabase
        .from('projects')
        .select('*')
        .in('id', relatedProjectIds)
        .limit(3);
      
      if (relatedProjectsData && relatedProjectsData.length > 0) {
        // Получаем основные изображения для связанных проектов
        const enhancedProjects = await enhanceProjectsWithImages(relatedProjectsData);
        relatedProjects = enhancedProjects;
      }
    }
  }
  
  // Если у нас менее 3-х связанных проектов, добавляем проекты из той же категории
  if (relatedProjects.length < 3) {
    // Получаем все ID проектов, которые у нас уже есть
    const existingProjectIds = [projectId, ...relatedProjects.map(p => p.id)];
    
    const { data: additionalByCategory } = await supabase
      .from('projects')
      .select('*')
      .eq('category', category)
      .not('id', 'in', `(${existingProjectIds.join(',')})`)
      .limit(3 - relatedProjects.length);
    
    if (additionalByCategory && additionalByCategory.length > 0) {
      const enhancedAdditional = await enhanceProjectsWithImages(additionalByCategory);
      relatedProjects = [...relatedProjects, ...enhancedAdditional];
    }
  }
  
  // Если все еще менее 3-х проектов, добавляем любые другие проекты
  if (relatedProjects.length < 3) {
    // Получаем все ID проектов, которые у нас уже есть
    const existingProjectIds = [projectId, ...relatedProjects.map(p => p.id)];
    
    const { data: anyOtherProjects } = await supabase
      .from('projects')
      .select('*')
      .not('id', 'in', `(${existingProjectIds.join(',')})`)
      .limit(3 - relatedProjects.length);
    
    if (anyOtherProjects && anyOtherProjects.length > 0) {
      const enhancedOther = await enhanceProjectsWithImages(anyOtherProjects);
      relatedProjects = [...relatedProjects, ...enhancedOther];
    }
  }
  
  return relatedProjects;
};

// Вспомогательная функция для добавления изображений к проектам
async function enhanceProjectsWithImages(projects: any[]): Promise<ExtendedProject[]> {
  if (projects.length === 0) return [];
  
  const projectIds = projects.map(p => p.id);
  
  // Получаем основные изображения для проектов
  const { data: mainPhotos } = await supabase
    .from('project_photos')
    .select('*')
    .in('project_id', projectIds)
    .eq('is_main', true);
  
  // Добавляем изображения к проектам
  return projects.map(project => {
    const mainPhoto = mainPhotos?.find(p => p.project_id === project.id);
    return {
      ...project,
      mainImage: mainPhoto?.image_url || '/placeholder.svg'
    };
  });
}
