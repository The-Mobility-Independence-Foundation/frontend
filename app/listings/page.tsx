"use client";

import Search from "../components/Search";
import { useCallback, useState } from "react";
import { Listings } from "../models/Listings";
import Listing from "../components/Listing";
import { FilterComponentType } from "../types/FilterTypes";
import PaginationComponent from "../components/Pagination";
import { Spinner } from "@/components/ui/spinner";

export default function PublicListings() {
  const [listings, setListings] = useState<Listings>();
  const [loading, setLoading] = useState(false);

  const receiveListings = useCallback((listings: object) => {
    // received from Search component
    setListings(listings as Listings);
  }, []);

  const loadingSearchResponse = useCallback((loading: boolean) => {
    setLoading(loading);
  }, []);

  return (
    <div className="overflow-y-hidden">
      <Search
        apiRoute={"/listings"}
        searchBy={"query"}
        receiveResponse={receiveListings}
        placeholderText="Search Listings"
        filterType={FilterComponentType.LISTINGS}
        loadingResponse={loadingSearchResponse}
      />
      {listings && (
        <>
          <div className="px-[1rem] pt-[1.25rem] h-[75vh] min-h-0 overflow-y-auto">
            {loading && <Spinner />}
            {!loading && <div className="flex flex-wrap">
              {listings.data.results.map((listing) => (
              <Listing
                listing={listing}
                className="mb-[1rem] mx-auto"
                key={listing.id}
              />
            ))}</div>}
          </div>
          <PaginationComponent
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
