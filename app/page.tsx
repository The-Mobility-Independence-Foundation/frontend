"use client"

import Image from "next/image";
import Filters from "./components/Filters";
import { useState } from "react";
import { FilterTypes } from "./types/filterTypes";

export default function Home() {
  const [filterValues, setFilterValues] = useState(new Map<string, any>([[FilterTypes.Active, true]]))

  function updateFilterValues(key: string, val: any) {
    let newFilterValues = new Map(filterValues);
    newFilterValues.set(key, val);
    setFilterValues(newFilterValues)
  }

  return (
    <Filters partTypes={["Type 1", "Type 2", "Type 3", "Type 4"]} brands={["Brand 1", "Brand 2", "Brand 3", "Brand 4"]} selectedValues={filterValues} onValueChange={updateFilterValues}></Filters>
  );
}