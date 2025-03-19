import { useState } from "react";
import Filters, { FilterOptions } from "./Filters";

interface InventoryItemFilterProps {
  onFilterValueChange: (values: Map<string, string>) => void;
}

export default function InventoryItemFilters({onFilterValueChange}: InventoryItemFilterProps) {
    const [selectedValues, setSelectedValues] = useState(new Map());
  
  const inventoryItemFilterOptions: FilterOptions = {
    multiSelects: [],
    multiInputs: [],
    radioButtons: []
  }

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
        options={inventoryItemFilterOptions}
        selectedValues={selectedValues}
        onValueChange={onValueChange}
      />
  );
}