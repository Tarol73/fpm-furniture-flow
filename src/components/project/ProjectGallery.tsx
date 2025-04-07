
import React from 'react';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { ProjectPhoto } from '@/types/project';
import ProjectGalleryImage from './ProjectGalleryImage';

interface ProjectGalleryProps {
  photos: ProjectPhoto[];
  projectTitle: string;
  selectedImageIndex: number | null;
  onImageClick: (index: number) => void;
  onPrev: () => void;
  onNext: () => void;
}

const ProjectGallery = ({ 
  photos, 
  projectTitle,
  selectedImageIndex,
  onImageClick,
  onPrev,
  onNext
}: ProjectGalleryProps) => {
  if (!photos || photos.length === 0) {
    return null;
  }
  
  return (
    <div className="mb-16">
      <h2 className="text-2xl font-light text-fpm-blue mb-6">Галерея проекта</h2>
      <Carousel className="w-full">
        <CarouselContent>
          {photos.map((photo, index) => (
            <CarouselItem key={index} className="basis-1/1 sm:basis-1/2 md:basis-1/3 lg:basis-1/4">
              <ProjectGalleryImage
                src={photo.image_url}
                alt={`${projectTitle} - изображение ${index + 1}`}
                index={index}
                onClick={onImageClick}
                selectedImageIndex={selectedImageIndex}
                onPrev={onPrev}
                onNext={onNext}
              />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  );
};

export default ProjectGallery;
