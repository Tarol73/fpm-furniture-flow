
import React from 'react';
import { cn } from '@/lib/utils';

interface ProjectFilterProps {
  categories: string[];
  activeFilter: string;
  onFilterChange: (category: string) => void;
}

export const ProjectFilter: React.FC<ProjectFilterProps> = ({ 
  categories, 
  activeFilter, 
  onFilterChange 
}) => {
  return (
    <div className="flex flex-wrap gap-3 border-b border-gray-200 pb-4">
      {categories.map((category) => (
        <button
          key={category}
          onClick={() => onFilterChange(category)}
          className={cn(
            "px-4 py-2 rounded-md text-sm font-light transition-colors",
            activeFilter === category
              ? "bg-fpm-teal text-white"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          )}
        >
          {category}
        </button>
      ))}
    </div>
  );
};
