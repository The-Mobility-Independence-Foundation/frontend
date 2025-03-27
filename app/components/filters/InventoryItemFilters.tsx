import { useState } from "react";
import Filters, { FilterOptions } from "./Filters";
import { FilterType } from "@/app/types/FilterTypes";

interface InventoryItemFilterProps {
  onFilterValueChange: (values: Map<string, string>) => void;
}

export default function InventoryItemFilters({onFilterValueChange}: InventoryItemFilterProps) {
  const [selectedValues, setSelectedValues] = useState(new Map());
  
  // TODO: grab parts and models that exist in inventory
  const inventoryItemFilterOptions: FilterOptions = {
    multiSelects: [
      {
        title: "Part",
        filterType: FilterType.Part,
        options: ["Type 1", "Type 2", "Type 3", "Type 4"],
      },
      {
        title: "Model",
        filterType: FilterType.Model,
        options: ["Brand 1", "Brand 2", "Brand 3", "Brand 4"],
      },
    ],
    multiInputs: [{
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
    }],
    radioButtons: []
  }

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
        options={inventoryItemFilterOptions}
        selectedValues={selectedValues}
        onValueChange={onValueChange}
      />
  );
}