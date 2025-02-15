"use client"

import Filters from "./components/Filters";
import { useState } from "react";
import { FilterType } from "./types/filterTypes";
import { MultiInputInfo } from "./types/MultiInputInfo";
import { MultiSelectInfo } from "./types/MultiSelectInfo";
import { RadioButtonInfo } from "./types/RadioButtonInfo";

export default function Home() {
  const [filterValues, setFilterValues] = useState(new Map<string, any>([[FilterType.Active, true]]))

  function updateFilterValues(key: string, val: any) {
    let newFilterValues = new Map(filterValues);
    newFilterValues.set(key, val);
    setFilterValues(newFilterValues);
    console.log(newFilterValues);
  }

  let partTypeInfo: MultiSelectInfo = {
    title: "Part Type",
    filterType: FilterType.PartType,
    options: ["Type 1", "Type 2", "Type 3", "Type 4"]
  }
  let brandInfo: MultiSelectInfo = {
    title: "Brand",
    filterType: FilterType.Brand,
    options: ["Brand 1", "Brand 2", "Brand 3", "Brand 4"]
  }
  let multiSelects = [partTypeInfo, brandInfo];

  let dimensionsInfo: MultiInputInfo = {
    title: "Dimensions",
    inputs: [
      {placeholder: "Width (in).", type:"number", minValue:"0", maxValue:"", onValueChange:(newValue) => {updateFilterValues(FilterType.Width, newValue)}},
      {placeholder: "Height (in).", type:"number", minValue:"0", maxValue:"", onValueChange:(newValue) => {updateFilterValues(FilterType.Height, newValue)}}
    ],
    divider: "X"
  };
  let quantityInfo: MultiInputInfo = {
    title: "Quantity",
    inputs: [
      {placeholder: "Lower Bound", type:"number", minValue:"0", maxValue:"", onValueChange:(newValue) => {updateFilterValues(FilterType.QuantityMin, newValue)}},
      {placeholder: "Upper Bound", type:"number", minValue:"0", maxValue:"", onValueChange:(newValue) => {updateFilterValues(FilterType.QuantityMax, newValue)}}
    ],
    divider: "-"
  };
  let multiInputs = [dimensionsInfo, quantityInfo];

  let activeStatusInfo: RadioButtonInfo = {
    filterType: FilterType.Active,
    label1: "Active",
    label2: "Inactive"
  }
  let radioButtons = [activeStatusInfo];

  return (
    <Filters multiSelects={multiSelects} selectedValues={filterValues} multiInputs={multiInputs} radioButtons={radioButtons} onValueChange={updateFilterValues}></Filters>
  );
}

