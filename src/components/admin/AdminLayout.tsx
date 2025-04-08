
import React, { useState } from 'react';
import { 
  Sidebar, 
  SidebarContent, 
  SidebarFooter, 
  SidebarHeader, 
  SidebarMenu, 
  SidebarMenuItem, 
  SidebarMenuButton, 
  SidebarProvider,
  SidebarTrigger
} from '@/components/ui/sidebar';
import { LayoutDashboard, Settings, FolderKanban, LogOut, HomeIcon, Menu } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const handleLogout = () => {
    // Clear localStorage
    localStorage.removeItem('isAuthenticated');
    
    toast({
      title: "Выход из системы",
      description: "Вы успешно вышли из панели администратора",
      variant: "default",
    });
    
    navigate('/admin');
  };

  const navigateTo = (path: string) => {
    navigate(path);
    setMobileMenuOpen(false);
  };
  
  // Mobile navigation menu
  const MobileNav = () => (
    <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="md:hidden">
          <Menu className="h-6 w-6" />
          <span className="sr-only">Toggle Menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[250px] sm:w-[300px] px-0 z-[100]">
        <div className="flex flex-col h-full">
          <div className="py-4 border-b">
            <div className="flex items-center gap-2 px-4">
              <LayoutDashboard className="h-6 w-6 text-fpm-blue" />
              <span className="text-xl font-semibold text-fpm-blue">Панель администратора</span>
            </div>
          </div>
          
          <div className="flex-1 py-6">
            <div className="px-2 space-y-1">
              <Button 
                variant="ghost" 
                className="w-full justify-start" 
                onClick={() => navigateTo('/admin')}
              >
                <Settings className="mr-2 h-5 w-5" />
                <span>Настройки системы</span>
              </Button>
              
              <Button 
                variant="ghost" 
                className="w-full justify-start" 
                onClick={() => navigateTo('/admin/projects')}
              >
                <FolderKanban className="mr-2 h-5 w-5" />
                <span>Управление проектами</span>
              </Button>
              
              <Button 
                variant="ghost" 
                className="w-full justify-start" 
                onClick={() => window.open('/', '_blank')}
              >
                <HomeIcon className="mr-2 h-5 w-5" />
                <span>Перейти на сайт</span>
              </Button>
            </div>
          </div>
          
          <div className="py-4 border-t">
            <Button 
              variant="ghost" 
              className="w-full justify-start text-red-500" 
              onClick={handleLogout}
            >
              <LogOut className="mr-2 h-5 w-5" />
              <span>Выйти</span>
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
  
  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex min-h-screen w-full bg-gray-50">
        {/* Desktop Sidebar */}
        <Sidebar className="hidden md:flex">
          <SidebarHeader className="py-4">
            <div className="flex items-center gap-2 px-4">
              <LayoutDashboard className="h-6 w-6 text-fpm-blue" />
              <span className="text-xl font-semibold text-fpm-blue">Панель администратора</span>
            </div>
          </SidebarHeader>
          
          <SidebarContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton 
                  asChild 
                  tooltip="Настройки системы"
                  onClick={() => navigate('/admin')}
                >
                  <div className="flex items-center">
                    <Settings className="mr-2 h-5 w-5" />
                    <span>Настройки системы</span>
                  </div>
                </SidebarMenuButton>
              </SidebarMenuItem>
              
              <SidebarMenuItem>
                <SidebarMenuButton 
                  asChild 
                  tooltip="Проекты"
                  onClick={() => navigate('/admin/projects')}
                >
                  <div className="flex items-center">
                    <FolderKanban className="mr-2 h-5 w-5" />
                    <span>Управление проектами</span>
                  </div>
                </SidebarMenuButton>
              </SidebarMenuItem>
              
              <SidebarMenuItem>
                <SidebarMenuButton 
                  asChild 
                  tooltip="Перейти на сайт"
                  onClick={() => window.open('/', '_blank')}
                >
                  <div className="flex items-center">
                    <HomeIcon className="mr-2 h-5 w-5" />
                    <span>Перейти на сайт</span>
                  </div>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarContent>
          
          <SidebarFooter className="border-t border-gray-200 py-4">
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton 
                  asChild
                  tooltip="Выйти"
                  onClick={handleLogout}
                >
                  <div className="flex items-center text-red-500">
                    <LogOut className="mr-2 h-5 w-5" />
                    <span>Выйти</span>
                  </div>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarFooter>
        </Sidebar>
        
        <main className="flex-1 p-6">
          <div className="mb-6 flex items-center justify-between">
            <MobileNav />
            <div className="md:hidden flex-1 text-center">
              <h1 className="text-xl font-semibold text-fpm-blue">Панель администратора</h1>
            </div>
          </div>
          {children}
        </main>
      </div>
    </SidebarProvider>
  );
};

export default AdminLayout;
