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

  return <>
  {listingID}
  </>
}