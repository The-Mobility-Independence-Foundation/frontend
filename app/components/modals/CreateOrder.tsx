import { ListingData } from "@/app/models/Listings"
import ModalHeader from "./ModalHeader"

interface CreateOrderProps {
  listing: ListingData
  onClose: () => void
}

export default function CreateOrder({listing, onClose}: CreateOrderProps) {
  const inventoryItem = listing.inventoryItem;
  const part = inventoryItem.part;

  return <div>
    <ModalHeader 
      title={`Create an Order For ${part.name}`}
      onClose={onClose}
    />
  </div>
}