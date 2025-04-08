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
import { Edit2, Plus, Trash2, Search, ArrowUp, ArrowDown, Save } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';

const AdminProjects = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [projects, setProjects] = useState<(ExtendedProject & { categories?: Category[] })[]>([]);
  const [displayedProjects, setDisplayedProjects] = useState<(ExtendedProject & { categories?: Category[] })[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [orderChanged, setOrderChanged] = useState(false);

  useEffect(() => {
    const authStatus = localStorage.getItem('isAuthenticated');
    if (authStatus !== 'true') {
      navigate('/admin');
      return;
    }
    
    setIsAuthenticated(true);
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
    setOrderChanged(true);
  };

  const moveProjectDown = (index: number) => {
    if (index === displayedProjects.length - 1) return; // Already at the bottom
    
    const newProjects = [...displayedProjects];
    [newProjects[index], newProjects[index + 1]] = [newProjects[index + 1], newProjects[index]];
    setDisplayedProjects(newProjects);
    setOrderChanged(true);
  };

  const saveNewOrder = async () => {
    try {
      setLoading(true);
      
      const updates = displayedProjects.map((project, index) => {
        return supabase
          .from('projects')
          .update({ display_order: index + 1 })
          .eq('id', project.id);
      });
      
      await Promise.all(updates);
      
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
      setLoading(false);
    }
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
                className="bg-fpm-orange hover:bg-fpm-orange/90 text-white"
                disabled={loading}
              >
                <Save className="w-4 h-4 mr-2" />
                Сохранить порядок
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

        <div className="mb-6 relative">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Поиск по названию, локации или категории"
              value={searchQuery}
              onChange={handleSearch}
              className="pl-10"
            />
          </div>
        </div>
        
        {loading && !orderChanged ? (
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
                  <TableHead className="w-[80px]">Порядок</TableHead>
                  <TableHead className="w-[80px]">ID</TableHead>
                  <TableHead className="w-[80px]">Фото</TableHead>
                  <TableHead>Название</TableHead>
                  <TableHead>Категории</TableHead>
                  <TableHead>Год</TableHead>
                  <TableHead>Локация</TableHead>
                  <TableHead className="text-right">Действия</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {displayedProjects.map((project, index) => (
                  <TableRow key={project.id}>
                    <TableCell>
                      <div className="flex flex-col items-center space-y-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => moveProjectUp(index)}
                          disabled={index === 0}
                          className="h-6 w-6 p-0"
                        >
                          <ArrowUp className="h-4 w-4" />
                        </Button>
                        <span className="text-sm">{index + 1}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => moveProjectDown(index)}
                          disabled={index === displayedProjects.length - 1}
                          className="h-6 w-6 p-0"
                        >
                          <ArrowDown className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{project.id}</TableCell>
                    <TableCell>
                      <div className="h-12 w-12 rounded overflow-hidden bg-gray-100">
                        <img 
                          src={project.mainImage} 
                          alt={project.title} 
                          className="h-full w-full object-cover"
                        />
                      </div>
                    </TableCell>
                    <TableCell>{project.title}</TableCell>
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
                    <TableCell>{project.year}</TableCell>
                    <TableCell>{project.location}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditProject(project.id)}
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDeleteProject(project.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
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
