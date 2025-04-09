
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import AdminLayout from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Edit, Save, Trash2, Plus, X } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
  DialogClose,
  DialogDescription,
} from "@/components/ui/dialog";
import { 
  fetchCategories, 
  createCategory, 
  updateCategory, 
  deleteCategory,
  Category 
} from '@/services/categoryService';
import { 
  fetchTags, 
  createTag, 
  updateTag, 
  deleteTag,
  Tag 
} from '@/services/tagService';

const AdminTaxonomies = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  // Categories state
  const [categories, setCategories] = useState<Category[]>([]);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [editingCategoryId, setEditingCategoryId] = useState<number | null>(null);
  const [editingCategoryName, setEditingCategoryName] = useState('');
  const [loadingCategories, setLoadingCategories] = useState(true);
  
  // Tags state
  const [tags, setTags] = useState<Tag[]>([]);
  const [newTagName, setNewTagName] = useState('');
  const [editingTagId, setEditingTagId] = useState<number | null>(null);
  const [editingTagName, setEditingTagName] = useState('');
  const [loadingTags, setLoadingTags] = useState(true);
  
  // Dialog state
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<'category' | 'tag'>('category');
  const [dialogInputValue, setDialogInputValue] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    const authStatus = localStorage.getItem('isAuthenticated');
    if (authStatus !== 'true') {
      navigate('/admin');
      return;
    }
    
    setIsAuthenticated(true);
    fetchCategoriesData();
    fetchTagsData();
  }, [navigate]);
  
  const fetchCategoriesData = async () => {
    try {
      setLoadingCategories(true);
      const data = await fetchCategories();
      setCategories(data);
    } catch (error) {
      console.error('Error fetching categories:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось загрузить категории",
        variant: "destructive",
      });
    } finally {
      setLoadingCategories(false);
    }
  };
  
  const fetchTagsData = async () => {
    try {
      setLoadingTags(true);
      const data = await fetchTags();
      setTags(data);
    } catch (error) {
      console.error('Error fetching tags:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось загрузить теги",
        variant: "destructive",
      });
    } finally {
      setLoadingTags(false);
    }
  };
  
  // Common dialog handlers
  const openCreateDialog = (mode: 'category' | 'tag') => {
    setDialogMode(mode);
    setDialogInputValue('');
    setIsDialogOpen(true);
  };

  const handleDialogSubmit = async () => {
    if (!dialogInputValue.trim()) return;
    
    try {
      setIsCreating(true);
      
      if (dialogMode === 'category') {
        await createCategory(dialogInputValue);
        fetchCategoriesData();
        toast({
          title: "Успех",
          description: "Категория успешно создана",
          variant: "default",
        });
      } else {
        await createTag(dialogInputValue);
        fetchTagsData();
        toast({
          title: "Успех",
          description: "Тег успешно создан",
          variant: "default",
        });
      }
      
      setIsDialogOpen(false);
      setDialogInputValue('');
    } catch (error) {
      console.error(`Error creating ${dialogMode}:`, error);
      toast({
        title: "Ошибка",
        description: `Не удалось создать ${dialogMode === 'category' ? 'категорию' : 'тег'}`,
        variant: "destructive",
      });
    } finally {
      setIsCreating(false);
    }
  };
  
  // Category actions
  const handleStartEditCategory = (category: Category) => {
    setEditingCategoryId(category.id);
    setEditingCategoryName(category.name);
  };

  const handleCancelEditCategory = () => {
    setEditingCategoryId(null);
    setEditingCategoryName('');
  };

  const handleSaveEditCategory = async (id: number) => {
    if (!editingCategoryName.trim()) return;
    
    try {
      await updateCategory(id, editingCategoryName);
      setEditingCategoryId(null);
      setEditingCategoryName('');
      fetchCategoriesData();
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
    }
  };

  const handleDeleteCategory = async (id: number) => {
    if (!window.confirm("Вы уверены, что хотите удалить эту категорию?")) {
      return;
    }
    
    try {
      await deleteCategory(id);
      fetchCategoriesData();
      toast({
        title: "Успех",
        description: "Категория успешно удалена",
        variant: "default",
      });
    } catch (error) {
      console.error('Error deleting category:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось удалить категорию. Возможно, она используется в проектах.",
        variant: "destructive",
      });
    }
  };
  
  // Tag actions
  const handleStartEditTag = (tag: Tag) => {
    setEditingTagId(tag.id);
    setEditingTagName(tag.name);
  };

  const handleCancelEditTag = () => {
    setEditingTagId(null);
    setEditingTagName('');
  };

  const handleSaveEditTag = async (id: number) => {
    if (!editingTagName.trim()) return;
    
    try {
      await updateTag(id, editingTagName);
      setEditingTagId(null);
      setEditingTagName('');
      fetchTagsData();
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
    }
  };

  const handleDeleteTag = async (id: number) => {
    if (!window.confirm("Вы уверены, что хотите удалить этот тег?")) {
      return;
    }
    
    try {
      await deleteTag(id);
      fetchTagsData();
      toast({
        title: "Успех",
        description: "Тег успешно удален",
        variant: "default",
      });
    } catch (error) {
      console.error('Error deleting tag:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось удалить тег. Возможно, он используется в проектах.",
        variant: "destructive",
      });
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <h2 className="text-2xl font-light text-fpm-blue">Управление категориями и тегами</h2>
        
        {/* Create Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>
                {dialogMode === 'category' ? 'Создать новую категорию' : 'Создать новый тег'}
              </DialogTitle>
              <DialogDescription>
                {dialogMode === 'category' 
                  ? 'Введите название для новой категории.' 
                  : 'Введите название для нового тега.'}
              </DialogDescription>
            </DialogHeader>
            <div className="flex items-center space-y-4 py-4">
              <Input
                value={dialogInputValue}
                onChange={(e) => setDialogInputValue(e.target.value)}
                placeholder={dialogMode === 'category' ? 'Название категории' : 'Название тега'}
                className="flex-1"
              />
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline" type="button">
                  Отмена
                </Button>
              </DialogClose>
              <Button 
                type="button" 
                onClick={handleDialogSubmit}
                disabled={isCreating || !dialogInputValue.trim()}
                className="bg-fpm-blue hover:bg-fpm-blue/90"
              >
                {isCreating ? 'Создание...' : 'Создать'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        
        {/* Tabs */}
        <Tabs defaultValue="categories" className="w-full">
          <TabsList className="mb-4 w-full">
            <TabsTrigger value="categories">Категории</TabsTrigger>
            <TabsTrigger value="tags">Теги</TabsTrigger>
          </TabsList>
          
          {/* Categories Tab */}
          <TabsContent value="categories">
            <Card>
              <CardContent className="pt-6">
                <div className="mb-4 flex gap-2">
                  <Button 
                    onClick={() => openCreateDialog('category')}
                    className="bg-fpm-blue hover:bg-fpm-blue/90"
                    type="button"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Добавить категорию
                  </Button>
                </div>
                
                {loadingCategories ? (
                  <div className="text-center py-4">
                    <p>Загрузка категорий...</p>
                  </div>
                ) : categories.length === 0 ? (
                  <div className="text-center py-4 bg-gray-50 rounded-lg">
                    <p className="text-gray-500">Категории отсутствуют. Создайте первую категорию.</p>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[50px]">ID</TableHead>
                        <TableHead>Название</TableHead>
                        <TableHead className="text-right">Действия</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {categories.map((category) => (
                        <TableRow key={category.id}>
                          <TableCell>{category.id}</TableCell>
                          <TableCell>
                            {editingCategoryId === category.id ? (
                              <Input 
                                value={editingCategoryName} 
                                onChange={(e) => setEditingCategoryName(e.target.value)} 
                                className="max-w-md"
                              />
                            ) : (
                              category.name
                            )}
                          </TableCell>
                          <TableCell className="text-right">
                            {editingCategoryId === category.id ? (
                              <div className="flex justify-end gap-2">
                                <Button 
                                  onClick={() => handleSaveEditCategory(category.id)} 
                                  variant="outline" 
                                  size="sm"
                                  type="button"
                                >
                                  <Save className="h-4 w-4 mr-1" />
                                  Сохранить
                                </Button>
                                <Button 
                                  onClick={handleCancelEditCategory} 
                                  variant="outline" 
                                  size="sm"
                                  type="button"
                                >
                                  <X className="h-4 w-4 mr-1" />
                                  Отмена
                                </Button>
                              </div>
                            ) : (
                              <div className="flex justify-end gap-2">
                                <Button 
                                  onClick={() => handleStartEditCategory(category)} 
                                  variant="outline" 
                                  size="sm"
                                  type="button"
                                >
                                  <Edit className="h-4 w-4 mr-1" />
                                  Изменить
                                </Button>
                                <Button 
                                  onClick={() => handleDeleteCategory(category.id)} 
                                  variant="destructive" 
                                  size="sm"
                                  type="button"
                                >
                                  <Trash2 className="h-4 w-4 mr-1" />
                                  Удалить
                                </Button>
                              </div>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Tags Tab */}
          <TabsContent value="tags">
            <Card>
              <CardContent className="pt-6">
                <div className="mb-4 flex gap-2">
                  <Button 
                    onClick={() => openCreateDialog('tag')}
                    className="bg-fpm-blue hover:bg-fpm-blue/90"
                    type="button"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Добавить тег
                  </Button>
                </div>
                
                {loadingTags ? (
                  <div className="text-center py-4">
                    <p>Загрузка тегов...</p>
                  </div>
                ) : tags.length === 0 ? (
                  <div className="text-center py-4 bg-gray-50 rounded-lg">
                    <p className="text-gray-500">Теги отсутствуют. Создайте первый тег.</p>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[50px]">ID</TableHead>
                        <TableHead>Название</TableHead>
                        <TableHead className="text-right">Действия</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {tags.map((tag) => (
                        <TableRow key={tag.id}>
                          <TableCell>{tag.id}</TableCell>
                          <TableCell>
                            {editingTagId === tag.id ? (
                              <Input 
                                value={editingTagName} 
                                onChange={(e) => setEditingTagName(e.target.value)} 
                                className="max-w-md"
                              />
                            ) : (
                              tag.name
                            )}
                          </TableCell>
                          <TableCell className="text-right">
                            {editingTagId === tag.id ? (
                              <div className="flex justify-end gap-2">
                                <Button 
                                  onClick={() => handleSaveEditTag(tag.id)} 
                                  variant="outline" 
                                  size="sm"
                                  type="button"
                                >
                                  <Save className="h-4 w-4 mr-1" />
                                  Сохранить
                                </Button>
                                <Button 
                                  onClick={handleCancelEditTag} 
                                  variant="outline" 
                                  size="sm"
                                  type="button"
                                >
                                  <X className="h-4 w-4 mr-1" />
                                  Отмена
                                </Button>
                              </div>
                            ) : (
                              <div className="flex justify-end gap-2">
                                <Button 
                                  onClick={() => handleStartEditTag(tag)} 
                                  variant="outline" 
                                  size="sm"
                                  type="button"
                                >
                                  <Edit className="h-4 w-4 mr-1" />
                                  Изменить
                                </Button>
                                <Button 
                                  onClick={() => handleDeleteTag(tag.id)} 
                                  variant="destructive" 
                                  size="sm"
                                  type="button"
                                >
                                  <Trash2 className="h-4 w-4 mr-1" />
                                  Удалить
                                </Button>
                              </div>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default AdminTaxonomies;
