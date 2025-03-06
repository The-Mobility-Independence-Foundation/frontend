"use client";

import MultiSelect from "./MultiSelect";
import RadioButton from "./RadioButton";
import { useState } from "react";
import { FilterType } from "../types/FilterTypes";
import { MultiInputInfo } from "../types/MultiInputInfo";
import MultiInput from "./MultiInput";
import { MultiSelectInfo } from "../types/MultiSelectInfo";
import { RadioButtonInfo } from "../types/RadioButtonInfo";
import LocationRadius from "./LocationRadius";
import dynamic from "next/dynamic";


export interface FiltersProps {
  options: FilterOptions;
  selectedValues: Map<string, any>;
  onValueChange: (field: string, newValue: any) => void;
}

export interface FilterOptions {
  multiSelects: MultiSelectInfo[];
  multiInputs: MultiInputInfo[];
  radioButtons: RadioButtonInfo[];
}

export default function Filters({options, selectedValues, onValueChange}: FiltersProps) {
  const multiSelects = options.multiSelects;
  const multiInputs = options.multiInputs;
  const radioButtons = options.radioButtons;

  const [activeStatusSelectedList, setActiveStatusSelectedList] = useState(
    new Array(radioButtons.length).fill(1)
  );

  function updateMultiSelect(key: string, selectedOption: string) {
    let selectedOptions: string[] = selectedValues.has(key)
      ? selectedValues.get(key)
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

  return <div className="md:flex w-screen bg-white pb-5" id="filters">
    <LocationRadius className="md:w-[25%] px-7 mt-4 border-r-2 border-solid" onValueChange={onValueChange}></LocationRadius>
    <div className="flex md:flex-none">
        {multiSelects.map((multiSelect, index) => (
                <MultiSelect key={multiSelect.title} className={"px-7 my-4 max-w-fit " + (index != multiSelects.length - 1 ? "border-r-2 border-solid" : "md:border-r-2 md:border-solid")} 
                title={multiSelect.title} options={multiSelect.options} onChange={
                    (newSelected) => updateMultiSelect(multiSelect.filterType, newSelected)
                }/>
        ))}
    </div>
    <div className="px-7 my-4 max-w-fit">
        {multiInputs.map((multiInputInfo) => (
            <MultiInput key={multiInputInfo.title} title={multiInputInfo.title} inputs={multiInputInfo.inputs} divider={multiInputInfo.divider}></MultiInput>
        ))}
        {radioButtons.map((radioButtonInfo, index) => (
            <RadioButton key={radioButtonInfo.filterType} label1={radioButtonInfo.label1} label2={radioButtonInfo.label2} selected={activeStatusSelectedList[index]} onChange={(newActiveStatus) => changeActiveStatus(index, newActiveStatus)}></RadioButton>
        ))}
    </div>  
  </div>
}
