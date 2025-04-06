
import React from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Dialog, DialogTrigger, DialogContent, DialogTitle } from '@/components/ui/dialog';

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
    <Dialog onOpenChange={(open) => !open && onClick(null)}>
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
              // On mobile, use contain to ensure full image is visible
              <img 
                src={src} 
                alt={alt} 
                className="w-full h-48 object-contain rounded-lg transition-transform duration-300 group-hover:scale-105"
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
    </Dialog>
  );
};

export default ProjectGalleryImage;
