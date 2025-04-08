
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Project } from '@/components/projects/ProjectCard';
import { Category } from '@/services/categoryService';

interface ProjectInfoSidebarProps {
  project: Project & { categories?: Category[] };
}

const ProjectInfoSidebar = ({ project }: ProjectInfoSidebarProps) => {
  return (
    <div className="lg:col-span-1">
      <div className="bg-gray-50 rounded-lg p-6 shadow-sm">
        <h3 className="text-xl font-light text-fpm-blue mb-4">Информация о проекте</h3>
        
        <div className="space-y-4">
          <div>
            <h4 className="text-sm text-gray-500 font-light">Клиент</h4>
            <p className="text-gray-700 font-light">{project.client}</p>
          </div>
          
          <div>
            <h4 className="text-sm text-gray-500 font-light">Длительность проекта</h4>
            <p className="text-gray-700 font-light">{project.duration}</p>
          </div>
          
          <div>
            <h4 className="text-sm text-gray-500 font-light">Площадь</h4>
            <p className="text-gray-700 font-light">{project.area}</p>
          </div>
          
          <div>
            <h4 className="text-sm text-gray-500 font-light">Бюджет</h4>
            <p className="text-gray-700 font-light">{project.budget}</p>
          </div>
          
          {project.categories && project.categories.length > 0 && (
            <div>
              <h4 className="text-sm text-gray-500 font-light mb-2">Категории</h4>
              <div className="flex flex-wrap gap-2">
                {project.categories.map(category => (
                  <Badge key={category.id} variant="outline" className="bg-gray-100 text-gray-700 hover:bg-gray-200 font-light">
                    {category.name}
                  </Badge>
                ))}
              </div>
            </div>
          )}
          
          {project.tags && project.tags.length > 0 && (
            <div>
              <h4 className="text-sm text-gray-500 font-light mb-2">Теги</h4>
              <div className="flex flex-wrap gap-2">
                {project.tags.map((tag, index) => (
                  <Badge key={index} variant="outline" className="bg-gray-100 text-gray-700 hover:bg-gray-200 font-light">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectInfoSidebar;
