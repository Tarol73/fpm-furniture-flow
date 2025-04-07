
import { Project } from '@/components/projects/ProjectCard';

export interface ProjectPhoto {
  id: number;
  project_id: number;
  image_url: string;
  is_main: boolean;
  display_order: number;
}

export interface ExtendedProject extends Project {
  photos?: ProjectPhoto[];
  mainImage?: string;
}
