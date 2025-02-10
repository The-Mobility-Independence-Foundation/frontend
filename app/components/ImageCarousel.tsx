import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";

export interface ImageReference {
  url: string;
  alt: string;
  id: any;
}

export interface Props {
  images: ImageReference[]
}

export default function ImageCarousel({images}: Props) {
  // TODO: add arrows
  // TODO: add full-screen mode


  return <div className="max-w-[25rem]">
  <Carousel>
    <CarouselContent>
      {images.map(image => 
        <CarouselItem 
          key={image.id}
          className="max-h-[10rem]"
        >
          <img 
            src={image.url} 
            alt={image.alt} 
            className="h-full mx-auto" 
          />
        </CarouselItem>
      )}
    </CarouselContent>
  </Carousel>
  </div>
}