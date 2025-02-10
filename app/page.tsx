"use client";

import ImageCarousel from "./components/ImageCarousel";

export default function Home() {
  const images = [
    {
      url: "https://api.thecatapi.com/v1/images/search",
      alt: "Random Cat"
    },     {
      url: "https://api.thecatapi.com/v1/images/search",
      alt: "Another Random Cat"
    }, 
  ]

  return <div className="w-screen h-screen">
    <ImageCarousel images={images}></ImageCarousel>
  </div>
}
