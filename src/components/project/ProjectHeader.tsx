
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, MapPin, Calendar, Tag } from 'lucide-react';
import { Project } from '@/components/projects/ProjectCard';
import { Category } from '@/services/categoryService';
import { Badge } from '@/components/ui/badge';

interface ProjectHeaderProps {
  project: Project & { categories?: Category[] };
}

const ProjectHeader = ({ project }: ProjectHeaderProps) => {
  return (
    <div className="mb-8">
      <Link to="/projects" className="inline-flex items-center text-fpm-teal hover:text-fpm-teal/80 transition-colors mb-6">
        <ArrowLeft className="mr-2 h-4 w-4" />
        <span>Вернуться ко всем проектам</span>
      </Link>
      
      <h1 className="text-4xl md:text-5xl font-light text-fpm-blue mb-4">{project.title}</h1>
      
      <div className="flex flex-wrap items-center gap-6 text-gray-600 mb-8">
        <div className="flex items-center">
          <MapPin className="h-5 w-5 mr-1 text-fpm-orange" />
          <span>{project.location}</span>
        </div>
        <div className="flex items-center">
          <Calendar className="h-5 w-5 mr-1 text-fpm-orange" />
          <span>{project.year}</span>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Tag className="h-5 w-5 mr-1 text-fpm-orange" />
          {project.categories && project.categories.length > 0 ? (
            project.categories.map(category => (
              <Badge key={category.id} variant="outline" className="bg-gray-100 text-gray-700 hover:bg-gray-200 font-light">
                {category.name}
              </Badge>
            ))
          ) : (
            <span className="font-medium text-gray-700">{project.category}</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectHeader;
