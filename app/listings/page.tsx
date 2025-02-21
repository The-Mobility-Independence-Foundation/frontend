"use client"

import { useSearchParams } from "next/navigation"
import Search from "../components/Search";
import { FilterOptions } from "../components/Filters";
import { FilterType } from "../types/filterTypes";
import { ACTIVE, INACTIVE } from "../models/Status";

export default function PublicListings() {
  const params = useSearchParams();
  const userID = params.get("u_id");

  const listingFilterOptions: FilterOptions = {
    multiSelects: [{
      title: "Part Type",
      filterType: FilterType.PartType,
      options: ["Type 1", "Type 2", "Type 3", "Type 4"]
    }, {
      title: "Brand",
      filterType: FilterType.Brand,
      options: ["Brand 1", "Brand 2", "Brand 3", "Brand 4"]
    }],
    multiInputs: [{
      title: "Dimensions",
      inputs: [{
        placeholder: "Width (in.)",
        type: "number",
        minValue: "0",
        maxValue: "120"
      }, {
        placeholder: "Height (in.)",
        type: "number",
        minValue: "0",
        maxValue: "120"
      }],
      divider: "X"
    }, {
      title: "Quantity",
      inputs: [{
        placeholder: "Lower Bound",
        type: "number",
        minValue: "0",
        maxValue: "100"
      }, {
        placeholder: "Upper Bound",
        type: "number",
        minValue: "0",
        maxValue: "100"
      }],
      divider: "-"
    }],
    radioButtons: [{
      filterType: FilterType.Active,
      label1: ACTIVE,
      label2: INACTIVE
    }]
  }

  const receiveListings = (data: any[]) => {
    console.log(data);
  }

  return <>
    <Search 
      apiRoute={"/listings"} 
      receiveData={receiveListings} 
      placeholderText="Search Listings"
      filterOptions={listingFilterOptions}
    />
  </>
}