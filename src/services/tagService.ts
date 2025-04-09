
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
  // Call the RPC function without type parameters since they're already defined in types.ts
  const { error } = await supabase
    .rpc('create_tag', { tag_name: name });
    
  if (error) {
    console.error('Error creating tag:', error);
    throw new Error('Не удалось создать тег');
  }
  
  // Fetch the newly created tag
  const { data: tagData, error: tagError } = await supabase
    .from('tags')
    .select('*')
    .eq('name', name)
    .single();
    
  if (tagError) {
    console.error('Error fetching created tag:', tagError);
    throw new Error('Тег был создан, но не удалось его получить');
  }
  
  return tagData;
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
  const { error: relationError } = await supabase
    .from('project_tags')
    .delete()
    .eq('tag_id', id);
    
  if (relationError) {
    console.error('Error deleting tag relations:', relationError);
    throw new Error('Не удалось удалить связи тега с проектами');
  }
  
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
    // Enhanced logging for debugging
    console.log('Updating project tags:', { projectId, tagIds });
    
    // First, check if the project exists
    const { data: projectExists, error: projectError } = await supabase
      .from('projects')
      .select('id')
      .eq('id', projectId)
      .single();
      
    if (projectError) {
      console.error('Error verifying project existence:', projectError);
      throw new Error('Проект не найден');
    }
    
    // Delete existing relationships first
    const { error: deleteError } = await supabase
      .from('project_tags')
      .delete()
      .eq('project_id', projectId);
      
    if (deleteError) {
      console.error('Error deleting existing project tags:', deleteError);
      throw deleteError;
    }
    
    // Only insert new relationships if there are tags to add
    if (tagIds.length > 0) {
      // Prepare the tag relations
      const tagRelations = tagIds.map(tagId => ({
        project_id: projectId,
        tag_id: tagId
      }));
      
      console.log('Inserting new tag relations:', tagRelations);
      
      // Insert with upsert option to avoid duplicates
      const { error: insertError } = await supabase
        .from('project_tags')
        .upsert(tagRelations, { 
          onConflict: 'project_id,tag_id',
          ignoreDuplicates: true
        });
        
      if (insertError) {
        console.error('Error inserting project tags:', insertError);
        throw insertError;
      }
    }
    
    console.log('Project tags updated successfully');
  } catch (error) {
    console.error('Error updating project tags:', error);
    throw new Error('Не удалось обновить теги проекта');
  }
};
