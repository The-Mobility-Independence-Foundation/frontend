"use client"

import { usePathname, useSearchParams } from "next/navigation"

export default function PublicListings() {
  const params = useSearchParams();
  const userID = params.get("u_id");

  return <>Public Listings! {userID || "None"}</>
}