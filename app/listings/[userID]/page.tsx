"use client"

import CreateListing from "@/app/components/CreateListing";
import Search from "@/app/components/Search";
import { FilterComponentType } from "@/app/types/FilterTypes";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

export default function MyListings() {
  const [newListingDropdownIsOpen, setNewListingDropdownIsOpen] = useState(false);

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

  return <>
    <div>
      <Search 
        apiRoute="/listing"
        receiveData={receiveListings}
        filterType={FilterComponentType.LISTINGS}
        placeholderText="Search My Listings"
        newButtonEvent={() => setNewListingDropdownIsOpen(true)}
      />
        <div className={`absolute z-50 ${newListingDropdownIsOpen ? "opacity-100" : "opacity-0 pointer-events-none"} transition-all duration-200 ease-in-out w-screen`}>
          <CreateListing
            onClose={() => setNewListingDropdownIsOpen(false)}
          />
          <div className="w-full h-screen bg-black/20" onClick={() => setNewListingDropdownIsOpen(false)} />
        </div>
    </div>
  </>
}