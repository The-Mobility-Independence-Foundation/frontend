"use client";

// import { useSearchParams } from "next/navigation"
import Search from "../components/Search";
import { useCallback, useState } from "react";
import { Listings } from "../models/Listings";
import Listing from "../components/Listing";
import Pagination from "../components/Pagination";
import { FilterComponentType } from "../types/FilterTypes";
import KeysetPagination from "../components/KeysetPagination";
// import KeysetPagination from "../components/KeysetPagination";

export default function PublicListings() {
  const [listings, setListings] = useState<Listings>();

  const receiveListings = useCallback((listings: object) => {
    // received from Search component
    setListings(listings as Listings);
  }, []);

  return (
    <div className="overflow-y-hidden">
      <Search
        apiRoute={"/listings"}
        searchBy={"name"}
        receiveResponse={receiveListings}
        placeholderText="Search Listings"
        filterType={FilterComponentType.LISTINGS}
      />
      {listings && (
        <>
          <div className="px-[1rem] pt-[1.25rem] h-[75vh] min-h-0 overflow-y-auto">
            {listings.data?.results.map((listing) => (
              <Listing
                listing={listing}
                className="mb-[1rem] mx-auto"
                key={listing.id}
              />
            ))}
          </div>
          <KeysetPagination
            hasNextPage={listings.data.hasNextPage}
            hasPreviousPage={listings.data.hasPreviousPage}
            nextCursor={listings.data.nextCursor}
            previousCursor={listings.data.previousCursor}
          />
        </>
      )}
    </div>
  );
}
