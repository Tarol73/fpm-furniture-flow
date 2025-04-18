
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import AdminLayout from '@/components/admin/AdminLayout';
import { ExtendedProject } from '@/types/project';
import { Category } from '@/services/categoryService';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Edit2, Plus, Trash2, Search, ArrowUp, ArrowDown, Save, X, Settings } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface DisplayColumn {
  id: string;
  label: string;
  visible: boolean;
}

const AdminProjects = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [projects, setProjects] = useState<(ExtendedProject & { categories?: Category[] })[]>([]);
  const [displayedProjects, setDisplayedProjects] = useState<(ExtendedProject & { categories?: Category[] })[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [orderChanged, setOrderChanged] = useState(false);
  const [savingOrder, setSavingOrder] = useState(false);
  const [editingOrderId, setEditingOrderId] = useState<number | null>(null);
  const [editingOrderValue, setEditingOrderValue] = useState<string>('');
  const [displayColumns, setDisplayColumns] = useState<DisplayColumn[]>([
    { id: 'order', label: 'Порядок', visible: true },
    { id: 'id', label: 'ID', visible: true },
    { id: 'photo', label: 'Фото', visible: false },
    { id: 'title', label: 'Название', visible: true },
    { id: 'categories', label: 'Категории', visible: false },
    { id: 'year', label: 'Год', visible: true },
    { id: 'location', label: 'Локация', visible: true },
    { id: 'actions', label: 'Действия', visible: true },
  ]);

  useEffect(() => {
    const authStatus = localStorage.getItem('isAuthenticated');
    if (authStatus !== 'true') {
      navigate('/admin');
      return;
    }
    
    setIsAuthenticated(true);
    
    // Загрузка настроек отображения колонок из localStorage
    const savedColumns = localStorage.getItem('projectDisplayColumns');
    if (savedColumns) {
      try {
        const parsedColumns = JSON.parse(savedColumns);
        setDisplayColumns(parsedColumns);
      } catch (e) {
        console.error('Error parsing saved columns:', e);
      }
    }
    
    fetchProjects();
  }, [navigate]);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      
      const { data: projectsData, error: projectsError } = await supabase
        .from('projects')
        .select('*')
        .order('display_order', { ascending: true });
      
      if (projectsError) {
        throw projectsError;
      }
      
      const projectsWithImages = await Promise.all(
        projectsData.map(async (project) => {
          const { data: photosData } = await supabase
            .from('project_photos')
            .select('*')
            .eq('project_id', project.id)
            .eq('is_main', true)
            .single();
          
          const { data: categoriesData, error: categoriesError } = await supabase
            .from('project_categories')
            .select(`
              category_id,
              categories:category_id(id, name)
            `)
            .eq('project_id', project.id);

          if (categoriesError) {
            console.error('Error fetching categories:', categoriesError);
          }

          const categories = categoriesData
            ? categoriesData.map(item => item.categories as Category)
            : [];
          
          return {
            ...project,
            mainImage: photosData?.image_url || '/placeholder.svg',
            categories: categories
          };
        })
      );
      
      setProjects(projectsWithImages);
      setDisplayedProjects(projectsWithImages);
      setOrderChanged(false);
    } catch (error) {
      console.error('Error fetching projects:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось загрузить проекты",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEditProject = (projectId: number) => {
    navigate(`/admin/projects/${projectId}`);
  };

  const handleCreateProject = () => {
    navigate('/admin/projects/new');
  };

  const handleDeleteProject = async (projectId: number) => {
    if (!window.confirm("Вы уверены, что хотите удалить этот проект? Это действие невозможно отменить.")) {
      return;
    }
    
    try {
      const { error: photosError } = await supabase
        .from('project_photos')
        .delete()
        .eq('project_id', projectId);
      
      if (photosError) throw photosError;
      
      const { error: tagsError } = await supabase
        .from('project_tags')
        .delete()
        .eq('project_id', projectId);
      
      if (tagsError) throw tagsError;
      
      const { error: categoriesError } = await supabase
        .from('project_categories')
        .delete()
        .eq('project_id', projectId);
        
      if (categoriesError) throw categoriesError;
      
      const { error: projectError } = await supabase
        .from('projects')
        .delete()
        .eq('id', projectId);
      
      if (projectError) throw projectError;
      
      const updatedProjects = projects.filter(project => project.id !== projectId);
      setProjects(updatedProjects);
      setDisplayedProjects(updatedProjects);
      
      toast({
        title: "Успех",
        description: "Проект успешно удален",
        variant: "default",
      });
    } catch (error) {
      console.error('Error deleting project:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось удалить проект",
        variant: "destructive",
      });
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    
    if (!query) {
      setDisplayedProjects(projects);
      return;
    }
    
    const filtered = projects.filter(project => 
      project.title.toLowerCase().includes(query) || 
      project.location.toLowerCase().includes(query) || 
      project.category.toLowerCase().includes(query) ||
      project.categories?.some(cat => cat.name.toLowerCase().includes(query))
    );
    
    setDisplayedProjects(filtered);
  };

  const moveProjectUp = (index: number) => {
    if (index === 0) return; // Already at the top
    
    const newProjects = [...displayedProjects];
    [newProjects[index - 1], newProjects[index]] = [newProjects[index], newProjects[index - 1]];
    setDisplayedProjects(newProjects);
    setOrderChanged(true); // Explicitly set to true when order changes
  };

  const moveProjectDown = (index: number) => {
    if (index === displayedProjects.length - 1) return; // Already at the bottom
    
    const newProjects = [...displayedProjects];
    [newProjects[index], newProjects[index + 1]] = [newProjects[index + 1], newProjects[index]];
    setDisplayedProjects(newProjects);
    setOrderChanged(true); // Explicitly set to true when order changes
  };

  const saveNewOrder = async () => {
    try {
      setSavingOrder(true);
      
      // Create an array of promises for each update operation
      const updatePromises = displayedProjects.map((project, index) => {
        return supabase
          .from('projects')
          .update({ display_order: index + 1 })
          .eq('id', project.id);
      });
      
      // Execute all update operations in parallel
      const results = await Promise.all(updatePromises);
      
      // Check if any errors occurred
      const errors = results.filter(result => result.error);
      if (errors.length > 0) {
        console.error('Errors updating project order:', errors);
        throw new Error('Some projects could not be updated');
      }
      
      // Update the local projects state with the new order
      setProjects([...displayedProjects]);
      
      toast({
        title: "Успех",
        description: "Порядок проектов успешно обновлен",
        variant: "default",
      });
      
      setOrderChanged(false);
    } catch (error) {
      console.error('Error updating project order:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось обновить порядок проектов",
        variant: "destructive",
      });
    } finally {
      setSavingOrder(false);
    }
  };

  const startEditingOrder = (projectId: number, currentOrder: number) => {
    setEditingOrderId(projectId);
    setEditingOrderValue(String(currentOrder));
  };

  const handleOrderValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditingOrderValue(e.target.value);
  };

  const saveOrderValue = async (projectId: number) => {
    try {
      // Проверяем, что значение является числом
      const newOrder = parseInt(editingOrderValue, 10);
      if (isNaN(newOrder) || newOrder < 1) {
        toast({
          title: "Ошибка",
          description: "Значение должно быть положительным числом",
          variant: "destructive",
        });
        return;
      }
      
      // Получаем текущий проект
      const projectToUpdate = projects.find(p => p.id === projectId);
      if (!projectToUpdate) return;
      
      const currentOrder = projectToUpdate.display_order || 0;
      
      // Если порядок не изменился, ничего не делаем
      if (newOrder === currentOrder) {
        setEditingOrderId(null);
        setEditingOrderValue('');
        return;
      }
      
      setSavingOrder(true);
      
      if (newOrder > currentOrder) {
        // Перемещаем проект на более низкую позицию (вниз)
        // Сдвигаем вверх все проекты, которые имеют порядок больше текущего и меньше либо равно новому
        for (const project of projects) {
          if (project.id !== projectId && 
              project.display_order && 
              project.display_order > currentOrder && 
              project.display_order <= newOrder) {
            await supabase
              .from('projects')
              .update({ display_order: project.display_order - 1 })
              .eq('id', project.id);
          }
        }
      } else {
        // Перемещаем проект на более высокую позицию (вверх)
        // Сдвигаем вниз все проекты, которые имеют порядок меньше текущего и больше либо равно новому
        for (const project of projects) {
          if (project.id !== projectId && 
              project.display_order && 
              project.display_order < currentOrder && 
              project.display_order >= newOrder) {
            await supabase
              .from('projects')
              .update({ display_order: project.display_order + 1 })
              .eq('id', project.id);
          }
        }
      }
      
      // Обновляем порядок отображения текущего проекта
      const { error } = await supabase
        .from('projects')
        .update({ display_order: newOrder })
        .eq('id', projectId);
      
      if (error) throw error;
      
      // Обновляем локальное состояние и перезагружаем проекты
      await fetchProjects();
      
      toast({
        title: "Успех",
        description: "Порядок отображения проектов обновлен",
        variant: "default",
      });
      
      // Сбрасываем состояние редактирования
      setEditingOrderId(null);
      setEditingOrderValue('');
      setSavingOrder(false);
    } catch (error) {
      console.error('Error updating project order:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось обновить порядок отображения проекта",
        variant: "destructive",
      });
      setSavingOrder(false);
    }
  };

  const cancelEditingOrder = () => {
    setEditingOrderId(null);
    setEditingOrderValue('');
  };

  // Обработчик для изменения видимости колонок
  const handleColumnToggle = (columnId: string) => {
    const updatedColumns = displayColumns.map(column => 
      column.id === columnId ? { ...column, visible: !column.visible } : column
    );
    setDisplayColumns(updatedColumns);
    
    // Сохраняем настройки в localStorage
    localStorage.setItem('projectDisplayColumns', JSON.stringify(updatedColumns));
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <AdminLayout>
      <div>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-light text-fpm-blue">Управление проектами</h2>
          <div className="flex gap-2">
            {orderChanged && (
              <Button 
                onClick={saveNewOrder}
                className="bg-fpm-purple hover:bg-fpm-purple/90 text-white"
                disabled={savingOrder}
              >
                <Save className="w-4 h-4 mr-2" />
                {savingOrder ? 'Сохранение...' : 'Сохранить порядок'}
              </Button>
            )}
            <Button 
              onClick={handleCreateProject}
              className="bg-fpm-teal hover:bg-fpm-teal/90 text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              Создать проект
            </Button>
          </div>
        </div>

        <div className="mb-6 flex justify-between items-center">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Поиск по названию, локации или категории"
              value={searchQuery}
              onChange={handleSearch}
              className="pl-10"
            />
          </div>
          
          {/* Настройки отображения колонок */}
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="icon" className="ml-2">
                <Settings className="h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80" align="end">
              <div className="space-y-4">
                <h4 className="font-medium">Настройка отображения колонок</h4>
                <div className="space-y-2">
                  {displayColumns.map(column => (
                    <div key={column.id} className="flex items-center space-x-2">
                      <Checkbox 
                        id={`column-${column.id}`} 
                        checked={column.visible}
                        onCheckedChange={() => handleColumnToggle(column.id)}
                      />
                      <Label htmlFor={`column-${column.id}`}>{column.label}</Label>
                    </div>
                  ))}
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>
        
        {loading && !savingOrder && !orderChanged ? (
          <div className="text-center py-8">
            <p>Загрузка проектов...</p>
          </div>
        ) : displayedProjects.length === 0 ? (
          <div className="text-center py-8 bg-gray-50 rounded-lg">
            <p className="text-gray-500">Проекты не найдены. Создайте новый проект или измените условия поиска.</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  {displayColumns.find(col => col.id === 'order')?.visible && (
                    <TableHead className="w-[80px]">Порядок</TableHead>
                  )}
                  {displayColumns.find(col => col.id === 'id')?.visible && (
                    <TableHead className="w-[80px]">ID</TableHead>
                  )}
                  {displayColumns.find(col => col.id === 'photo')?.visible && (
                    <TableHead className="w-[80px]">Фото</TableHead>
                  )}
                  {displayColumns.find(col => col.id === 'title')?.visible && (
                    <TableHead>Название</TableHead>
                  )}
                  {displayColumns.find(col => col.id === 'categories')?.visible && (
                    <TableHead>Категории</TableHead>
                  )}
                  {displayColumns.find(col => col.id === 'year')?.visible && (
                    <TableHead>Год</TableHead>
                  )}
                  {displayColumns.find(col => col.id === 'location')?.visible && (
                    <TableHead>Локация</TableHead>
                  )}
                  {displayColumns.find(col => col.id === 'actions')?.visible && (
                    <TableHead className="text-right">Действия</TableHead>
                  )}
                </TableRow>
              </TableHeader>
              <TableBody>
                {displayedProjects.map((project, index) => (
                  <TableRow key={project.id}>
                    {displayColumns.find(col => col.id === 'order')?.visible && (
                      <TableCell>
                        {editingOrderId === project.id ? (
                          <div className="flex items-center space-x-2">
                            <Input 
                              value={editingOrderValue}
                              onChange={handleOrderValueChange}
                              className="w-16 h-8 text-sm"
                              autoFocus
                            />
                            <div className="flex flex-col gap-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => saveOrderValue(project.id)}
                                className="h-6 w-6 p-0"
                                title="Сохранить"
                              >
                                <Save className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={cancelEditingOrder}
                                className="h-6 w-6 p-0"
                                title="Отменить"
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center space-y-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => moveProjectUp(index)}
                              disabled={index === 0 || savingOrder}
                              className="h-6 w-6 p-0"
                            >
                              <ArrowUp className="h-4 w-4" />
                            </Button>
                            <span 
                              className="text-sm cursor-pointer hover:text-fpm-teal"
                              onClick={() => startEditingOrder(project.id, project.display_order || index + 1)}
                              title="Нажмите для редактирования"
                            >
                              {project.display_order || index + 1}
                            </span>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => moveProjectDown(index)}
                              disabled={index === displayedProjects.length - 1 || savingOrder}
                              className="h-6 w-6 p-0"
                            >
                              <ArrowDown className="h-4 w-4" />
                            </Button>
                          </div>
                        )}
                      </TableCell>
                    )}
                    
                    {displayColumns.find(col => col.id === 'id')?.visible && (
                      <TableCell className="font-medium">{project.id}</TableCell>
                    )}
                    
                    {displayColumns.find(col => col.id === 'photo')?.visible && (
                      <TableCell>
                        <div className="h-12 w-12 rounded overflow-hidden bg-gray-100">
                          <img 
                            src={project.mainImage} 
                            alt={project.title} 
                            className="h-full w-full object-cover"
                          />
                        </div>
                      </TableCell>
                    )}
                    
                    {displayColumns.find(col => col.id === 'title')?.visible && (
                      <TableCell>{project.title}</TableCell>
                    )}
                    
                    {displayColumns.find(col => col.id === 'categories')?.visible && (
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {project.categories && project.categories.length > 0 ? (
                            project.categories.map((category, index) => (
                              <Badge key={index} variant="outline" className="bg-gray-100 text-xs">
                                {category.name}
                              </Badge>
                            ))
                          ) : (
                            <span className="text-gray-500 text-sm">{project.category}</span>
                          )}
                        </div>
                      </TableCell>
                    )}
                    
                    {displayColumns.find(col => col.id === 'year')?.visible && (
                      <TableCell>{project.year}</TableCell>
                    )}
                    
                    {displayColumns.find(col => col.id === 'location')?.visible && (
                      <TableCell>{project.location}</TableCell>
                    )}
                    
                    {displayColumns.find(col => col.id === 'actions')?.visible && (
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditProject(project.id)}
                            disabled={savingOrder}
                          >
                            <Edit2 className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDeleteProject(project.id)}
                            disabled={savingOrder}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminProjects;
