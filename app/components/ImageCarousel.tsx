export interface ImageReference {
  url: string;
  alt: string;
}

export interface Props {
  images: ImageReference[]
}

export default function ImageCarousel({images}: Props) {
  return <>
    Carousel!
  </>
}