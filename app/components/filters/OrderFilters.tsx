import { useState } from "react";
import Filters, { FilterOptions } from "./Filters";
import { FilterType } from "@/app/types/FilterTypes";
import { FULLFILLED, INITIATED, PENDING, VOIDED } from "../Order";
import { capitalize } from "@/app/models/Status";

interface OrderFilterProps {
  onFilterValueChange: (values: Map<string, string>) => void;
}

export default function OrderFilters({onFilterValueChange}: OrderFilterProps) {
    const [selectedValues, setSelectedValues] = useState(new Map());
  
    const orderFilterOptions: FilterOptions = {
      multiSelects: [
        {
          title: "Status",
          filterType: FilterType.Status,
          options: [
            capitalize(INITIATED), 
            capitalize(FULLFILLED), 
            capitalize(PENDING), 
            capitalize(VOIDED)
          ]
        }
      ],
      multiInputs: [],
      radioButtons: []
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
        options={orderFilterOptions}
        selectedValues={selectedValues}
        onValueChange={onValueChange}
      />
    )
}