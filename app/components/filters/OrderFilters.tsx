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
      multiSelects: [
        {
          title: "Sent Only",
          filterType: FilterType.Sent_Only,
          options: ["Sent Only"]
        }
      ],
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
      let key, value;
      if(typeof newValue === "string") {
        key = field.toLowerCase();
        value = newValue.toLowerCase();
      } else if(typeof newValue === "boolean") {
        key = field.toLowerCase();
        value = newValue == true ? "true" : "false";
      } else if(field == FilterType.Sent_Only) {
        const newValueAsArray = newValue as string[];
        const containsSentOnly = newValueAsArray.find(value => value == "Sent Only")?.length;
        if(containsSentOnly) {
          const valuesForParent = new Map<string, string>();
          valuesForParent.set(field, containsSentOnly > 0 ? "true" : "false");
          onFilterValueChange(valuesForParent);
          newSelectedValues.set(field, newValueAsArray);
          setSelectedValues(newSelectedValues);
          return;
        }
      }
      if(key && value) {
        newSelectedValues.set(key, value);
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