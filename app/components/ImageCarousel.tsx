"use client"

import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image"

export interface ImageReference {
  url: string;
  alt: string;
  id: string | number;
  file: File | null;
}

export interface ImageCarouselProps {
  images: ImageReference[]
  className?: string
}

const BACKGROUND_ID = "image-carousel-background"

export default function ImageCarousel({images, className}: ImageCarouselProps) {
  const [fullScreenImageStartIndex, setFullScreenImageStartIndex] = useState(-1);

  const closeFullScreen = () => setFullScreenImageStartIndex(-1);

  const clickFullScreenBackground = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;
    if(target.id == BACKGROUND_ID) closeFullScreen();
  }

  useEffect(() => {
    if (typeof window !== "undefined") {
      const handleKeyDown = (event: KeyboardEvent) => {
        if(event.key === "Escape") {
          closeFullScreen();
        }
      }
      window.addEventListener("keydown", handleKeyDown);

      return () => window.removeEventListener("keydown", handleKeyDown);
    }
  }, [])

  return <>
    <div className={`${className}`}>
      <Carousel 
        className={`flex items-center justify-around mr-[1rem]`}
        opts={{loop: true}}
      >
        {images.length > 1 && <CarouselPrevious className="static" />}
        <CarouselContent>
          {images.map((image, index) => 
            <CarouselItem 
              key={image.id}
              className="max-h-[10rem] relative"
            >
              <Image 
                src={image.url} 
                alt={image.alt} 
                className="h-full mx-auto cursor-pointer rounded !relative"
                onClick={() => setFullScreenImageStartIndex(index)}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                priority
              />
            </CarouselItem>
          )}
        </CarouselContent>
        {images.length > 1 && <CarouselNext className="static" />}
      </Carousel>
    </div>

    {/** FULL SCREEN */}
    {fullScreenImageStartIndex >= 0 && 
      <FullScreenImage 
        clickFullScreenBackground={clickFullScreenBackground}
        images={images}
        fullScreenImageStartIndex={fullScreenImageStartIndex}
      />
    }
  </>
}

interface FullScreenImageProps {
  clickFullScreenBackground: (e: React.MouseEvent<HTMLDivElement>) => void,
  images: ImageReference[]
  fullScreenImageStartIndex: number
}

function FullScreenImage({clickFullScreenBackground, images, fullScreenImageStartIndex}: FullScreenImageProps) {  
  return createPortal(
    <div 
      className={`fixed inset-0 z-[100] bg-black/50 ease-in-out duration-200`}
      onClick={clickFullScreenBackground} 
      id={BACKGROUND_ID}
    >
      <Carousel 
        className={`flex items-center justify-center absolute w-[75%] top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2`}
        opts={{
          loop: true,
          startIndex: fullScreenImageStartIndex
        }}
      >
        {images.length > 1 && <CarouselPrevious className="static" />}
        <CarouselContent>
          {images.map(image => 
            <CarouselItem 
              key={image.id}
              className="relative w-auto flex items-center"
            >
              <Image 
                src={image.url} 
                alt={image.alt} 
                className="h-auto w-auto mx-auto !relative"
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
            </CarouselItem>
          )}
        </CarouselContent>
        {images.length > 1 && <CarouselNext className="static" />}
      </Carousel>
    </div>,
    document.body
  )}