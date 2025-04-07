
import { useState, useCallback } from 'react';

interface UseCarouselNavigationProps {
  itemCount: number;
  initialIndex?: number | null;
  loop?: boolean;
}

interface UseCarouselNavigationReturn {
  currentIndex: number | null;
  setCurrentIndex: (index: number | null) => void;
  goToNext: () => void;
  goToPrev: () => void;
  goToItem: (index: number) => void;
  isFirst: boolean;
  isLast: boolean;
  resetNavigation: () => void;
}

/**
 * Custom hook for handling carousel navigation logic
 * @param itemCount Total number of items in the carousel
 * @param initialIndex Optional initial index (default: null)
 * @param loop Whether navigation should loop around when reaching the end (default: true)
 */
export const useCarouselNavigation = ({
  itemCount,
  initialIndex = null,
  loop = true,
}: UseCarouselNavigationProps): UseCarouselNavigationReturn => {
  const [currentIndex, setCurrentIndex] = useState<number | null>(initialIndex);

  const goToItem = useCallback((index: number) => {
    if (index >= 0 && index < itemCount) {
      setCurrentIndex(index);
    }
  }, [itemCount]);

  const goToNext = useCallback(() => {
    if (currentIndex === null) {
      setCurrentIndex(0);
      return;
    }

    if (currentIndex < itemCount - 1) {
      setCurrentIndex(currentIndex + 1);
    } else if (loop) {
      setCurrentIndex(0);
    }
  }, [currentIndex, itemCount, loop]);

  const goToPrev = useCallback(() => {
    if (currentIndex === null) {
      setCurrentIndex(itemCount - 1);
      return;
    }

    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    } else if (loop) {
      setCurrentIndex(itemCount - 1);
    }
  }, [currentIndex, itemCount, loop]);

  const resetNavigation = useCallback(() => {
    setCurrentIndex(null);
  }, []);

  const isFirst = currentIndex === 0;
  const isLast = currentIndex === itemCount - 1;

  return {
    currentIndex,
    setCurrentIndex,
    goToNext,
    goToPrev,
    goToItem,
    isFirst,
    isLast,
    resetNavigation,
  };
};
