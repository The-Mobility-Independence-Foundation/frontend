import Listing from "./components/Listing";
import { ListingData } from "./models/Listings";

export default function Home() {
  const listing: ListingData = {
    id: "1",
    title: "Listing",
    attributes: {
      attr1: "attr1",
      attr2: "attr2",
      attr3: "attr3",
      attr4: "attr4",
      attr5: "attr5",
      attr6: "attr6",
      attr7: "attr7",
      attr8: "attr8",
      attr9: "attr9",
    },
    quantity: 30,
    latitude: -10,
    longitude: 30,
    inventoryItem: {
      id: 0,
      name: "Inventory Item",
      inventory: {
        id: 0,
        name: "Inventory",
        organization: {
          id: "1",
          name: "Organization",
          email: "org@org.com",
          phoneNumber: "(555) 555-5555"
        },
        description: "Inventory Description",
        location: "City, State"
      },
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
    status: "ACTIVE",
    attachment: "https://picsum.photos/300/200"
  }

  return <div>
    <Listing listing={listing}></Listing>
  </div>
}

