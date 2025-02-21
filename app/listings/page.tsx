"use client"

import { useSearchParams } from "next/navigation"
import Search from "../components/Search";
import { useState } from "react";
import { FilterComponentType } from "../types/FilterTypes";
import { Listings } from "../models/Listings";

export default function PublicListings() {
  const [listings, setListings] = useState<Listings[]>([]);

  const params = useSearchParams();
  const userID = params.get("u_id");

  const receiveListings = (data: any[]) => {
    setListings(data as Listings[]);
  }

  return <>
    <Search 
      apiRoute={"/listings"} 
      receiveData={receiveListings} 
      placeholderText="Search Listings"
      filterType={FilterComponentType.LISTINGS}
    />
  </>
}