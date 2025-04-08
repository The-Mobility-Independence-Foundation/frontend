"use client";

import Search from "../components/Search";
import { useCallback, useEffect, useState } from "react";
import { Listings } from "../models/Listings";
import Listing from "../components/Listing";
import { FilterComponentType } from "../types/FilterTypes";
import PaginationComponent from "../components/Pagination";
import { Spinner } from "@/components/ui/spinner";
import { userEmitterBus } from "@/lib/userEmitterBus";
import { UserData } from "../models/User";

export default function PublicListings() {
  const [listings, setListings] = useState<Listings>();
  const [loading, setLoading] = useState(false);
  const [userID, setUserID] = useState("");

  useEffect(() => {
    userEmitterBus.on("user", (userEmitted: UserData) => {
      setUserID(userEmitted.id);
    })
  })

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
            {listings.data.results.length == 0 && (
              <h4 className="text-gray-400">There are no public listings</h4>
            )}
            {!loading && listings.data.results.length > 0 && (
              <div className="flex flex-wrap">
                {listings.data.results.map((listing) => (
                  <Listing
                    listing={listing}
                    className="mb-[1rem] mx-auto"
                    key={listing.id}
                    userID={userID}
                  />
                ))}
              </div>
            )}
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
