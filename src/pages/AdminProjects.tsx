
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
import { Edit2, Plus, Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const AdminProjects = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [projects, setProjects] = useState<(ExtendedProject & { categories?: Category[] })[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check authentication
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
      
      // Fetch projects from Supabase
      const { data: projectsData, error: projectsError } = await supabase
        .from('projects')
        .select('*')
        .order('id', { ascending: false });
      
      if (projectsError) {
        throw projectsError;
      }
      
      // Fetch main images for each project
      const projectsWithImages = await Promise.all(
        projectsData.map(async (project) => {
          const { data: photosData } = await supabase
            .from('project_photos')
            .select('*')
            .eq('project_id', project.id)
            .eq('is_main', true)
            .single();
          
          // Fetch categories for this project
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

          // Extract categories from the response
          const categories = categoriesData
            ? categoriesData.map(item => item.categories)
            : [];
          
          return {
            ...project,
            mainImage: photosData?.image_url || '/placeholder.svg',
            categories: categories
          };
        })
      );
      
      setProjects(projectsWithImages);
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
      // Delete all project photos first
      const { error: photosError } = await supabase
        .from('project_photos')
        .delete()
        .eq('project_id', projectId);
      
      if (photosError) throw photosError;
      
      // Delete project tags
      const { error: tagsError } = await supabase
        .from('project_tags')
        .delete()
        .eq('project_id', projectId);
      
      if (tagsError) throw tagsError;
      
      // Delete the project
      const { error: projectError } = await supabase
        .from('projects')
        .delete()
        .eq('id', projectId);
      
      if (projectError) throw projectError;
      
      // Update local state
      setProjects(projects.filter(project => project.id !== projectId));
      
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

  if (!isAuthenticated) {
    return null;
  }

  return (
    <AdminLayout>
      <div>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-light text-fpm-blue">Управление проектами</h2>
          <Button 
            onClick={handleCreateProject}
            className="bg-fpm-teal hover:bg-fpm-teal/90 text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            Создать проект
          </Button>
        </div>
        
        {loading ? (
          <div className="text-center py-8">
            <p>Загрузка проектов...</p>
          </div>
        ) : projects.length === 0 ? (
          <div className="text-center py-8 bg-gray-50 rounded-lg">
            <p className="text-gray-500">Проекты не найдены. Создайте новый проект.</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">ID</TableHead>
                  <TableHead className="w-[80px]">Фото</TableHead>
                  <TableHead>Название</TableHead>
                  <TableHead>Категории</TableHead>
                  <TableHead>Год</TableHead>
                  <TableHead>Локация</TableHead>
                  <TableHead className="text-right">Действия</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {projects.map((project) => (
                  <TableRow key={project.id}>
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
