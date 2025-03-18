"use client"

import { useSearchParams } from "next/navigation"

export default function Inventory() {

  const params = useSearchParams();
  const orgID = params.get("org_id");
  const inventoryID = params.get("inventory_id");

  return <>Inventory!</>
}