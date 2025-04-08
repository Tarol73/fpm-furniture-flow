
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Category } from '@/services/categoryService';

export interface Project {
  id: number;
  title: string;
  category: string;
  location: string;
  year: string;
  description: string;
  full_description?: string;
  challenge?: string;
  solution?: string;
  results?: string;
  client?: string;
  duration?: string;
  area?: string;
  budget?: string;
  image?: string;
  tags?: string[];
  categories?: Category[];
}

interface ProjectCardProps {
  project: Project;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300 hover-lift">
      <Link to={`/projects/${project.id}`}>
        <div className="relative h-60 overflow-hidden">
          <img 
            src={project.image || '/placeholder.svg'} 
            alt={project.title} 
            className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500"
          />
        </div>
      </Link>
      <div className="p-6">
        <div className="flex justify-between items-start mb-2">
          <Link to={`/projects/${project.id}`}>
            <h3 className="text-xl font-light text-gray-900 hover:text-fpm-teal transition-colors">{project.title}</h3>
          </Link>
          <span className="text-sm text-gray-500 font-light">{project.year}</span>
        </div>
        <div className="flex flex-col gap-2 mb-3">
          <p className="text-sm text-gray-500 font-light">{project.location}</p>
          <div className="flex flex-wrap gap-1">
            {project.categories && project.categories.length > 0 
              ? project.categories.map((category, index) => (
                <span key={category.id} className="text-sm text-gray-500 font-light">
                  {index > 0 ? ' • ' : ''}{category.name}
                </span>
              ))
              : <span className="text-sm text-gray-500 font-light">{project.category}</span>
            }
          </div>
        </div>
        <p className="text-gray-600 mb-4 font-light line-clamp-3">{project.description}</p>
        <div className="flex justify-between items-end">
          <div className="flex flex-wrap gap-2">
            {project.tags && project.tags.slice(0, 2).map((tag, index) => (
              <Badge key={index} variant="outline" className="bg-gray-100 text-gray-700 hover:bg-gray-200 font-light">
                {tag}
              </Badge>
            ))}
            {project.tags && project.tags.length > 2 && (
              <Badge variant="outline" className="bg-gray-100 text-gray-700 hover:bg-gray-200 font-light">
                +{project.tags.length - 2}
              </Badge>
            )}
          </div>
          <Link to={`/projects/${project.id}`}>
            <Button variant="ghost" size="sm" className="text-fpm-teal hover:text-fpm-teal/80">
              Подробнее
            </Button>
          </Link>
        </div>
      </div>
    </Card>
  );
};
