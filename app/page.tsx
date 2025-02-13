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
    inventoryItem: {
      id: 0,
      name: "Inventory Item",
      inventoryID: 0,
      part: {
        id: 0,
        name: "Part 1",
        model: "Model",
        description: "Description",
        partNumber: "Part Number",
        partType: "Part Type"
      },
      modelID: 1,
      quantity: 500000,
      publicCount: 5000,
      notes: "Notes",
      attributes: "attributes"
    },
    status: "ACTIVE"
  }

  return <div>
    <Listing listing={listing}></Listing>
  </div>
}
