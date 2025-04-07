
import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Project } from '@/components/projects/ProjectCard';

interface ProjectDescriptionProps {
  project: Project;
}

const ProjectDescription = ({ project }: ProjectDescriptionProps) => {
  return (
    <div className="lg:col-span-2">
      <h2 className="text-2xl font-light text-fpm-blue mb-4">О проекте</h2>
      <p className="text-gray-700 mb-6 font-light">{project.description}</p>
      
      <ScrollArea className="h-[400px] w-full rounded-md border p-6">
        <div className="space-y-6">
          <p className="text-gray-700 font-light whitespace-pre-line">{project.full_description}</p>
          
          <h3 className="text-xl font-light text-fpm-blue mt-8">Вызов</h3>
          <p className="text-gray-700 font-light">{project.challenge}</p>
          
          <h3 className="text-xl font-light text-fpm-blue mt-6">Решение</h3>
          <p className="text-gray-700 font-light">{project.solution}</p>
          
          <h3 className="text-xl font-light text-fpm-blue mt-6">Результаты</h3>
          <p className="text-gray-700 font-light">{project.results}</p>
        </div>
      </ScrollArea>
    </div>
  );
};

export default ProjectDescription;
