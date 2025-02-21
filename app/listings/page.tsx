"use client"

import { useSearchParams } from "next/navigation"
import Search from "../components/Search";
import { useState } from "react";
import { FilterComponentType } from "../types/FilterTypes";

export default function PublicListings() {
  const [listings, setListings] = useState([]);

  const params = useSearchParams();
  const userID = params.get("u_id");

  const receiveListings = (data: any[]) => {
    console.log(data);
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