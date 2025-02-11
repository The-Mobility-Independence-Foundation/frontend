import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import useEmblaCarousel from "embla-carousel-react";
import { useCallback, useState } from "react";

export interface ImageReference {
  url: string;
  alt: string;
  id: any;
}

export interface Props {
  images: ImageReference[]
}

export default function ImageCarousel({images}: Props) {
  const [fullScreenImageStartIndex, setFullScreenImageStartIndex] = useState(-1);

  const clickFullScreenBackground = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;
    if(target.id == "background") setFullScreenImageStartIndex(-1);
  }

  return <>
    <div  
      className={`w-[25rem]`}
    >
      <Carousel 
        className={`flex items-center`}
        opts={{loop: true}}
      >
        <CarouselPrevious className="static" />
        <CarouselContent>
          {images.map((image, index) => 
            <CarouselItem 
              key={image.id}
              className="max-h-[10rem]"
            >
              <img 
                src={image.url} 
                alt={image.alt} 
                className="h-full mx-auto cursor-pointer"
                onClick={() => setFullScreenImageStartIndex(index)}
              />
            </CarouselItem>
          )}
        </CarouselContent>
        <CarouselNext className="static" />
      </Carousel>
    </div>

    {/** FULL SCREEN */}
    {fullScreenImageStartIndex >= 0 && (
      <div 
        className={`fixed inset-0 z-100 bg-black/50 w-screen h-screen ease-in-out duration-200`}
        onClick={clickFullScreenBackground} 
        id="background"
      >
        <Carousel 
          className={`flex items-center absolute w-[75%] top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2`}
          opts={{
            loop: true,
            startIndex: fullScreenImageStartIndex
          }}
        >
          <CarouselPrevious className="static" />
          <CarouselContent>
            {images.map(image => 
              <CarouselItem 
                key={image.id}
                className="w-auto flex items-center"
              >
                <img 
                  src={image.url} 
                  alt={image.alt} 
                  className="h-auto w-auto mx-auto"
                />
              </CarouselItem>
            )}
          </CarouselContent>
          <CarouselNext className="static" />
        </Carousel>
      </div>
    )}
  </>
}