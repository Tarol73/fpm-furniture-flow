
import * as React from "react"
import { cn } from "@/lib/utils"
import { useCarousel } from "./carousel-context"
import { useIsMobile } from "@/hooks/use-mobile"

const CarouselContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const { carouselRef, orientation } = useCarousel()
  const isMobile = useIsMobile()

  return (
    <div ref={carouselRef} className="overflow-hidden">
      <div
        ref={ref}
        className={cn(
          "flex",
          // Removed negative margins completely to fix alignment issues
          orientation === "horizontal" ? 
            "mx-auto" : 
            "mt-0 flex-col",
          className
        )}
        {...props}
      />
    </div>
  )
})
CarouselContent.displayName = "CarouselContent"

export { CarouselContent }
