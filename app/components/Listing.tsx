import { ListingData } from "../models/Listings";
import ImageCarousel, { ImageReference } from "./ImageCarousel";
import {v4 as uuidv4} from "uuid";

export interface Props {
  listing: ListingData
}

export default function Listing({listing}: Props) {
  const inventoryItem = listing.inventoryItem;
  const part = inventoryItem.part;
  const images: ImageReference[] = [
    {
      url: listing.attachment,
      alt: `Attachment for ${part.name}`,
      id: uuidv4()
    }
  ];


  return <div className="flex w-full bg-[#F4F4F5] min-h-[11rem] drop-shadow-md rounded-sm px-[0.2rem] py-[0.5rem]">
    <div className="flex">
      <ImageCarousel images={images}></ImageCarousel>
      <div>
        <h4>{part.name}</h4>
        <h5>{part.partNumber}</h5>
        <p className="mt-[revert]">{part.model}</p>
        <p>{part.partType}</p>
      </div>
    </div>
  </div>
}