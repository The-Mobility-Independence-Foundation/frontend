"use client"

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import backendService from "../services/backend.service";
import { ListingData, testListingData } from "../models/Listings";

export default function ListingPage() {
  const [listing, setListing] = useState<ListingData>();

  const params = useSearchParams();
  const listingID = params.get("listing_id");

  useEffect(() => {
    // TODO: uncomment when backend is hooked up
    // backendService.get(`/listings/${listingID}`)
    //   .then(response => {
    //     const data = response?.data;
    //     setListing(data as ListingData);
    //   });
    setListing(testListingData)
  }, [listingID])

  return (
    <>
      {listing && (
        <>
          {/** TOP BAR */}
          <div className="w-full flex p-[0.65rem] bg-[#F4F4F5] drop-shadow-md overflow-hidden">
            <div>
              <h2>{listing.title}</h2>
              <p className="max-w-[20rem] text-sm">{listing.inventoryItem.part.description}</p>
              <div className="flex mt-[1rem]">
                <div>
                  <h5>{listing.inventoryItem.part.partNumber}</h5>
                  <p className="mt-[revert]">
                    {listing.inventoryItem.part.model}
                  </p>
                  <p>{listing.inventoryItem.part.partType}</p>
                </div>
                <ul className="ml-[3rem] max-h-[6rem] overflow-y-auto">
                  {Object.keys(listing.attributes).map((key) => (
                    <li
                      className="mb-[0.25rem]"
                      key={`${key}: ${listing.attributes[key]}`}
                    >
                      - {key}: {listing.attributes[key]}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
          {/** RECOMMENDED LISTINGS */}
          <div></div>
        </>
      )}
    </>
  );
}