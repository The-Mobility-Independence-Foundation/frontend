import { useState } from "react";
import { ACTIVE, INACTIVE } from "../../models/Status";
import Filters, { FilterOptions } from "./Filters";
import { FilterType } from "@/app/types/FilterTypes";

export interface ListingFiltersProps {
  onFilterValueChange: (values: Map<string, string>) => void;
}

export default function ListingFilters({onFilterValueChange}: ListingFiltersProps) {
  const [selectedValues, setSelectedValues] = useState(new Map());

  // TODO: grab parts and models from DB
  const listingFilterOptions: FilterOptions = {
    multiSelects: [
      {
        title: "Part Type",
        filterType: FilterType.Part,
        options: ["Type 1", "Type 2", "Type 3", "Type 4"],
      },
      {
        title: "Model",
        filterType: FilterType.Model,
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
            onValueChange: onFilterValueChange
          },
          {
            placeholder: "Height (in.)",
            type: "number",
            minValue: "0",
            maxValue: "120",
            onValueChange: onFilterValueChange
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
            onValueChange: onFilterValueChange
          },
          {
            placeholder: "Upper Bound",
            type: "number",
            minValue: "0",
            maxValue: "100",
            onValueChange: onFilterValueChange
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
    map: true
  };

  const onValueChange = (field: string, newValue: string | number | boolean | string[]) => {
    const newSelectedValues = new Map(selectedValues);
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
