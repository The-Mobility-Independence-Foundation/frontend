"use client";

import { useEffect, useState } from "react";
import Filters, { FilterOptions } from "./Filters";
import { FilterType } from "@/app/types/FilterTypes";
import { PartData, Parts } from "@/app/models/Part";
import { ModelData, Models } from "@/app/models/Model";
import backendService from "@/app/services/backend.service";
import { toastErrors } from "@/app/models/Generic";

interface InventoryItemFilterProps {
  onFilterValueChange: (values: Map<string, string>) => void;
}

export default function InventoryItemFilters({
  onFilterValueChange,
}: InventoryItemFilterProps) {
  const [selectedValues, setSelectedValues] = useState(new Map());
  const [parts, setParts] = useState<PartData[]>([]);
  const [models, setModels] = useState<ModelData[]>([]);
  const [filterOptions, setFilterOptions] = useState<FilterOptions>();

  useEffect(() => {
    backendService.get(`/parts`).then((response) => {
      const responseAsParts = response as Parts;
      if (!responseAsParts.success) {
        toastErrors(response);
        return;
      }
      setParts(responseAsParts.data.results);
    });

    backendService.get(`/models`).then((response) => {
      const responseAsModels = response as Models;
      if (!responseAsModels.success) {
        toastErrors(response);
        return;
      }
      setModels(responseAsModels.data.results);
    });
  }, []);

  useEffect(() => {
    setFilterOptions({
      multiSelects: [
        {
          title: "Part",
          filterType: FilterType.Part,
          options: parts.map((part) => part.name),
        },
        {
          title: "Model",
          filterType: FilterType.Model,
          options: models.map((model) => model.name),
        },
      ],
      multiInputs: [
        {
          title: "Quantity",
          inputs: [
            {
              placeholder: "Lower Bound",
              type: "number",
              minValue: "0",
              maxValue: "100",
              onValueChange: onFilterValueChange,
            },
            {
              placeholder: "Upper Bound",
              type: "number",
              minValue: "0",
              maxValue: "100",
              onValueChange: onFilterValueChange,
            },
          ],
          divider: "-",
        },
      ],
      radioButtons: [],
    });
  }, [parts, models]);

  const onValueChange = (
    field: string,
    newValue: string | number | boolean | string[]
  ) => {
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
    <>
      {filterOptions && (
        <Filters
          options={filterOptions}
          selectedValues={selectedValues}
          onValueChange={onValueChange}
        />
      )}
    </>
  );
}
