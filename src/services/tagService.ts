
import { supabase } from '@/integrations/supabase/client';

export interface Tag {
  id: number;
  name: string;
  created_at?: string;
}

export const fetchTags = async (): Promise<Tag[]> => {
  const { data, error } = await supabase
    .from('tags')
    .select('*')
    .order('name', { ascending: true });
    
  if (error) {
    console.error('Error fetching tags:', error);
    throw new Error('Не удалось загрузить теги');
  }
  
  return data || [];
};

export const createTag = async (name: string): Promise<Tag> => {
  const { data, error } = await supabase
    .from('tags')
    .insert([{ name }])
    .select()
    .single();
    
  if (error) {
    console.error('Error creating tag:', error);
    throw new Error('Не удалось создать тег');
  }
  
  return data;
};

export const updateTag = async (id: number, name: string): Promise<Tag> => {
  const { data, error } = await supabase
    .from('tags')
    .update({ name })
    .eq('id', id)
    .select()
    .single();
    
  if (error) {
    console.error('Error updating tag:', error);
    throw new Error('Не удалось обновить тег');
  }
  
  return data;
};

export const deleteTag = async (id: number): Promise<void> => {
  // Сначала удаляем связи тега с проектами
  const { error: relationError } = await supabase
    .from('project_tags')
    .delete()
    .eq('tag_id', id);
    
  if (relationError) {
    console.error('Error deleting tag relations:', relationError);
    throw new Error('Не удалось удалить связи тега с проектами');
  }
  
  // Затем удаляем сам тег
  const { error } = await supabase
    .from('tags')
    .delete()
    .eq('id', id);
    
  if (error) {
    console.error('Error deleting tag:', error);
    throw new Error('Не удалось удалить тег');
  }
};

export const getProjectTags = async (projectId: number): Promise<Tag[]> => {
  const { data, error } = await supabase
    .from('project_tags')
    .select(`
      tag_id,
      tags:tag_id(id, name)
    `)
    .eq('project_id', projectId);
    
  if (error) {
    console.error('Error fetching project tags:', error);
    throw new Error('Не удалось загрузить теги проекта');
  }
  
  return (data || []).map(item => item.tags as Tag);
};

export const updateProjectTags = async (projectId: number, tagIds: number[]): Promise<void> => {
  try {
    // Сначала удаляем все существующие связи тегов с проектом
    const { error: deleteError } = await supabase
      .from('project_tags')
      .delete()
      .eq('project_id', projectId);
      
    if (deleteError) throw deleteError;
    
    // Если есть новые теги для связи, добавляем их
    if (tagIds.length > 0) {
      const tagRelations = tagIds.map(tagId => ({
        project_id: projectId,
        tag_id: tagId
      }));
      
      const { error: insertError } = await supabase
        .from('project_tags')
        .insert(tagRelations);
        
      if (insertError) throw insertError;
    }
  } catch (error) {
    console.error('Error updating project tags:', error);
    throw new Error('Не удалось обновить теги проекта');
  }
};
