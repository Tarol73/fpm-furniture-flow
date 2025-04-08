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

const projectSchema = z.object({
  title: z.string().min(1, 'Название проекта обязательно'),
  description: z.string().min(1, 'Краткое описание обязательно'),
  full_description: z.string().optional(),
  category: z.string().min(1, 'Категория обязательна'),
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
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const isNew = id === 'new';

  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      title: '',
      description: '',
      full_description: '',
      category: '',
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

  useEffect(() => {
    const authStatus = localStorage.getItem('isAuthenticated');
    if (authStatus !== 'true') {
      navigate('/admin');
      return;
    }
    
    setIsAuthenticated(true);
    
    if (!isNew) {
      fetchProject();
    } else {
      setLoading(false);
    }
  }, [navigate, id, isNew]);

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
      setPhotos(photosData || []);
      
      Object.keys(projectData).forEach((key) => {
        if (form.getValues(key as keyof ProjectFormValues) !== undefined) {
          form.setValue(key as keyof ProjectFormValues, projectData[key] || '');
        }
      });
      
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

  const onSubmit = async (values: ProjectFormValues) => {
    try {
      setSaving(true);
      
      if (isNew) {
        const { data: newProject, error: createError } = await supabase
          .from('projects')
          .insert(values)
          .select()
          .single();
        
        if (createError) throw createError;
        
        toast({
          title: "Успех",
          description: "Проект успешно создан",
          variant: "default",
        });
        
        navigate(`/admin/projects/${newProject.id}`);
      } else {
        const { error: updateError } = await supabase
          .from('projects')
          .update(values)
          .eq('id', Number(id));
        
        if (updateError) throw updateError;
        
        toast({
          title: "Успех",
          description: "Проект успешно обновлен",
          variant: "default",
        });
        
        setProject({
          ...project!,
          ...values
        });
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
        
        setPhotos(prev => [...prev, photoData]);
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
        const newMainPhoto = photos.find(p => p.id !== photoId);
        if (newMainPhoto) {
          const { error: updateError } = await supabase
            .from('project_photos')
            .update({ is_main: true })
            .eq('id', newMainPhoto.id);
          
          if (updateError) throw updateError;
        }
      }
      
      setPhotos(prev => prev.filter(p => p.id !== photoId));
      
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
      const { error: updateAllError } = await supabase
        .from('project_photos')
        .update({ is_main: false })
        .eq('project_id', Number(id));
      
      if (updateAllError) throw updateAllError;
      
      const { error: updateMainError } = await supabase
        .from('project_photos')
        .update({ is_main: true })
        .eq('id', photoId);
      
      if (updateMainError) throw updateMainError;
      
      setPhotos(prev => prev.map(p => ({
        ...p,
        is_main: p.id === photoId
      })));
      
      toast({
        title: "Успех",
        description: "Главная фотография обновлена",
        variant: "default",
      });
      
    } catch (error) {
      console.error('Error setting main photo:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось обновить главную фотографию",
        variant: "destructive",
      });
    }
  };

  const handleMovePhoto = async (photoId: number, direction: 'up' | 'down') => {
    try {
      const photoIndex = photos.findIndex(p => p.id === photoId);
      if (photoIndex === -1) return;
      
      if (
        (direction === 'up' && photoIndex === 0) || 
        (direction === 'down' && photoIndex === photos.length - 1)
      ) {
        return;
      }
      
      const swapIndex = direction === 'up' ? photoIndex - 1 : photoIndex + 1;
      const currentPhoto = photos[photoIndex];
      const swapPhoto = photos[swapIndex];
      
      const { error: updateCurrentError } = await supabase
        .from('project_photos')
        .update({ display_order: swapPhoto.display_order })
        .eq('id', currentPhoto.id);
      
      if (updateCurrentError) throw updateCurrentError;
      
      const { error: updateSwapError } = await supabase
        .from('project_photos')
        .update({ display_order: currentPhoto.display_order })
        .eq('id', swapPhoto.id);
      
      if (updateSwapError) throw updateSwapError;
      
      const newPhotos = [...photos];
      newPhotos[photoIndex] = { ...currentPhoto, display_order: swapPhoto.display_order };
      newPhotos[swapIndex] = { ...swapPhoto, display_order: currentPhoto.display_order };
      newPhotos.sort((a, b) => a.display_order - b.display_order);
      setPhotos(newPhotos);
      
    } catch (error) {
      console.error('Error moving photo:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось изменить порядок фотографий",
        variant: "destructive",
      });
    }
  };

  if (!isAuthenticated) {
    return null;
  }

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
                        
                        <FormField
                          control={form.control}
                          name="category"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Категория*</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
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
                          disabled={saving}
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
                      <div className="mb-6">
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
                          className="w-full"
                        >
                          <Image className="mr-2 h-4 w-4" />
                          {uploading ? 'Загрузка...' : 'Добавить фотографии'}
                        </Button>
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
                                      {photo.is_main && (
                                        <span className="text-fpm-teal flex items-center text-xs">
                                          <Check className="h-3 w-3 mr-1" /> Главное
                                        </span>
                                      )}
                                    </div>
                                    
                                    <div className="flex flex-wrap gap-1 mt-2">
                                      {!photo.is_main && (
                                        <Button
                                          variant="outline"
                                          size="sm"
                                          onClick={() => handleSetMainPhoto(photo.id)}
                                          className="h-7 px-2 text-xs"
                                        >
                                          Главное
                                        </Button>
                                      )}
                                      
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleMovePhoto(photo.id, 'up')}
                                        disabled={index === 0}
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
