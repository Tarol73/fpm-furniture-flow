
import { supabase } from '@/integrations/supabase/client';

export interface Category {
  id: number;
  name: string;
}

export const fetchCategories = async (): Promise<Category[]> => {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('name');
  
  if (error) {
    throw new Error(`Failed to fetch categories: ${error.message}`);
  }
  
  return data || [];
};

export const createCategory = async (name: string): Promise<Category> => {
  const { data, error } = await supabase
    .from('categories')
    .insert([{ name }])
    .select()
    .single();
  
  if (error) {
    throw new Error(`Failed to create category: ${error.message}`);
  }
  
  return data;
};

export const getProjectCategories = async (projectId: number): Promise<Category[]> => {
  const { data, error } = await supabase
    .from('project_categories')
    .select(`
      category_id,
      categories(id, name)
    `)
    .eq('project_id', projectId);
  
  if (error) {
    throw new Error(`Failed to fetch project categories: ${error.message}`);
  }
  
  return data?.map(item => item.categories as Category) || [];
};

export const updateProjectCategories = async (projectId: number, categoryIds: number[]): Promise<void> => {
  // First delete all existing category associations
  const { error: deleteError } = await supabase
    .from('project_categories')
    .delete()
    .eq('project_id', projectId);
  
  if (deleteError) {
    throw new Error(`Failed to update project categories: ${deleteError.message}`);
  }
  
  // Then insert new ones if there are any
  if (categoryIds.length > 0) {
    const categoryLinks = categoryIds.map(categoryId => ({
      project_id: projectId,
      category_id: categoryId
    }));
    
    const { error: insertError } = await supabase
      .from('project_categories')
      .insert(categoryLinks);
    
    if (insertError) {
      throw new Error(`Failed to update project categories: ${insertError.message}`);
    }
  }
};
