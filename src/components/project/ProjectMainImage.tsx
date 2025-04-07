
import React from 'react';
import { Dialog, DialogTrigger, DialogContent } from '@/components/ui/dialog';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

interface ProjectMainImageProps {
  src: string;
  alt: string;
  onImageClick: () => void;
  selectedImageIndex: number | null;
  onPrev: () => void;
  onNext: () => void;
}

const ProjectMainImage = ({ 
  src, 
  alt, 
  onImageClick, 
  selectedImageIndex,
  onPrev,
  onNext 
}: ProjectMainImageProps) => {
  const isMobile = useIsMobile();
  
  return (
    <div className="relative mb-12 rounded-lg overflow-hidden shadow-md">
      <Dialog onOpenChange={(open) => !open && onImageClick()}>
        <DialogTrigger asChild>
          <div className="cursor-zoom-in relative" onClick={onImageClick}>
            <img 
              src={src} 
              alt={alt} 
              className={`w-full ${isMobile ? 'h-auto object-contain' : 'h-[60vh] object-cover'}`}
            />
            <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-10 transition-all duration-300 flex items-center justify-center">
              <span className="text-white opacity-0 hover:opacity-100 text-lg font-medium">
                Увеличить
              </span>
            </div>
          </div>
        </DialogTrigger>
        {selectedImageIndex === 0 && (
          <DialogContent className="max-w-5xl w-full p-2 bg-black/90 border-none">
            <div className="relative">
              <img 
                src={src} 
                alt={alt} 
                className="w-full h-auto object-contain max-h-[80vh]"
              />
              <button 
                onClick={onPrev}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-colors z-10"
                aria-label="Предыдущее изображение"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
              <button 
                onClick={onNext}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-colors z-10"
                aria-label="Следующее изображение"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            </div>
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
};

export default ProjectMainImage;
