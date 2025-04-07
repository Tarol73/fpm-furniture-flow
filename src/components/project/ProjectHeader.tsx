
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, MapPin, Calendar } from 'lucide-react';
import { Project } from '@/components/projects/ProjectCard';

interface ProjectHeaderProps {
  project: Project;
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
        <div>
          <span className="font-medium text-gray-700">{project.category}</span>
        </div>
      </div>
    </div>
  );
};

export default ProjectHeader;
