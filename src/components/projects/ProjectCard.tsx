
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';

interface Project {
  id: number;
  title: string;
  category: string;
  location: string;
  year: string;
  description: string;
  image: string;
  tags: string[];
}

interface ProjectCardProps {
  project: Project;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300 hover-lift">
      <div className="relative h-60 overflow-hidden">
        <img 
          src={project.image} 
          alt={project.title} 
          className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500"
        />
      </div>
      <div className="p-6">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-xl font-light text-gray-900">{project.title}</h3>
          <span className="text-sm text-gray-500 font-light">{project.year}</span>
        </div>
        <p className="text-sm text-gray-500 mb-3 font-light">{project.location} • {project.category}</p>
        <p className="text-gray-600 mb-4 font-light line-clamp-3">{project.description}</p>
        <div className="flex flex-wrap gap-2 mt-4">
          {project.tags.map((tag, index) => (
            <Badge key={index} variant="outline" className="bg-gray-100 text-gray-700 hover:bg-gray-200 font-light">
              {tag}
            </Badge>
          ))}
        </div>
      </div>
    </Card>
  );
};
