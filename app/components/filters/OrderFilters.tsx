import { useState } from "react";
import Filters, { FilterOptions } from "./Filters";
import { FilterType } from "@/app/types/FilterTypes";
import { capitalize } from "@/app/models/Listings";
import { OrderStatus } from "@/app/models/Order";

interface OrderFilterProps {
  onFilterValueChange: (values: Map<string, string>) => void;
}

export default function OrderFilters({onFilterValueChange}: OrderFilterProps) {
    const [selectedValues, setSelectedValues] = useState(new Map());
  
    const orderFilterOptions: FilterOptions = {
      multiSelects: [],
      multiInputs: [],
      radioButtons: [],
      multiRadioButtons: [
        {
          title: "Status",
          filterType: FilterType.Status,
          labels: [
            capitalize(OrderStatus.INITIATED), 
            capitalize(OrderStatus.FULLFILLED), 
            capitalize(OrderStatus.PENDING), 
            capitalize(OrderStatus.VOIDED)
          ]
        }
      ]
    };

    const onValueChange = (field: string, newValue: string | number | boolean | string[]) => {
      const newSelectedValues = new Map();
      if(typeof newValue === "string") {
        newSelectedValues.set(field.toLowerCase(), newValue.toLowerCase())
      } else if(typeof newValue === "boolean") {
        newSelectedValues.set(field.toLowerCase(), newValue == true ? "true" : "false")
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