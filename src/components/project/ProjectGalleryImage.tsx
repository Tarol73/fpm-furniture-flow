
import React from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Dialog, DialogTrigger, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { cn } from '@/lib/utils';

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
  const isSelected = selectedImageIndex === index;
  
  const handleImageClick = (e: React.MouseEvent) => {
    e.preventDefault();
    onClick(index);
  };
  
  const handleClose = () => onClick(null);
  
  const handlePrevClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onPrev();
  };
  
  const handleNextClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onNext();
  };
  
  return (
    <Dialog open={isSelected} onOpenChange={(open) => !open && handleClose()}>
      <DialogTrigger asChild>
        <div 
          className="cursor-zoom-in relative group h-full" 
          onClick={handleImageClick}
        >
          <div className={cn(
            "overflow-hidden rounded-lg w-full h-full flex justify-center items-center",
            "transition-all duration-300 hover:shadow-md"
          )}>
            {isMobile ? (
              // Mobile view - maintain aspect ratio but use object-cover
              <div className="w-full aspect-square flex justify-center items-center bg-gray-50">
                <img 
                  src={src} 
                  alt={alt} 
                  className="w-full h-full object-cover rounded-lg transition-transform duration-300 group-hover:scale-105"
                  loading="lazy"
                />
              </div>
            ) : (
              // Desktop view - use aspect ratio component
              <AspectRatio ratio={4/3} className="bg-muted w-full">
                <img 
                  src={src} 
                  alt={alt} 
                  className="w-full h-full object-cover rounded-lg transition-transform duration-300 group-hover:scale-105"
                  loading="lazy"
                />
              </AspectRatio>
            )}
          </div>
          
          {/* Overlay with subtle zoom indicator */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300 rounded-lg flex items-center justify-center">
            <span className="scale-0 group-hover:scale-100 transition-transform duration-300 bg-black/50 text-white rounded-full p-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m21 21-6-6m-8-6a6 6 0 1 1 12 0 6 6 0 0 1-12 0Z"></path>
              </svg>
            </span>
          </div>
        </div>
      </DialogTrigger>
      
      {isSelected && (
        <DialogContent className="max-w-7xl w-[95vw] p-1 sm:p-2 bg-black/95 border-none">
          <DialogTitle className="sr-only">Просмотр изображения</DialogTitle>
          <DialogDescription className="sr-only">Полноэкранный просмотр фотографии проекта</DialogDescription>
          
          {/* Close button */}
          <button 
            onClick={handleClose}
            className="absolute right-2 top-2 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-colors z-10"
            aria-label="Закрыть"
          >
            <X className="h-5 w-5" />
          </button>
          
          <div className="relative h-full w-full flex items-center justify-center">
            <img 
              src={src} 
              alt={alt} 
              className="max-w-full max-h-[85vh] object-contain"
            />
            
            {/* Navigation buttons with improved positioning */}
            <div className="absolute inset-x-0 top-1/2 transform -translate-y-1/2 flex justify-between pointer-events-none px-4">
              <button 
                onClick={handlePrevClick}
                className="pointer-events-auto bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-colors focus:outline-none focus:ring-2 focus:ring-white/20"
                aria-label="Предыдущее изображение"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
              
              <button 
                onClick={handleNextClick}
                className="pointer-events-auto bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-colors focus:outline-none focus:ring-2 focus:ring-white/20"
                aria-label="Следующее изображение"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            </div>
            
            {/* Image counter */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/70 text-white text-sm py-1 px-3 rounded-full">
              {index + 1} / {selectedImageIndex !== null ? selectedImageIndex + 1 : '?'}
            </div>
          </div>
        </DialogContent>
      )}
    </Dialog>
  );
};

export default ProjectGalleryImage;
