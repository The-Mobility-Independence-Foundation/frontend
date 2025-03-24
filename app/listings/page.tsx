"use client"

import { useSearchParams } from "next/navigation"
import Search from "../components/Search";
import { useState } from "react";
import { FilterComponentType } from "../types/FilterTypes";
import { Listings } from "../models/Listings";
import Listing from "../components/Listing";
import Pagination, { PageChangeEvent } from "../components/Pagination";
import KeysetPagination from "../components/KeysetPagination";

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

  const params = useSearchParams();
  const userID = params.get("u_id");

  const receiveListings = (listings: any) => {
    // received from Search component
    setListings(listings as Listings);
  }

  return <div className="overflow-y-hidden">
    <Search 
      apiRoute={"/listings"} 
      receiveData={receiveListings} 
      placeholderText="Search Listings"
      filterType={FilterComponentType.LISTINGS}
    />
    <div className="px-[1rem] pt-[1.25rem] h-[75vh] min-h-0 overflow-y-auto">
      {listings.data?.results.map(listing => 
        <Listing 
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
    {/* <KeysetPagination 
      hasNextPage={listings.data.hasNext}
      hasPreviousPage={false}
      nextCursor={listings.data.nextToken}
      count={listings.data.count}
    /> */}
  </div>
}