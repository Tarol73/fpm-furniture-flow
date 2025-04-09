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
  // First check if category with this name already exists
  const { data: existingCategory, error: checkError } = await supabase
    .from('categories')
    .select('*')
    .eq('name', name)
    .maybeSingle();
    
  if (checkError) {
    console.error('Error checking category existence:', checkError);
    throw new Error('Не удалось проверить существование категории');
  }
  
  if (existingCategory) {
    console.error('Category already exists with name:', name);
    throw new Error('Категория с таким названием уже существует');
  }
  
  // If no existing category, proceed with creation
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

export const updateCategory = async (id: number, name: string): Promise<Category> => {
  try {
    // First check if category with new name already exists (but not the same category)
    const { data: existingCategoryWithName, error: nameCheckError } = await supabase
      .from('categories')
      .select('*')
      .eq('name', name)
      .neq('id', id)
      .maybeSingle();
      
    if (nameCheckError) {
      console.error('Error checking category name existence:', nameCheckError);
      throw new Error('Не удалось проверить существование категории с таким названием');
    }
    
    if (existingCategoryWithName) {
      console.error('Another category already exists with name:', name);
      throw new Error('Категория с таким названием уже существует');
    }
    
    // Now update the category
    const { data, error } = await supabase
      .from('categories')
      .update({ name })
      .eq('id', id)
      .select()
      .single();
  
    if (error) {
      throw new Error(`Failed to update category: ${error.message}`);
    }
  
    return data;
  } catch (error) {
    console.error('Exception in updateCategory:', error);
    throw error;
  }
};

export const deleteCategory = async (id: number): Promise<void> => {
  // Сначала удаляем связи категории с проектами
  const { error: relationError } = await supabase
    .from('project_categories')
    .delete()
    .eq('category_id', id);
  
  if (relationError) {
    throw new Error(`Failed to delete category relations: ${relationError.message}`);
  }
  
  // Затем удаляем саму категорию
  const { error } = await supabase
    .from('categories')
    .delete()
    .eq('id', id);
  
  if (error) {
    throw new Error(`Failed to delete category: ${error.message}`);
  }
};

export const getProjectCategories = async (projectId: number): Promise<Category[]> => {
  // We need to use .from('project_categories') with a string literal to avoid type issues
  // Then manually type the return data
  const { data, error } = await supabase
    .from('project_categories')
    .select(`
      category_id,
      categories:category_id(id, name)
    `)
    .eq('project_id', projectId);
  
  if (error) {
    throw new Error(`Failed to fetch project categories: ${error.message}`);
  }
  
  // Transform the data to match the expected Category interface
  return (data || []).map(item => {
    // Access the nested 'categories' object that contains category data
    return (item.categories as Category);
  });
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
    
    // Insert each link individually to avoid type issues
    for (const link of categoryLinks) {
      const { error: insertError } = await supabase
        .from('project_categories')
        .insert(link);
      
      if (insertError) {
        throw new Error(`Failed to update project categories: ${insertError.message}`);
      }
    }
  }
};
