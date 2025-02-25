import { useState } from "react";
import { ACTIVE, INACTIVE } from "../models/Status";
import { FilterType } from "../types/FilterTypes";
import Filters, { FilterOptions } from "./Filters";

export interface ListingFiltersProps {
  onFilterValueChange: (values: Map<string, string>) => void;
}

export default function ListingFilters({onFilterValueChange}: ListingFiltersProps) {
  const [selectedValues, setSelectedValues] = useState(new Map());

  const listingFilterOptions: FilterOptions = {
    multiSelects: [
      {
        title: "Part Type",
        filterType: FilterType.PartType,
        options: ["Type 1", "Type 2", "Type 3", "Type 4"],
      },
      {
        title: "Brand",
        filterType: FilterType.Brand,
        options: ["Brand 1", "Brand 2", "Brand 3", "Brand 4"],
      },
    ],
    multiInputs: [
      {
        title: "Dimensions",
        inputs: [
          {
            placeholder: "Width (in.)",
            type: "number",
            minValue: "0",
            maxValue: "120",
          },
          {
            placeholder: "Height (in.)",
            type: "number",
            minValue: "0",
            maxValue: "120",
          },
        ],
        divider: "X",
      },
      {
        title: "Quantity",
        inputs: [
          {
            placeholder: "Lower Bound",
            type: "number",
            minValue: "0",
            maxValue: "100",
          },
          {
            placeholder: "Upper Bound",
            type: "number",
            minValue: "0",
            maxValue: "100",
          },
        ],
        divider: "-",
      },
    ],
    radioButtons: [
      {
        filterType: FilterType.Active,
        label1: ACTIVE,
        label2: INACTIVE,
      },
    ],
  };

  const onValueChange = (field: string, newValue: any) => {
    let newSelectedValues = new Map(selectedValues);
    if (newValue == null || newValue == "") {
      newSelectedValues.delete(field);
    } else {
      newSelectedValues.set(field, newValue);
    }
    setSelectedValues(newSelectedValues);
    onFilterValueChange(newSelectedValues);
  };

  return (
    <Filters
      options={listingFilterOptions}
      selectedValues={selectedValues}
      onValueChange={onValueChange}
    />
  );
}
