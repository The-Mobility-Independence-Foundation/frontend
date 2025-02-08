"use client"

import MultiSelect from "./MultiSelect"
import RadioButton from "./RadioButton"
import { useState } from "react";
import { FilterTypes } from "../types/filterTypes";
import { MultiInputInfo } from "../types/MultiInputInfo";
import MultiInput from "./MultiInput";

interface Props {
    multiSelects: Map<string, string[]>
    multiInputs: MultiInputInfo[]
    selectedValues: Map<string, any>
    onValueChange: (field: string, newValue: any) => void
}

export default function Filters({multiSelects, multiInputs, selectedValues, onValueChange}: Props) {
    const [activeStatusSelected, setActiveStatusSelected] = useState(1);

    function updateMultiSelect(key: string, selectedOption: string) {
        let selectedOptions : string[] = selectedValues.has(key) ? selectedValues.get(key) : [];
        if(!selectedOptions.includes(selectedOption)) {
            selectedOptions.push(selectedOption);
        } else {
            const optionIndex = selectedOptions.indexOf(selectedOption, 0);
            selectedOptions.splice(optionIndex, 1);
        }
        onValueChange(key, selectedOptions);
    }

    function changeActiveStatus(newActiveStatus: number) {
        setActiveStatusSelected(newActiveStatus);
        onValueChange(FilterTypes.Active, newActiveStatus == 1);
    }

    return <div className="flex" id="filters">
        {Array.from(multiSelects).map(([title, options]) => (
           <MultiSelect key={title} className="px-7 mt-4 max-w-fit border-r-2 border-solid" title={title} options={options} onChange={
                (newSelected) => updateMultiSelect(FilterTypes.PartType, newSelected)
            }/>
        ))}
        <div className="px-7 mt-4 max-w-fit">
            {multiInputs.map((multiInputInfo) => (
                <MultiInput key={multiInputInfo.title} title={multiInputInfo.title} inputs={multiInputInfo.inputs} divider={multiInputInfo.divider}></MultiInput>
            ))}
            <RadioButton label1="Active" label2="Inactive" selected={activeStatusSelected} onChange={changeActiveStatus}></RadioButton>
        </div>  
    </div>
}