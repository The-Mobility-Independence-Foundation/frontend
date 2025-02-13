import { ListingData } from "../models/Listings";

export interface Props {
  listing: ListingData
}

export default function Listing({listing}: Props) {
  const inventoryItem = listing.inventoryItem;
  const part = inventoryItem.part;

  return <div className="w-full bg-[#F4F4F5] min-h-[11rem] drop-shadow-md rounded-sm px-[0.2rem] py-[0.5rem]">
    {/**TODO: Image Carousel */}
    <div>
      <h4>{part.name}</h4>
      <h5>{part.partNumber}</h5>
      <p className="mt-[revert]">{part.model}</p>
      <p>{part.partType}</p>
    </div>
  </div>
}