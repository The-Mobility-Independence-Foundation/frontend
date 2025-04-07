"use client";

import MultiSelect from "../MultiSelect";
import RadioButton from "../RadioButton";
import { useState } from "react";
import { MultiInputInfo } from "../../types/MultiInputInfo";
import MultiInput from "../MultiInput";
import { MultiSelectInfo } from "../../types/MultiSelectInfo";
import { MultiRadioButtonInfo, RadioButtonInfo } from "../../types/RadioButtonInfo";
import LocationRadius from "../LocationRadius";
import { FilterType } from "@/app/types/FilterTypes";
import MultiRadioButton from "../MultiRadioButton";

export interface FiltersProps {
  options: FilterOptions;
  selectedValues: Map<string, string | number | string[] | boolean>;
  onValueChange: (field: string, newValue: string | number | string[] | boolean) => void;
}

export interface FilterOptions {
  multiSelects: MultiSelectInfo[];
  multiInputs: MultiInputInfo[];
  radioButtons: RadioButtonInfo[];
  multiRadioButtons: MultiRadioButtonInfo[];
  map?: boolean;
}

export default function Filters({options, selectedValues, onValueChange}: FiltersProps) {
  const multiSelects = options.multiSelects;
  const multiInputs = options.multiInputs;
  const radioButtons = options.radioButtons;
  const multiRadioButtons = options.multiRadioButtons;

  const [activeStatusSelectedList, setActiveStatusSelectedList] = useState(
    new Array(radioButtons.length).fill(1)
  );

  function updateMultiSelect(key: string, selectedOption: string) {
    const selectedOptions: string[] = selectedValues.has(key)
      ? selectedValues.get(key) as string[]
      : [];
    if (!selectedOptions.includes(selectedOption)) {
      selectedOptions.push(selectedOption);
    } else {
      const optionIndex = selectedOptions.indexOf(selectedOption, 0);
      selectedOptions.splice(optionIndex, 1);
    }
    onValueChange(key, selectedOptions);
  }

  function changeActiveStatus(index: number, newActiveStatus: number) {
    setActiveStatusSelectedList([
      ...activeStatusSelectedList.slice(0, index),
      newActiveStatus,
      ...activeStatusSelectedList.slice(index + 1),
    ]);
    onValueChange(FilterType.Active, newActiveStatus == 1);
  }

  function updateMultiRadioButton(title: string, newValue: string) {
    onValueChange(title, newValue);
  }

  return (
    <div className="md:flex w-screen bg-white pb-5" id="filters">
      {options.map && (
        <LocationRadius
          className="md:w-[25%] px-7 mt-4 border-r-2 border-solid"
          onValueChange={onValueChange}
        />
      )}
      <div className="flex md:flex-none">
        {multiSelects.map((multiSelect, index) => (
          <MultiSelect
            key={multiSelect.title}
            className={
              "px-7 my-4 max-w-fit " +
              (index != multiSelects.length - 1
                ? "border-r-2 border-solid"
                : "md:border-r-2 md:border-solid")
            }
            title={multiSelect.title}
            options={multiSelect.options}
            onChange={(newSelected) =>
              updateMultiSelect(multiSelect.filterType, newSelected)
            }
          />
        ))}
      </div>
      <div className="px-7 my-4 max-w-fit">
        {multiInputs.map((multiInputInfo) => (
          <MultiInput
            key={multiInputInfo.title}
            title={multiInputInfo.title}
            inputs={multiInputInfo.inputs}
            divider={multiInputInfo.divider}
          />
        ))}
        {radioButtons.map((radioButtonInfo, index) => (
          <RadioButton
            key={radioButtonInfo.filterType}
            label1={radioButtonInfo.label1}
            label2={radioButtonInfo.label2}
            selected={activeStatusSelectedList[index]}
            onChange={(newActiveStatus) =>
              changeActiveStatus(index, newActiveStatus)
            }
            className="bg-[#F4F4F5]"
          />
        ))}
        {multiRadioButtons.map((multiRadioButtonInfo) => (
          <MultiRadioButton 
            key={multiRadioButtonInfo.title}
            title={multiRadioButtonInfo.title} 
            labels={multiRadioButtonInfo.labels}
            onValueChange={(value: string) => updateMultiRadioButton(multiRadioButtonInfo.title, value)}          
          />
        ))}
      </div>
    </div>
  );
}
