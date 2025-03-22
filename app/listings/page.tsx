"use client"

import { useSearchParams } from "next/navigation"
import Search from "../components/Search";
import { useState } from "react";
import { FilterComponentType } from "../types/FilterTypes";
import { ListingData, Listings } from "../models/Listings";
import Listing from "../components/Listing";
import Pagination, { PageChangeEvent } from "../components/Pagination";
import { CheckedState } from "@radix-ui/react-checkbox";
import BulkOperations from "../components/BulkOperations";

export default function PublicListings() {

  const [listings, setListings] = useState<Listings>({
    message: "Default",
    data: {
      count: 0,
      totalCount: 0,
      hasNext: false,
      nextToken: null,
      results: []
    }
  });
  const [listingsChecked, setListingsChecked] = useState<Map<ListingData, boolean>>(new Map());
  const [showBulkOps, setShowBulkOps] = useState(false);

  const params = useSearchParams();
  const userID = params.get("u_id");

  const receiveListings = (listings: any) => {
    // received from Search component
    setListings(listings as Listings);
  }

  const onCheckboxChange = (listing: ListingData, checked: CheckedState) => {
    if(checked == 'indeterminate') { return; }

    let listingsCheckedUpdate = new Map(listingsChecked);
    listingsCheckedUpdate.set(listing, checked);

    setListingsChecked(new Map(listingsCheckedUpdate));

    setShowBulkOps(listingsCheckedUpdate.values().toArray().includes(true));
  }

  return <div className="overflow-y-hidden">
    <Search 
      apiRoute={"/listings"} 
      receiveData={receiveListings} 
      placeholderText="Search Listings"
      filterType={FilterComponentType.LISTINGS}
    />
    {showBulkOps && <BulkOperations></BulkOperations>}
    <div className="px-[1rem] pt-[1.25rem] h-[75vh] min-h-0 overflow-y-auto">
      {listings.data?.results.map(listing => 
        <Listing 
          myListing={userID != null ? true : false}
          onCheckboxChange={userID != null ? (checked) => onCheckboxChange(listing, checked) : undefined}
          listing={listing}
          className="mb-[1rem] mx-auto"
          key={listing.id}
        />
      )}
    </div>
    <Pagination 
      count={listings.data.count}
      totalCount={listings.data.totalCount}
      hasNext={listings.data.hasNext}
      nextToken={listings.data.nextToken}
    />
  </div>
}