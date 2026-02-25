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
          title: "Archived",
          filterType: FilterType.Archived,
          options: ["Archived"]
        }
      ],
      multiInputs: [],
      radioButtons: [],
      multiRadioButtons: [        
      {
        title: "Part",
        filterType: FilterType.Part,
        labels: parts.map((part) => part.name),
      },
      {
        title: "Model",
        filterType: FilterType.Model,
        labels: models.map((model) => model.name),
      },]
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
      let key = field.toLowerCase();
      let value;
      if (key == "part") {
        value = parts.find(part => part.name == newValue)?.id;
        key = "partId";
      } else if(key == "model") {
        key = "modelId";
        value = models.find(model => model.name == newValue)?.id;
      } else if(key == FilterType.Archived.toLowerCase()) {
        const selectedValues = newValue as string[];
        const findArchived = selectedValues.find(value => value == "Archived")?.length;
        key = "status";
        value = findArchived && findArchived > 0 ? "archived" : "unarchived";
      }
      if(value) {
        newSelectedValues.set(key, value);
      }
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
