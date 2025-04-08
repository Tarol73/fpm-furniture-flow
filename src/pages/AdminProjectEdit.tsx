import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import AdminLayout from '@/components/admin/AdminLayout';
import { ExtendedProject, ProjectPhoto } from '@/types/project';
import { 
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useForm } from 'react-hook-form';
import { 
  ArrowUp, 
  ArrowDown, 
  Check, 
  Image, 
  Trash2,
  MoveHorizontal,
  Save,
  X,
  ChevronLeft
} from 'lucide-react';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Separator } from '@/components/ui/separator';
import { Checkbox } from "@/components/ui/checkbox";
import { fetchCategories, createCategory, getProjectCategories, updateProjectCategories, Category } from '@/services/categoryService';
import { MultiSelect, OptionType } from '@/components/ui/multi-select';

const projectSchema = z.object({
  title: z.string().min(1, 'Название проекта обязательно'),
  description: z.string().min(1, 'Краткое описание обязательно'),
  full_description: z.string().optional(),
  location: z.string().min(1, 'Локация обязательна'),
  year: z.string().min(1, 'Год обязателен'),
  area: z.string().optional(),
  budget: z.string().optional(),
  challenge: z.string().optional(),
  solution: z.string().optional(),
  results: z.string().optional(),
  client: z.string().optional(),
  duration: z.string().optional(),
});

type ProjectFormValues = z.infer<typeof projectSchema>;

const AdminProjectEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [project, setProject] = useState<ExtendedProject | null>(null);
  const [photos, setPhotos] = useState<ProjectPhoto[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [savingPhotos, setSavingPhotos] = useState(false);
  const [photosChanged, setPhotosChanged] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<OptionType[]>([]);
  const [initialFormValues, setInitialFormValues] = useState<ProjectFormValues | null>(null);
  const [formChanged, setFormChanged] = useState(false);
  const [categoriesChanged, setCategoriesChanged] = useState(false);
  const isNew = id === 'new';

  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      title: '',
      description: '',
      full_description: '',
      location: '',
      year: '',
      area: '',
      budget: '',
      challenge: '',
      solution: '',
      results: '',
      client: '',
      duration: '',
    }
  });
  
  const formValues = form.watch();

  useEffect(() => {
    if (initialFormValues) {
      const hasChanged = Object.keys(formValues).some(
        (key) => formValues[key as keyof ProjectFormValues] !== initialFormValues[key as keyof ProjectFormValues]
      );
      setFormChanged(hasChanged || categoriesChanged);
    }
  }, [formValues, initialFormValues, categoriesChanged]);

  useEffect(() => {
    const authStatus = localStorage.getItem('isAuthenticated');
    if (authStatus !== 'true') {
      navigate('/admin');
      return;
    }
    
    setIsAuthenticated(true);
    
    fetchCategoriesData();
    
    if (!isNew) {
      fetchProject();
    } else {
      setLoading(false);
    }
  }, [navigate, id, isNew]);

  const fetchCategoriesData = async () => {
    try {
      const categoriesData = await fetchCategories();
      setCategories(categoriesData);
    } catch (error) {
      console.error('Error fetching categories:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось загрузить категории",
        variant: "destructive",
      });
    }
  };

  const fetchProject = async () => {
    try {
      setLoading(true);
      
      const { data: projectData, error: projectError } = await supabase
        .from('projects')
        .select('*')
        .eq('id', Number(id))
        .single();
      
      if (projectError) throw projectError;
      
      const { data: photosData, error: photosError } = await supabase
        .from('project_photos')
        .select('*')
        .eq('project_id', Number(id))
        .order('display_order', { ascending: true });
      
      if (photosError) throw photosError;
      
      setProject(projectData);
      
      // Sort photos: main photo first, then by display_order
      const sortedPhotos = [...(photosData || [])].sort((a, b) => {
        if (a.is_main && !b.is_main) return -1;
        if (!a.is_main && b.is_main) return 1;
        return a.display_order - b.display_order;
      });
      
      setPhotos(sortedPhotos);
      
      // Fetch project categories
      const projectCategories = await getProjectCategories(Number(id));
      const categoryOptions = projectCategories.map(cat => ({
        value: cat.id,
        label: cat.name
      }));
      setSelectedCategories(categoryOptions);
      
      // Set form values from project data
      Object.keys(projectData).forEach((key) => {
        if (form.getValues(key as keyof ProjectFormValues) !== undefined) {
          form.setValue(key as keyof ProjectFormValues, projectData[key] || '');
        }
      });
      
      // Store initial form values for change detection
      const initialValues: ProjectFormValues = {
        title: projectData.title || '',
        description: projectData.description || '',
        full_description: projectData.full_description || '',
        location: projectData.location || '',
        year: projectData.year || '',
        area: projectData.area || '',
        budget: projectData.budget || '',
        challenge: projectData.challenge || '',
        solution: projectData.solution || '',
        results: projectData.results || '',
        client: projectData.client || '',
        duration: projectData.duration || '',
      };
      setInitialFormValues(initialValues);
      
    } catch (error) {
      console.error('Error fetching project:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось загрузить проект",
        variant: "destructive",
      });
      navigate('/admin/projects');
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryChange = (selected: OptionType[]) => {
    setSelectedCategories(selected);
    // Check if categories have changed from initial state
    if (project) {
      setCategoriesChanged(true);
    }
  };

  const handleCreateCategory = async (name: string): Promise<OptionType> => {
    const newCategory = await createCategory(name);
    // Update local categories state
    setCategories([...categories, newCategory]);
    return {
      value: newCategory.id,
      label: newCategory.name
    };
  };

  const onSubmit = async (values: ProjectFormValues) => {
    try {
      setSaving(true);
      
      // Get the latest display order value for new projects
      let displayOrder = 1;
      if (isNew) {
        const { data: maxOrderData } = await supabase
          .from('projects')
          .select('display_order')
          .order('display_order', { ascending: false })
          .limit(1)
          .single();
        
        if (maxOrderData) {
          displayOrder = maxOrderData.display_order + 1;
        }
      } else if (project) {
        // For existing projects, use the current display_order
        displayOrder = project.display_order || 1;
      }
      
      const projectData = {
        title: values.title,
        description: values.description,
        location: values.location,
        year: values.year,
        full_description: values.full_description,
        area: values.area,
        budget: values.budget,
        challenge: values.challenge,
        solution: values.solution,
        results: values.results,
        client: values.client,
        duration: values.duration,
        // We'll keep the category field for backward compatibility but won't use it for new relationships
        category: selectedCategories.length > 0 ? selectedCategories[0].label : '',
        display_order: displayOrder, // Add the display_order field
      };
      
      if (isNew) {
        const { data: newProject, error: createError } = await supabase
          .from('projects')
          .insert(projectData)
          .select()
          .single();
        
        if (createError) throw createError;
        
        // Save categories relationship
        if (selectedCategories.length > 0) {
          const categoryIds = selectedCategories.map(cat => Number(cat.value));
          await updateProjectCategories(newProject.id, categoryIds);
        }
        
        toast({
          title: "Успех",
          description: "Проект успешно создан",
          variant: "default",
        });
        
        navigate(`/admin/projects/${newProject.id}`);
      } else {
        const { error: updateError } = await supabase
          .from('projects')
          .update(projectData)
          .eq('id', Number(id));
        
        if (updateError) throw updateError;
        
        // Update categories relationship
        const categoryIds = selectedCategories.map(cat => Number(cat.value));
        await updateProjectCategories(Number(id), categoryIds);
        
        toast({
          title: "Успех",
          description: "Проект успешно обновлен",
          variant: "default",
        });
        
        setProject({
          ...project!,
          ...projectData
        });
        
        // Reset change tracking
        setInitialFormValues(values);
        setCategoriesChanged(false);
        setFormChanged(false);
      }
    } catch (error) {
      console.error('Error saving project:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось сохранить проект",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    try {
      setUploading(true);
      
      if (isNew) {
        toast({
          title: "Ошибка",
          description: "Сначала сохраните проект, чтобы добавить фотографии",
          variant: "destructive",
        });
        return;
      }
      
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}-${i}.${fileExt}`;
        const filePath = `projects/${id}/${fileName}`;
        
        const { error: uploadError } = await supabase.storage
          .from('project-images')
          .upload(filePath, file);
        
        if (uploadError) throw uploadError;
        
        const { data: publicUrlData } = supabase.storage
          .from('project-images')
          .getPublicUrl(filePath);
        
        const imageUrl = publicUrlData.publicUrl;
        
        const nextOrder = photos.length > 0 
          ? Math.max(...photos.map(p => p.display_order)) + 1 
          : 1;
        
        const isMain = photos.length === 0;
        
        const { data: photoData, error: photoError } = await supabase
          .from('project_photos')
          .insert({
            project_id: Number(id),
            image_url: imageUrl,
            is_main: isMain,
            display_order: nextOrder
          })
          .select()
          .single();
        
        if (photoError) throw photoError;
        
        // Add the new photo to the list and re-sort
        const updatedPhotos = [...photos, photoData].sort((a, b) => {
          if (a.is_main && !b.is_main) return -1;
          if (!a.is_main && b.is_main) return 1;
          return a.display_order - b.display_order;
        });
        
        setPhotos(updatedPhotos);
      }
      
      toast({
        title: "Успех",
        description: "Фотографии успешно загружены",
        variant: "default",
      });
      
    } catch (error) {
      console.error('Error uploading photos:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось загрузить фотографии",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleDeletePhoto = async (photoId: number) => {
    if (!window.confirm("Вы уверены, что хотите удалить это фото?")) {
      return;
    }
    
    try {
      const photoToDelete = photos.find(p => p.id === photoId);
      if (!photoToDelete) return;
      
      const { error: deleteError } = await supabase
        .from('project_photos')
        .delete()
        .eq('id', photoId);
      
      if (deleteError) throw deleteError;
      
      if (photoToDelete.is_main && photos.length > 1) {
        // If we deleted the main photo, make another one the main
        const newPhotos = photos.filter(p => p.id !== photoId);
        const newMainPhoto = newPhotos[0]; // First photo becomes main
        
        if (newMainPhoto) {
          const { error: updateError } = await supabase
            .from('project_photos')
            .update({ is_main: true })
            .eq('id', newMainPhoto.id);
          
          if (updateError) throw updateError;
          
          // Update the photos state
          newPhotos[0] = { ...newMainPhoto, is_main: true };
        }
        
        setPhotos(newPhotos);
      } else {
        // Just remove the photo
        setPhotos(prev => prev.filter(p => p.id !== photoId));
      }
      
      toast({
        title: "Успех",
        description: "Фотография успешно удалена",
        variant: "default",
      });
      
    } catch (error) {
      console.error('Error deleting photo:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось удалить фотографию",
        variant: "destructive",
      });
    }
  };

  const handleSetMainPhoto = async (photoId: number) => {
    try {
      // Find the photo and update its state locally first
      const photoIndex = photos.findIndex(p => p.id === photoId);
      if (photoIndex === -1) return;
      
      // If it's already the main photo, do nothing
      if (photos[photoIndex].is_main) return;
      
      // Create a new array with the selected photo marked as main and moved to the top
      const updatedPhotos = [...photos];
      
      // Set all photos to not main
      updatedPhotos.forEach(p => p.is_main = false);
      
      // Set the selected photo as main
      updatedPhotos[photoIndex].is_main = true;
      
      // Move the main photo to the top of the list
      const mainPhoto = updatedPhotos.splice(photoIndex, 1)[0];
      updatedPhotos.unshift(mainPhoto);
      
      // Update state and mark as changed (don't save to DB yet)
      setPhotos(updatedPhotos);
      setPhotosChanged(true);
      
    } catch (error) {
      console.error('Error setting main photo:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось обновить главную фотографию",
        variant: "destructive",
      });
    }
  };

  const handleMovePhoto = (photoId: number, direction: 'up' | 'down') => {
    try {
      const photoIndex = photos.findIndex(p => p.id === photoId);
      if (photoIndex === -1) return;
      
      // Can't move the main photo from the top position
      if (photos[photoIndex].is_main && direction === 'up') return;
      
      // Can't move up if it's already the first non-main photo
      if (direction === 'up' && photoIndex === (photos[0].is_main ? 1 : 0)) return;
      
      // Can't move down if it's already the last photo
      if (direction === 'down' && photoIndex === photos.length - 1) return;
      
      const swapIndex = direction === 'up' ? photoIndex - 1 : photoIndex + 1;
      
      // Never swap with the main photo (which is always at index 0)
      if (swapIndex === 0 && photos[0].is_main && direction === 'up') return;
      
      // Create a new array with the photos in the new order
      const updatedPhotos = [...photos];
      
      // Swap the photos
      [updatedPhotos[photoIndex], updatedPhotos[swapIndex]] = 
      [updatedPhotos[swapIndex], updatedPhotos[photoIndex]];
      
      // Update state and mark as changed (don't save to DB yet)
      setPhotos(updatedPhotos);
      setPhotosChanged(true);
      
    } catch (error) {
      console.error('Error moving photo:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось изменить порядок фотографий",
        variant: "destructive",
      });
    }
  };

  const handleSavePhotos = async () => {
    try {
      setSavingPhotos(true);
      
      // Update display_order for all photos
      for (let i = 0; i < photos.length; i++) {
        const photo = photos[i];
        
        const { error: updateError } = await supabase
          .from('project_photos')
          .update({ 
            display_order: i + 1,
            is_main: photo.is_main
          })
          .eq('id', photo.id);
        
        if (updateError) throw updateError;
      }
      
      setPhotosChanged(false);
      
      toast({
        title: "Успех",
        description: "Порядок и настройки фотографий сохранены",
        variant: "default",
      });
      
    } catch (error) {
      console.error('Error saving photo order:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось сохранить порядок фотографий",
        variant: "destructive",
      });
    } finally {
      setSavingPhotos(false);
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  // Transform categories into options for MultiSelect
  const categoryOptions = categories.map(cat => ({
    value: cat.id,
    label: cat.name
  }));

  return (
    <AdminLayout>
      <div>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => navigate('/admin/projects')}
              className="mr-2"
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Назад
            </Button>
            <h2 className="text-2xl font-light text-fpm-blue">
              {isNew ? 'Создание нового проекта' : 'Редактирование проекта'}
            </h2>
          </div>
          
          {!isNew && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.open(`/projects/${id}`, '_blank')}
            >
              Просмотреть на сайте
            </Button>
          )}
        </div>
        
        {loading ? (
          <div className="text-center py-8">
            <p>Загрузка проекта...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle>Информация о проекте</CardTitle>
                  <CardDescription>
                    Заполните основную информацию о проекте
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="title"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Название проекта*</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <div className="space-y-2">
                          <FormLabel htmlFor="categories">Категории*</FormLabel>
                          <MultiSelect
                            options={categoryOptions}
                            selected={selectedCategories}
                            onChange={handleCategoryChange}
                            placeholder="Выберите категории"
                            createNew={handleCreateCategory}
                            createNewPlaceholder="Создать категорию '{value}'"
                          />
                        </div>
                        
                        <FormField
                          control={form.control}
                          name="year"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Год*</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="location"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Локация*</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="client"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Клиент</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="area"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Площадь</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="budget"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Бюджет</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="duration"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Длительность</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Краткое описание*</FormLabel>
                            <FormControl>
                              <Textarea 
                                {...field} 
                                rows={3} 
                                placeholder="Введите краткое описание проекта для списка проектов"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="full_description"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Полное описание</FormLabel>
                            <FormControl>
                              <Textarea 
                                {...field} 
                                rows={5} 
                                placeholder="Введите полное описание проекта для страницы проекта"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <FormField
                          control={form.control}
                          name="challenge"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Задача</FormLabel>
                              <FormControl>
                                <Textarea {...field} rows={4} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="solution"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Решение</FormLabel>
                              <FormControl>
                                <Textarea {...field} rows={4} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="results"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Результаты</FormLabel>
                              <FormControl>
                                <Textarea {...field} rows={4} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <div className="flex justify-end">
                        <Button 
                          type="submit" 
                          disabled={saving || (!formChanged && !isNew)}
                          className="bg-fpm-blue hover:bg-fpm-blue/90 text-white"
                        >
                          {saving ? 'Сохранение...' : 'Сохранить проект'}
                          <Save className="ml-2 h-4 w-4" />
                        </Button>
                      </div>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </div>
            
            <div className="md:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle>Фотографии проекта</CardTitle>
                  <CardDescription>
                    Загрузите фотографии проекта и управляйте ими
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {isNew ? (
                    <div className="text-center py-4 bg-gray-50 rounded-lg">
                      <p className="text-gray-500 mb-2">Сохраните проект, чтобы добавить фотографии</p>
                    </div>
                  ) : (
                    <>
                      <div className="mb-4">
                        <input 
                          type="file" 
                          accept="image/*" 
                          multiple
                          onChange={handleFileSelect}
                          ref={fileInputRef}
                          className="hidden" 
                          id="photo-upload"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => fileInputRef.current?.click()}
                          disabled={uploading}
                          className="w-full mb-2"
                        >
                          <Image className="mr-2 h-4 w-4" />
                          {uploading ? 'Загрузка...' : 'Добавить фотографии'}
                        </Button>
                        
                        {photosChanged && (
                          <Button
                            type="button"
                            variant="default"
                            onClick={handleSavePhotos}
                            disabled={savingPhotos}
                            className="w-full bg-fpm-teal hover:bg-fpm-teal/90 text-white"
                          >
                            <Save className="mr-2 h-4 w-4" />
                            {savingPhotos ? 'Сохранение...' : 'Сохранить изменения фото'}
                          </Button>
                        )}
                      </div>
                      
                      {photos.length === 0 ? (
                        <div className="text-center py-4 bg-gray-50 rounded-lg">
                          <p className="text-gray-500">У проекта пока нет фотографий</p>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {photos.map((photo, index) => (
                            <div key={photo.id} className="bg-gray-50 rounded-lg p-3 relative">
                              <div className="flex items-start gap-3">
                                <div className="h-20 w-20 flex-shrink-0 rounded overflow-hidden bg-gray-200">
                                  <img 
                                    src={photo.image_url} 
                                    alt={`Фото ${index + 1}`}
                                    className="h-full w-full object-cover" 
                                  />
                                </div>
                                
                                <div className="flex-grow">
                                  <div className="flex flex-col gap-1 text-sm">
                                    <div className="flex justify-between">
                                      <span className="font-medium">Фото {index + 1}</span>
                                      <div className="flex items-center">
                                        <Checkbox 
                                          id={`main-${photo.id}`}
                                          checked={photo.is_main}
                                          onCheckedChange={() => handleSetMainPhoto(photo.id)}
                                          className="mr-2 data-[state=checked]:bg-fpm-teal border-fpm-teal"
                                        />
                                        <label 
                                          htmlFor={`main-${photo.id}`}
                                          className={`text-xs ${photo.is_main ? 'text-fpm-teal' : 'text-gray-500'}`}
                                        >
                                          Главное
                                        </label>
                                      </div>
                                    </div>
                                    
                                    <div className="flex flex-wrap gap-1 mt-2">
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleMovePhoto(photo.id, 'up')}
                                        disabled={
                                          (photo.is_main) || 
                                          (index === (photos[0].is_main ? 1 : 0))
                                        }
                                        className="h-7 w-7 p-0"
                                      >
                                        <ArrowUp className="h-3 w-3" />
                                      </Button>
                                      
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleMovePhoto(photo.id, 'down')}
                                        disabled={index === photos.length - 1}
                                        className="h-7 w-7 p-0"
                                      >
                                        <ArrowDown className="h-3 w-3" />
                                      </Button>
                                      
                                      <Button
                                        variant="destructive"
                                        size="sm"
                                        onClick={() => handleDeletePhoto(photo.id)}
                                        className="h-7 w-7 p-0"
                                      >
                                        <Trash2 className="h-3 w-3" />
                                      </Button>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminProjectEdit;
