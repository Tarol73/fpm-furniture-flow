
import * as React from "react"
import { cn } from "@/lib/utils"
import { useCarousel } from "./carousel-context"
import { useIsMobile } from "@/hooks/use-mobile"

const CarouselItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const { orientation } = useCarousel()
  const isMobile = useIsMobile()

  return (
    <div
      ref={ref}
      role="group"
      aria-roledescription="slide"
      className={cn(
        "min-w-0 shrink-0 grow-0 basis-full",
        // Using consistent padding for all screen sizes
        orientation === "horizontal" ? 
          "px-2" : 
          "py-2",
        className
      )}
      {...props}
    />
  )
})
CarouselItem.displayName = "CarouselItem"

export { CarouselItem }
