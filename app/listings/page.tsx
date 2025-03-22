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
import { statuses } from "../models/Status";

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
  const [listingsStatus, setListingsStatus] = useState<Map<ListingData, number>>(new Map());
  const [showBulkOps, setShowBulkOps] = useState(false);

  const params = useSearchParams();
  const userID = params.get("u_id");

  const receiveListings = (listings: any) => {
    // received from Search component
    setListings(listings as Listings);
    
    setListingsChecked(new Map((listings as Listings).data?.results.map(listing => [listing, false])));
    setListingsStatus(new Map((listings as Listings).data?.results.map(listing => [listing, statuses.indexOf(listing.status)+1])));
  }

  const onCheckboxChange = (listing: ListingData, checked: CheckedState) => {
    if(checked == 'indeterminate') { return; }

    let listingsCheckedUpdate = new Map(listingsChecked);
    listingsCheckedUpdate.set(listing, checked);

    setListingsChecked(new Map(listingsCheckedUpdate));

    setShowBulkOps(listingsCheckedUpdate.values().toArray().includes(true));
  }

  const onStatusChange = (listing: ListingData, status: number) => {
    let listingsStatusUpdate = new Map(listingsStatus);
    listingsStatusUpdate.set(listing, status);

    setListingsStatus(new Map(listingsStatusUpdate));
  }

  const onCheckAllChange = (checked: CheckedState) => {
    if(checked == 'indeterminate') { return; }

    let listingsCheckedUpdate = new Map(listingsChecked);
    listingsCheckedUpdate.forEach((val, key) => { listingsCheckedUpdate.set(key, checked) });

    setListingsChecked(new Map(listingsCheckedUpdate));

    setShowBulkOps(listingsCheckedUpdate.values().toArray().includes(true));
  }

  const onBulkStatusChange = (status: number) => {
    let listingsStatusUpdate = new Map(listingsStatus);
    listingsStatusUpdate.forEach((val, key) => { 
      if(listingsChecked.get(key)) {
        listingsStatusUpdate.set(key, status);
      }
    });

    setListingsStatus(new Map(listingsStatusUpdate));
  }

  return <div className="overflow-y-hidden">
    <Search 
      apiRoute={"/listings"} 
      receiveData={receiveListings} 
      placeholderText="Search Listings"
      filterType={FilterComponentType.LISTINGS}
    />
    {userID != null && showBulkOps && <BulkOperations onCheckboxChange={onCheckAllChange} onChangeActiveStatus={onBulkStatusChange}></BulkOperations>}
    <div className="px-[1rem] pt-[1.25rem] h-[75vh] min-h-0 overflow-y-auto">
      {listings.data?.results.map(listing => 
        <Listing 
          myListing={userID != null ? true : false}
          onCheckboxChange={userID != null ? (checked) => onCheckboxChange(listing, checked) : undefined}
          checked={userID != null ? listingsChecked.get(listing) : undefined}
          onStatusChange={userID != null ? (status) => onStatusChange(listing, status) : undefined}
          activeStatus={userID != null ? listingsStatus.get(listing) : undefined}
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