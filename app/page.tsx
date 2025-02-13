import Listing from "./components/Listing";
import { ListingData } from "./models/Listings";

export default function Home() {
  const listing: ListingData = {
    id: "1",
    title: "Listing",
    attributes: {
      attr1: "attr1",
      attr2: "attr2",
      attr3: "attr3"
    },
    quantity: 30,
    latitude: -10,
    longitude: 30,
    inventoryItemId: 1,
    status: "ACTIVE"
  }

  return <div>
    <Listing listing={listing}></Listing>
  </div>
}
