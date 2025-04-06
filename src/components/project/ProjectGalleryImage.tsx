
import React from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Dialog, DialogTrigger, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface ProjectGalleryImageProps {
  src: string;
  alt: string;
  index: number;
  onClick: (index: number) => void;
  selectedImageIndex: number | null;
  onPrev: () => void;
  onNext: () => void;
}

const ProjectGalleryImage = ({
  src,
  alt,
  index,
  onClick,
  selectedImageIndex,
  onPrev,
  onNext
}: ProjectGalleryImageProps) => {
  const isMobile = useIsMobile();
  
  return (
    <Dialog open={selectedImageIndex === index} onOpenChange={(open) => !open && onClick(null)}>
      <DialogTrigger asChild>
        <div 
          className="cursor-zoom-in p-1 relative group" 
          onClick={(e) => {
            e.preventDefault();
            onClick(index);
          }}
        >
          <div className="overflow-hidden rounded-lg">
            {isMobile ? (
              // For mobile, ensure image is centered and fully visible
              <img 
                src={src} 
                alt={alt} 
                className="w-full h-48 object-contain rounded-lg transition-transform duration-300 group-hover:scale-105 mx-auto"
              />
            ) : (
              // On desktop, use cover for more aesthetic appearance
              <AspectRatio ratio={4/3} className="bg-muted">
                <img 
                  src={src} 
                  alt={alt} 
                  className="w-full h-full object-cover rounded-lg transition-transform duration-300 group-hover:scale-105"
                />
              </AspectRatio>
            )}
          </div>
        </div>
      </DialogTrigger>
      
      {selectedImageIndex === index && (
        <DialogContent className="max-w-5xl w-full p-2 bg-black/90 border-none">
          <DialogTitle className="sr-only">Просмотр изображения</DialogTitle>
          <DialogDescription className="sr-only">Полноэкранный просмотр фотографии проекта</DialogDescription>
          <div className="relative">
            <img 
              src={src} 
              alt={alt} 
              className="w-full h-auto object-contain max-h-[80vh]"
            />
            <button 
              onClick={(e) => {
                e.stopPropagation();
                onPrev();
              }}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-colors z-10"
              aria-label="Предыдущее изображение"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
            <button 
              onClick={(e) => {
                e.stopPropagation();
                onNext();
              }}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-colors z-10"
              aria-label="Следующее изображение"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
          </div>
        </DialogContent>
      )}
    </Dialog>
  );
};

export default ProjectGalleryImage;
