
import React from 'react';
import { 
  Sidebar, 
  SidebarContent, 
  SidebarFooter, 
  SidebarHeader, 
  SidebarMenu, 
  SidebarMenuItem, 
  SidebarMenuButton, 
  SidebarProvider
} from '@/components/ui/sidebar';
import { LayoutDashboard, Settings, FolderKanban, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const handleLogout = () => {
    // For now, just simulate logout by clearing localStorage
    localStorage.removeItem('recipientEmails');
    localStorage.removeItem('isAuthenticated');
    
    toast({
      title: "Выход из системы",
      description: "Вы успешно вышли из панели администратора",
      variant: "default",
    });
    
    navigate('/admin');
  };
  
  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex min-h-screen w-full bg-gray-50">
        <Sidebar>
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
          {children}
        </main>
      </div>
    </SidebarProvider>
  );
};

export default AdminLayout;
