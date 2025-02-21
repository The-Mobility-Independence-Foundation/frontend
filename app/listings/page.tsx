"use client"

import { useSearchParams } from "next/navigation"
import Search from "../components/Search";
import { useState } from "react";
import { FilterComponentType } from "../types/FilterTypes";
import { Listings } from "../models/Listings";
import Listing from "../components/Listing";

export default function PublicListings() {
  const [listings, setListings] = useState<Listings>({
    message: "Default",
    data: {
      count: 0,
      hasNext: false,
      nextToken: "",
      results: []
    }
  });

  const params = useSearchParams();
  const userID = params.get("u_id");

  const receiveListings = (data: any) => {
    setListings(data as Listings);
  }

  return <>
    <Search 
      apiRoute={"/listings"} 
      receiveData={receiveListings} 
      placeholderText="Search Listings"
      filterType={FilterComponentType.LISTINGS}
    />
    <div className="px-[1rem] py-[1.5rem]">
      {listings.data?.results.map(listing => 
        <Listing 
          listing={listing}
          className="mb-[1rem]"
        />
      )}
    </div>
  </>
}