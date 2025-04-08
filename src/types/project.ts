
import { Category } from '../services/categoryService';

export interface ProjectPhoto {
  id: number;
  project_id: number;
  image_url: string;
  is_main: boolean;
  display_order: number;
  created_at?: string;
}

export interface ProjectTag {
  id: number;
  name: string;
}

export interface ExtendedProject {
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
  created_at?: string;
  updated_at?: string;
  photos?: ProjectPhoto[];
  tags?: string[];
  mainImage?: string;
  categories?: Category[];
}
