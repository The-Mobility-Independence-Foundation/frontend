"use client"

import { useSearchParams } from "next/navigation"
import Search from "../components/Search";

export default function PublicListings() {
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
      filter={true}
    />
  </>
}