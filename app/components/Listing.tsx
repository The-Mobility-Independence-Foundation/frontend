import { ListingData } from "../models/Listings";
import ImageCarousel, { ImageReference } from "./ImageCarousel";
import {v4 as uuidv4} from "uuid";
import Link from "next/link";

export interface Props {
  listing: ListingData
}

export default function Listing({listing}: Props) {
  const userID = 1; // TODO: replace with real User ID

  const inventoryItem = listing.inventoryItem;
  const part = inventoryItem.part;
  const images: ImageReference[] = [
    {
      url: listing.attachment,
      alt: `Attachment for ${part.name}`,
      id: uuidv4()
    }
  ];


  return <div className="flex justify-between w-full bg-[#F4F4F5] min-h-[11rem] drop-shadow-md rounded-sm pl-[0.2rem] pr-[1rem] py-[0.5rem]">
    <div className="flex">
      <ImageCarousel images={images}></ImageCarousel>
      <div>
        <h4>{part.name}</h4>
        <h5>{part.partNumber}</h5>
        <p className="mt-[revert]">{part.model}</p>
        <p>{part.partType}</p>
      </div>
      <ul className="ml-[3rem] max-h-[10rem] overflow-y-auto">
        {Object.keys(listing.attributes).map(key => 
        <li className="mb-[0.25rem]" key={`${key}: ${listing.attributes[key]}`}>
          - {key}: {listing.attributes[key]}
        </li>)}
      </ul>
    </div>
    <div className="flex">
      <div className="mr-[5rem]">
        <h5 className="mb-[1rem]">{inventoryItem.inventory.name}</h5>
        <p>{inventoryItem.inventory.location}</p>
      </div>
      <div className="flex flex-col justify-between mr-[5rem]">
        <h5>{inventoryItem.inventory.organization.name}</h5>
        <div>
          <p>{inventoryItem.inventory.organization.email}</p>
          <p>{inventoryItem.inventory.organization.phoneNumber}</p>
        </div>
        <Link
          href={`/messages?u_id=${userID}`}
          className="w-full"
        >
          <button 
            className="w-full"
          >Message</button>
        </Link>
      </div>
      <div className="flex flex-col justify-between">
        <div className="mt-[1.5rem]">
          <p>Quantity Available:</p>
          <h5 className="w-min mx-auto">{listing.quantity}</h5>
        </div>
        <button>Create Order</button>
      </div>
    </div>
  </div>
}