
import React, { useState, useEffect } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { X, Plus, Save, Key } from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';
import { supabase, genericSupabase } from '@/integrations/supabase/client';
import { AdminSetting } from '@/types/project';

const Admin = () => {
  const { toast } = useToast();
  const [emailList, setEmailList] = useState<string[]>([]);
  const [newEmail, setNewEmail] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  // Fetch email list from database
  useEffect(() => {
    const checkAuthentication = () => {
      const authStatus = localStorage.getItem('isAuthenticated');
      if (authStatus === 'true') {
        setIsAuthenticated(true);
        fetchEmailList();
      }
    };
    
    checkAuthentication();
  }, []);

  const fetchEmailList = async () => {
    try {
      const { data, error } = await genericSupabase
        .from('admin_settings')
        .select('*')
        .eq('key', 'recipient_emails');
      
      if (error) throw error;
      
      if (data && data.length > 0) {
        const setting = data[0] as AdminSetting;
        setEmailList(JSON.parse(setting.value || '[]'));
      }
    } catch (error) {
      console.error('Error fetching email list:', error);
    }
  };

  // Simple authentication (for demo purposes)
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const { data, error } = await genericSupabase
        .from('admin_settings')
        .select('*')
        .eq('key', 'admin_password')
        .single();
      
      if (error) {
        throw error;
      }
      
      // If there's no password set yet, use the default one
      const setting = data as AdminSetting;
      const storedPassword = setting?.value || 'admin123';
      
      if (password === storedPassword) {
        setIsAuthenticated(true);
        localStorage.setItem('isAuthenticated', 'true');
        fetchEmailList();
        toast({
          title: "Успешный вход",
          description: "Вы успешно вошли в панель администратора",
          variant: "default",
        });
      } else {
        toast({
          title: "Ошибка входа",
          description: "Неверный пароль",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Login error:', error);
      toast({
        title: "Ошибка входа",
        description: "Произошла ошибка при проверке пароля",
        variant: "destructive",
      });
    }
  };

  const handleAddEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simple email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newEmail)) {
      toast({
        title: "Ошибка",
        description: "Пожалуйста, введите корректный email",
        variant: "destructive",
      });
      return;
    }
    
    // Check if email already exists
    if (emailList.includes(newEmail)) {
      toast({
        title: "Ошибка",
        description: "Этот email уже добавлен в список",
        variant: "destructive",
      });
      return;
    }
    
    // Add email to list
    const updatedList = [...emailList, newEmail];
    
    try {
      // Save to database
      const { error } = await genericSupabase
        .from('admin_settings')
        .upsert({
          key: 'recipient_emails',
          value: JSON.stringify(updatedList)
        }, { onConflict: 'key' });
      
      if (error) throw error;
      
      setEmailList(updatedList);
      setNewEmail('');
      
      toast({
        title: "Email добавлен",
        description: `${newEmail} успешно добавлен в список получателей`,
        variant: "default",
      });
    } catch (error) {
      console.error('Error saving email list:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось сохранить изменения",
        variant: "destructive",
      });
    }
  };

  const handleRemoveEmail = async (emailToRemove: string) => {
    const updatedList = emailList.filter(email => email !== emailToRemove);
    
    try {
      // Save to database
      const { error } = await genericSupabase
        .from('admin_settings')
        .upsert({
          key: 'recipient_emails',
          value: JSON.stringify(updatedList)
        }, { onConflict: 'key' });
      
      if (error) throw error;
      
      setEmailList(updatedList);
      
      toast({
        title: "Email удален",
        description: `${emailToRemove} успешно удален из списка получателей`,
        variant: "default",
      });
    } catch (error) {
      console.error('Error saving email list:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось сохранить изменения",
        variant: "destructive",
      });
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      toast({
        title: "Ошибка",
        description: "Пароли не совпадают",
        variant: "destructive",
      });
      return;
    }
    
    if (newPassword.length < 6) {
      toast({
        title: "Ошибка",
        description: "Пароль должен содержать минимум 6 символов",
        variant: "destructive",
      });
      return;
    }
    
    try {
      const { error } = await genericSupabase
        .from('admin_settings')
        .upsert({
          key: 'admin_password',
          value: newPassword
        }, { onConflict: 'key' });
      
      if (error) throw error;
      
      setNewPassword('');
      setConfirmPassword('');
      setIsChangingPassword(false);
      
      toast({
        title: "Пароль изменен",
        description: "Пароль администратора успешно изменен",
        variant: "default",
      });
    } catch (error) {
      console.error('Error changing password:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось изменить пароль",
        variant: "destructive",
      });
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        
        <section className="pt-28 pb-16 md:pt-40 md:pb-20 bg-fpm-blue text-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h1 className="text-4xl md:text-5xl font-light mb-6">Панель администратора</h1>
              <p className="text-xl md:text-2xl font-light leading-relaxed">
                Вход в систему управления
              </p>
            </div>
          </div>
        </section>
        
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <div className="bg-white p-8 rounded-lg shadow-md">
                <h2 className="text-2xl font-light text-fpm-blue mb-6">Вход в систему</h2>
                <form onSubmit={handleLogin} className="space-y-6">
                  <div className="space-y-2">
                    <label htmlFor="password" className="text-sm font-medium">
                      Пароль
                    </label>
                    <Input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="w-full"
                    />
                  </div>
                  <Button type="submit" className="bg-fpm-blue hover:bg-fpm-blue/90 text-white">
                    Войти
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </section>
        
        <Footer />
      </div>
    );
  }

  return (
    <AdminLayout>
      <div>
        <h2 className="text-2xl font-light text-fpm-blue mb-6">Настройки системы</h2>
        
        {/* Password Change Section */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium">Изменение пароля администратора</h3>
            <Button
              onClick={() => setIsChangingPassword(!isChangingPassword)}
              variant="outline"
              className="flex items-center gap-2"
            >
              <Key className="w-4 h-4" />
              {isChangingPassword ? 'Отменить' : 'Изменить пароль'}
            </Button>
          </div>
          
          {isChangingPassword && (
            <form onSubmit={handleChangePassword} className="bg-gray-50 p-4 rounded-md space-y-4">
              <div className="space-y-2">
                <label htmlFor="newPassword" className="text-sm font-medium">
                  Новый пароль
                </label>
                <Input
                  id="newPassword"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  className="w-full"
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="confirmPassword" className="text-sm font-medium">
                  Подтвердите пароль
                </label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="w-full"
                />
              </div>
              
              <Button
                type="submit"
                className="bg-fpm-teal hover:bg-fpm-teal/90 text-white"
              >
                <Save className="w-4 h-4 mr-2" />
                Сохранить
              </Button>
            </form>
          )}
        </div>
        
        {/* Email Recipients Section */}
        <div>
          <h3 className="text-lg font-medium mb-4">Настройка списка получателей</h3>
          <p className="text-gray-600 mb-8">
            Добавьте электронные адреса, на которые будут приходить заявки с формы обратной связи.
          </p>
          
          <form onSubmit={handleAddEmail} className="flex gap-2 mb-8">
            <Input
              type="email"
              placeholder="Введите email"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              required
              className="flex-grow"
            />
            <Button type="submit" className="bg-fpm-teal hover:bg-fpm-teal/90 text-white">
              <Plus className="w-4 h-4 mr-2" />
              Добавить
            </Button>
          </form>
          
          <div className="space-y-2">
            <h3 className="text-lg font-medium mb-4">Текущий список получателей:</h3>
            {emailList.length === 0 ? (
              <p className="text-gray-500 italic">Список пуст. Добавьте хотя бы один email.</p>
            ) : (
              <ul className="space-y-2">
                {emailList.map((email, index) => (
                  <li key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                    <span>{email}</span>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => handleRemoveEmail(email)}
                      className="text-gray-500 hover:text-red-500 hover:bg-transparent"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Admin;
