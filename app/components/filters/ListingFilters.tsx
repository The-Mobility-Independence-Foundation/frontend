import { useCallback, useEffect, useState } from "react";
import { ACTIVE, INACTIVE } from "../../models/Listings";
import Filters, { FilterOptions } from "./Filters";
import { FilterType } from "@/app/types/FilterTypes";
import backendService from "@/app/services/backend.service";
import { PartData, Parts } from "@/app/models/Part";
import { ModelData, Models } from "@/app/models/Model";

export interface ListingFiltersProps {
  onFilterValueChange: (values: Map<string, string>) => void;
}

export default function ListingFilters({onFilterValueChange}: ListingFiltersProps) {
  const [selectedValues, setSelectedValues] = useState(new Map());
  const [filterOptions, setFilterOptions] = useState<FilterOptions>();
  const [parts, setParts] = useState<PartData[]>([]);
  const [models, setModels] = useState<ModelData[]>([]);

  const getParts = useCallback(() => {
    backendService.get("/part")
      .then(response => {
        const responseAsParts = response as Parts;
        if(responseAsParts.success) {
          setParts(responseAsParts.data);
        }
      })
  }, []);

  const getModels = useCallback(() => {
    backendService.get("/model")
    .then(response => {
      const responseAsModels = response as Models;
      if(responseAsModels.success) {
        setModels(responseAsModels.data);
      }
    })
  }, []);

  useEffect(() => {
    setFilterOptions(
      {
        multiSelects: [
          {
            title: "Part",
            filterType: FilterType.Part,
            options: parts.map(part => part.name),
          },
          {
            title: "Model",
            filterType: FilterType.Model,
            options: models.map(model => model.name),
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
      }
    )
  }, [parts, models])

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

  return (<>
    {filterOptions && 
      <Filters
        options={filterOptions}
        selectedValues={selectedValues}
        onValueChange={onValueChange}
      />
    }
  </>);
}
