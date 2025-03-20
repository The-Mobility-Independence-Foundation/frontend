"use client"

import Search from "@/app/components/Search";
import { FilterComponentType } from "@/app/types/FilterTypes";
import { usePathname, useRouter } from "next/navigation";

export default function MyListings() {
  const myUserID = 1; // TODO: grab current user ID from db
  const router = useRouter();
  const path = usePathname();
  const pathSplit = path.split("/");
  const userIDInRoute = pathSplit[pathSplit.length-1];
  if(myUserID != parseInt(userIDInRoute)) {
    router.push(`/listings`);
  }

  const receiveListings = (data: any) => {
    // TODO: receive listings from Search
  }

  const onNewButtonClick = () => {
    // TODO: new listing dropdown
  }

  return <>
    <Search 
      apiRoute="/listing"
      receiveData={receiveListings}
      filterType={FilterComponentType.LISTINGS}
      placeholderText="Search My Listings"
      newButtonEvent={onNewButtonClick}
    />
  </>
}