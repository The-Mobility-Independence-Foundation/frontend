"use client"

import { useSearchParams } from "next/navigation"
import Search from "../components/Search";
import { useState } from "react";
import { FilterComponentType } from "../types/FilterTypes";
import { Listings } from "../models/Listings";
import Listing from "../components/Listing";
import Pagination, { PageChangeEvent } from "../components/Pagination";

export default function PublicListings() {
  const PAGE_LIMIT = 10; // 10 listings per page

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
  const [pageOffset, setPageOffset] = useState(0);

  const params = useSearchParams();
  const userID = params.get("u_id");

  const receiveListings = (listings: any) => {
    // received from Search component
    setListings(listings as Listings);
  }

  const onPageChange = (event: PageChangeEvent) => {
    // triggers search using new page
    setPageOffset((event.currentPage-1) * PAGE_LIMIT);
  }

  return <div className="overflow-y-hidden">
    <Search 
      apiRoute={"/listings"} 
      receiveData={receiveListings} 
      fetchLimit={PAGE_LIMIT}
      fetchOffset={pageOffset}
      placeholderText="Search Listings"
      filterType={FilterComponentType.LISTINGS}
    />
    <div className="px-[1rem] pt-[1.25rem] h-[75vh] min-h-0 overflow-y-auto">
      {listings.data?.results.map(listing => 
        <Listing 
          listing={listing}
          className="mb-[1rem]"
          key={listing.id}
        />
      )}
    </div>
    <Pagination 
      count={listings.data.count}
      totalCount={listings.data.totalCount}
      hasNext={listings.data.hasNext}
      nextToken={listings.data.nextToken}
      onPageChange={onPageChange}
    />
  </div>
}