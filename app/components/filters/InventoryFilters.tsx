import { useEffect, useState } from "react";
import Filters, { FilterOptions } from "./Filters";
import { FilterType } from "@/app/types/FilterTypes";

interface InventoryFilterProps {
  onFilterValueChange: (values: Map<string, string>) => void;
}

export default function InventoryFilters({onFilterValueChange}: InventoryFilterProps) {
  const [filterOptions, setFilterOptions] = useState<FilterOptions>();
  const [selectedValues, setSelectedValues] = useState<Map<string, string>>(new Map());

  useEffect(() => {
    setFilterOptions({
      multiSelects: [{
        title: "Archived",
        filterType: FilterType.Archived,
        options: ["Archived"]
      }],
      multiInputs: [],
      radioButtons: [],
      multiRadioButtons: []    
    });
  }, []);

  const onValueChange = (
    field: string, 
    newValue: string | number | boolean | string[]
  ) => {
    const newSelectedValues = new Map(selectedValues);
    if(field == FilterType.Archived) {
      const selectedValues = newValue as string[];
      const findArchived = selectedValues.find(value => value == "Archived")?.length;
      newSelectedValues.set("archived", findArchived && findArchived > 0 ? "true" : "false");
    }
    setSelectedValues(newSelectedValues);
    onFilterValueChange(newSelectedValues);
  }

  return (
    <> 
      {filterOptions && (
        <Filters 
          options={filterOptions}
          selectedValues={selectedValues}
          onValueChange={onValueChange}
        />
      )}
    </>
  )
}