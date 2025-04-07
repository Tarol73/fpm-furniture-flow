
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ExtendedProject } from '@/types/project';

interface RelatedProjectsProps {
  projects: ExtendedProject[];
}

const RelatedProjects = ({ projects }: RelatedProjectsProps) => {
  if (!projects || projects.length === 0) {
    return null;
  }
  
  return (
    <div className="mb-16">
      <h2 className="text-2xl font-light text-fpm-blue mb-6">Похожие проекты</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {projects.map((project) => (
          <div key={project.id} className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
            <Link to={`/projects/${project.id}`}>
              <img 
                src={project.mainImage} 
                alt={project.title} 
                className="w-full h-48 object-cover"
              />
            </Link>
            <div className="p-4">
              <Link to={`/projects/${project.id}`}>
                <h3 className="font-light text-lg mb-2">{project.title}</h3>
              </Link>
              <p className="text-gray-600 text-sm mb-3 font-light">{project.category}</p>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500 font-light">{project.location}</span>
                <Link to={`/projects/${project.id}`}>
                  <Button variant="ghost" size="sm" className="text-fpm-teal hover:text-fpm-teal/80 p-0">
                    Подробнее
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RelatedProjects;
