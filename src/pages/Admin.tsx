
import React, { useState, useEffect } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { X, Plus } from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';

const Admin = () => {
  const { toast } = useToast();
  const [emailList, setEmailList] = useState<string[]>([]);
  const [newEmail, setNewEmail] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');

  // For demonstration purposes, we're using localStorage to store the email list
  // In a real application, this would be stored in a database
  useEffect(() => {
    const storedEmails = localStorage.getItem('recipientEmails');
    if (storedEmails) {
      setEmailList(JSON.parse(storedEmails));
    }
    
    // Check if the user is already authenticated
    const authStatus = localStorage.getItem('isAuthenticated');
    if (authStatus === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  // Simple authentication (for demo purposes)
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real application, this would be a proper authentication system
    if (password === 'admin123') {
      setIsAuthenticated(true);
      localStorage.setItem('isAuthenticated', 'true');
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
  };

  const handleAddEmail = (e: React.FormEvent) => {
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
    setEmailList(updatedList);
    
    // Save to localStorage
    localStorage.setItem('recipientEmails', JSON.stringify(updatedList));
    
    // Clear input and show success message
    setNewEmail('');
    toast({
      title: "Email добавлен",
      description: `${newEmail} успешно добавлен в список получателей`,
      variant: "default",
    });
  };

  const handleRemoveEmail = (emailToRemove: string) => {
    const updatedList = emailList.filter(email => email !== emailToRemove);
    setEmailList(updatedList);
    localStorage.setItem('recipientEmails', JSON.stringify(updatedList));
    
    toast({
      title: "Email удален",
      description: `${emailToRemove} успешно удален из списка получателей`,
      variant: "default",
    });
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
        <h2 className="text-2xl font-light text-fpm-blue mb-6">Настройка списка получателей</h2>
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
    </AdminLayout>
  );
};

export default Admin;
