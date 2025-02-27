import { ListingData } from "@/app/models/Listings"
import ModalHeader from "./ModalHeader"
import ModalBody from "./ModalBody";
import ImageCarousel, { ImageReference } from "../ImageCarousel";
import {v4 as uuidv4} from "uuid";

interface CreateOrderProps {
  listing: ListingData
  listingImages: ImageReference[]
  onClose: () => void
}

export default function CreateOrder({listing, listingImages, onClose}: CreateOrderProps) {
  const inventoryItem = listing.inventoryItem;
  const part = inventoryItem.part;

  return (
    <div>
      <ModalHeader
        title={`Create an Order For ${part.name}`}
        onClose={onClose}
      />
      <ModalBody>
        <>
          <div className="flex">
            <div>
              <h4>{part.name}</h4>
              <h5>{part.partNumber}</h5>
              <p className="mt-[revert]">{part.model}</p>
              <p>{part.partType}</p>
            </div>
            <ul className="ml-[3rem] max-h-[10rem] overflow-y-auto">
              {Object.keys(listing.attributes).map((key) => (
                <li
                  className="mb-[0.25rem]"
                  key={`${key}: ${listing.attributes[key]}`}
                >
                  - {key}: {listing.attributes[key]}
                </li>
              ))}
            </ul>
            <div
                className="flex flex-col ml-[2.5rem] text-right"
              >
                <h5>{inventoryItem.inventory.organization.name}</h5>
                <div>
                  <p>{inventoryItem.inventory.organization.email}</p>
                  <p>{inventoryItem.inventory.organization.phoneNumber}</p>
                </div>
            </div>
          </div>
          <ImageCarousel 
            images={listingImages}
            className="mx-auto my-[1rem] w-min"
          />

        </>
      </ModalBody>
    </div>
  );
}
