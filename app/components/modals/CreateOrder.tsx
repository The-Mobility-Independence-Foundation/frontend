import { ListingData } from "@/app/models/Listings"
import ModalHeader from "./ModalHeader"
import ModalBody from "./ModalBody";

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
    <ModalBody>
      <div>Body!</div>
    </ModalBody>
  </div>
}