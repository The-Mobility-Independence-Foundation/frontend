"use client";

import ImageCarousel from "./components/ImageCarousel";
import {v4 as uuidv4} from "uuid";

export default function Home() {
  const images = [
    {
      url: "https://picsum.photos/300/200",
      alt: "Random Pic",
      id: uuidv4()
    },     {
      url: "https://picsum.photos/500/700",
      alt: "Another Random Pic",
      id: uuidv4()
    }, 
  ]

  return <div className="w-screen h-screen">
    <ImageCarousel images={images}></ImageCarousel>
  </div>
}

