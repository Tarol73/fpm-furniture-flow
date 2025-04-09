
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import AdminLayout from '@/components/admin/AdminLayout';
import { 
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle 
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Category, fetchCategories, createCategory, updateCategory, deleteCategory } from '@/services/categoryService';
import { Tag, fetchTags, createTag, updateTag, deleteTag } from '@/services/tagService';
import { Plus, Pencil, Trash2, Save, X } from 'lucide-react';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';

const AdminTaxonomies = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState('categories');
  
  // Состояние для категорий
  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [editingCategoryId, setEditingCategoryId] = useState<number | null>(null);
  const [editingCategoryName, setEditingCategoryName] = useState('');
  const [savingCategory, setSavingCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [addingCategory, setAddingCategory] = useState(false);
  
  // Состояние для тегов
  const [tags, setTags] = useState<Tag[]>([]);
  const [loadingTags, setLoadingTags] = useState(true);
  const [editingTagId, setEditingTagId] = useState<number | null>(null);
  const [editingTagName, setEditingTagName] = useState('');
  const [savingTag, setSavingTag] = useState(false);
  const [newTagName, setNewTagName] = useState('');
  const [addingTag, setAddingTag] = useState(false);
  
  // Диалоги подтверждения удаления
  const [deletingCategory, setDeletingCategory] = useState<Category | null>(null);
  const [deletingTag, setDeletingTag] = useState<Tag | null>(null);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [confirmDeleteType, setConfirmDeleteType] = useState<'category' | 'tag'>('category');
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const authStatus = localStorage.getItem('isAuthenticated');
    if (authStatus !== 'true') {
      navigate('/admin');
      return;
    }
    
    setIsAuthenticated(true);
    loadCategories();
    loadTags();
  }, [navigate]);

  // Загрузка данных
  const loadCategories = async () => {
    try {
      setLoadingCategories(true);
      const categoriesData = await fetchCategories();
      setCategories(categoriesData);
    } catch (error) {
      console.error('Error loading categories:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось загрузить категории",
        variant: "destructive",
      });
    } finally {
      setLoadingCategories(false);
    }
  };

  const loadTags = async () => {
    try {
      setLoadingTags(true);
      const tagsData = await fetchTags();
      setTags(tagsData);
    } catch (error) {
      console.error('Error loading tags:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось загрузить теги",
        variant: "destructive",
      });
    } finally {
      setLoadingTags(false);
    }
  };

  // Функции для работы с категориями
  const handleAddCategory = async () => {
    if (!newCategoryName.trim()) return;
    
    try {
      setAddingCategory(true);
      const newCategory = await createCategory(newCategoryName.trim());
      setCategories([...categories, newCategory]);
      setNewCategoryName('');
      
      toast({
        title: "Успех",
        description: "Категория успешно создана",
        variant: "default",
      });
    } catch (error) {
      console.error('Error adding category:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось создать категорию",
        variant: "destructive",
      });
    } finally {
      setAddingCategory(false);
    }
  };

  const handleUpdateCategory = async (id: number) => {
    if (!editingCategoryName.trim()) return;
    
    try {
      setSavingCategory(true);
      const updatedCategory = await updateCategory(id, editingCategoryName.trim());
      
      setCategories(categories.map(category => 
        category.id === id ? updatedCategory : category
      ));
      
      setEditingCategoryId(null);
      setEditingCategoryName('');
      
      toast({
        title: "Успех",
        description: "Категория успешно обновлена",
        variant: "default",
      });
    } catch (error) {
      console.error('Error updating category:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось обновить категорию",
        variant: "destructive",
      });
    } finally {
      setSavingCategory(false);
    }
  };

  const startEditCategory = (category: Category) => {
    setEditingCategoryId(category.id);
    setEditingCategoryName(category.name);
  };

  const cancelEditCategory = () => {
    setEditingCategoryId(null);
    setEditingCategoryName('');
  };

  const showDeleteCategoryConfirm = (category: Category) => {
    setDeletingCategory(category);
    setConfirmDeleteType('category');
    setConfirmDeleteOpen(true);
  };

  const handleDeleteCategory = async () => {
    if (!deletingCategory) return;
    
    try {
      setDeleting(true);
      await deleteCategory(deletingCategory.id);
      
      setCategories(categories.filter(category => category.id !== deletingCategory.id));
      
      toast({
        title: "Успех",
        description: "Категория успешно удалена",
        variant: "default",
      });
      
      setConfirmDeleteOpen(false);
      setDeletingCategory(null);
    } catch (error) {
      console.error('Error deleting category:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось удалить категорию",
        variant: "destructive",
      });
    } finally {
      setDeleting(false);
    }
  };

  // Функции для работы с тегами
  const handleAddTag = async () => {
    if (!newTagName.trim()) return;
    
    try {
      setAddingTag(true);
      const newTag = await createTag(newTagName.trim());
      setTags([...tags, newTag]);
      setNewTagName('');
      
      toast({
        title: "Успех",
        description: "Тег успешно создан",
        variant: "default",
      });
    } catch (error) {
      console.error('Error adding tag:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось создать тег",
        variant: "destructive",
      });
    } finally {
      setAddingTag(false);
    }
  };

  const handleUpdateTag = async (id: number) => {
    if (!editingTagName.trim()) return;
    
    try {
      setSavingTag(true);
      const updatedTag = await updateTag(id, editingTagName.trim());
      
      setTags(tags.map(tag => 
        tag.id === id ? updatedTag : tag
      ));
      
      setEditingTagId(null);
      setEditingTagName('');
      
      toast({
        title: "Успех",
        description: "Тег успешно обновлен",
        variant: "default",
      });
    } catch (error) {
      console.error('Error updating tag:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось обновить тег",
        variant: "destructive",
      });
    } finally {
      setSavingTag(false);
    }
  };

  const startEditTag = (tag: Tag) => {
    setEditingTagId(tag.id);
    setEditingTagName(tag.name);
  };

  const cancelEditTag = () => {
    setEditingTagId(null);
    setEditingTagName('');
  };

  const showDeleteTagConfirm = (tag: Tag) => {
    setDeletingTag(tag);
    setConfirmDeleteType('tag');
    setConfirmDeleteOpen(true);
  };

  const handleDeleteTag = async () => {
    if (!deletingTag) return;
    
    try {
      setDeleting(true);
      await deleteTag(deletingTag.id);
      
      setTags(tags.filter(tag => tag.id !== deletingTag.id));
      
      toast({
        title: "Успех",
        description: "Тег успешно удален",
        variant: "default",
      });
      
      setConfirmDeleteOpen(false);
      setDeletingTag(null);
    } catch (error) {
      console.error('Error deleting tag:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось удалить тег",
        variant: "destructive",
      });
    } finally {
      setDeleting(false);
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <AdminLayout>
      <div>
        <h2 className="text-2xl font-light text-fpm-blue mb-6">Управление категориями и тегами</h2>
        
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="categories">Категории</TabsTrigger>
            <TabsTrigger value="tags">Теги</TabsTrigger>
          </TabsList>
          
          <TabsContent value="categories">
            <Card>
              <CardHeader>
                <CardTitle>Категории проектов</CardTitle>
                <CardDescription>
                  Управление категориями для фильтрации проектов
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-2 mb-6">
                  <Input
                    placeholder="Название новой категории"
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAddCategory()}
                  />
                  <Button 
                    onClick={handleAddCategory} 
                    disabled={!newCategoryName.trim() || addingCategory}
                    className="bg-fpm-blue hover:bg-fpm-blue/90 text-white"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    {addingCategory ? 'Добавление...' : 'Добавить'}
                  </Button>
                </div>
                
                {loadingCategories ? (
                  <div className="text-center py-4">
                    <p>Загрузка категорий...</p>
                  </div>
                ) : categories.length === 0 ? (
                  <div className="text-center py-4 bg-gray-50 rounded-lg">
                    <p className="text-gray-500">Нет доступных категорий</p>
                  </div>
                ) : (
                  <div className="border rounded-md">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Название</TableHead>
                          <TableHead className="w-[120px] text-right">Действия</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {categories.map((category) => (
                          <TableRow key={category.id}>
                            <TableCell>
                              {editingCategoryId === category.id ? (
                                <Input
                                  value={editingCategoryName}
                                  onChange={(e) => setEditingCategoryName(e.target.value)}
                                  onKeyDown={(e) => e.key === 'Enter' && handleUpdateCategory(category.id)}
                                />
                              ) : (
                                category.name
                              )}
                            </TableCell>
                            <TableCell className="text-right">
                              {editingCategoryId === category.id ? (
                                <div className="flex justify-end space-x-1">
                                  <Button 
                                    variant="ghost" 
                                    size="icon"
                                    onClick={() => cancelEditCategory()}
                                    disabled={savingCategory}
                                  >
                                    <X className="h-4 w-4 text-gray-500" />
                                  </Button>
                                  <Button 
                                    variant="ghost" 
                                    size="icon"
                                    onClick={() => handleUpdateCategory(category.id)}
                                    disabled={!editingCategoryName.trim() || savingCategory}
                                  >
                                    <Save className="h-4 w-4 text-fpm-blue" />
                                  </Button>
                                </div>
                              ) : (
                                <div className="flex justify-end space-x-1">
                                  <Button 
                                    variant="ghost" 
                                    size="icon"
                                    onClick={() => startEditCategory(category)}
                                  >
                                    <Pencil className="h-4 w-4 text-fpm-blue" />
                                  </Button>
                                  <Button 
                                    variant="ghost" 
                                    size="icon"
                                    onClick={() => showDeleteCategoryConfirm(category)}
                                  >
                                    <Trash2 className="h-4 w-4 text-red-500" />
                                  </Button>
                                </div>
                              )}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="tags">
            <Card>
              <CardHeader>
                <CardTitle>Теги проектов</CardTitle>
                <CardDescription>
                  Управление тегами для проектов
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-2 mb-6">
                  <Input
                    placeholder="Название нового тега"
                    value={newTagName}
                    onChange={(e) => setNewTagName(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAddTag()}
                  />
                  <Button 
                    onClick={handleAddTag} 
                    disabled={!newTagName.trim() || addingTag}
                    className="bg-fpm-blue hover:bg-fpm-blue/90 text-white"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    {addingTag ? 'Добавление...' : 'Добавить'}
                  </Button>
                </div>
                
                {loadingTags ? (
                  <div className="text-center py-4">
                    <p>Загрузка тегов...</p>
                  </div>
                ) : tags.length === 0 ? (
                  <div className="text-center py-4 bg-gray-50 rounded-lg">
                    <p className="text-gray-500">Нет доступных тегов</p>
                  </div>
                ) : (
                  <div className="border rounded-md">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Название</TableHead>
                          <TableHead className="w-[120px] text-right">Действия</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {tags.map((tag) => (
                          <TableRow key={tag.id}>
                            <TableCell>
                              {editingTagId === tag.id ? (
                                <Input
                                  value={editingTagName}
                                  onChange={(e) => setEditingTagName(e.target.value)}
                                  onKeyDown={(e) => e.key === 'Enter' && handleUpdateTag(tag.id)}
                                />
                              ) : (
                                tag.name
                              )}
                            </TableCell>
                            <TableCell className="text-right">
                              {editingTagId === tag.id ? (
                                <div className="flex justify-end space-x-1">
                                  <Button 
                                    variant="ghost" 
                                    size="icon"
                                    onClick={() => cancelEditTag()}
                                    disabled={savingTag}
                                  >
                                    <X className="h-4 w-4 text-gray-500" />
                                  </Button>
                                  <Button 
                                    variant="ghost" 
                                    size="icon"
                                    onClick={() => handleUpdateTag(tag.id)}
                                    disabled={!editingTagName.trim() || savingTag}
                                  >
                                    <Save className="h-4 w-4 text-fpm-blue" />
                                  </Button>
                                </div>
                              ) : (
                                <div className="flex justify-end space-x-1">
                                  <Button 
                                    variant="ghost" 
                                    size="icon"
                                    onClick={() => startEditTag(tag)}
                                  >
                                    <Pencil className="h-4 w-4 text-fpm-blue" />
                                  </Button>
                                  <Button 
                                    variant="ghost" 
                                    size="icon"
                                    onClick={() => showDeleteTagConfirm(tag)}
                                  >
                                    <Trash2 className="h-4 w-4 text-red-500" />
                                  </Button>
                                </div>
                              )}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        
        {/* Диалог подтверждения удаления */}
        <Dialog open={confirmDeleteOpen} onOpenChange={setConfirmDeleteOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Подтверждение удаления</DialogTitle>
              <DialogDescription>
                {confirmDeleteType === 'category' 
                  ? 'Вы действительно хотите удалить эту категорию? Это действие нельзя отменить. Категория будет удалена из всех связанных проектов.'
                  : 'Вы действительно хотите удалить этот тег? Это действие нельзя отменить. Тег будет удален из всех связанных проектов.'}
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setConfirmDeleteOpen(false)}
                disabled={deleting}
              >
                Отмена
              </Button>
              <Button
                variant="destructive"
                onClick={confirmDeleteType === 'category' ? handleDeleteCategory : handleDeleteTag}
                disabled={deleting}
              >
                {deleting ? 'Удаление...' : 'Удалить'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
};

export default AdminTaxonomies;
