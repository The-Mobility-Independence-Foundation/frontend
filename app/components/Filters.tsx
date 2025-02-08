"use client"

import MultiSelect from "./MultiSelect"
import { Input } from "@/components/ui/input"
import RadioButton from "./RadioButton"
import { useState } from "react";
import { FilterTypes } from "../types/filterTypes";

interface Props {
    partTypes: string[]
    brands: string[]
    selectedValues: Map<string, any>
    onValueChange: (field: string, newValue: any) => void
}

export default function Filters({partTypes, brands, selectedValues, onValueChange}: Props) {
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
        <MultiSelect className="px-7 mt-4 max-w-fit border-r-2 border-solid" title="Part Type" options={partTypes} onChange={(newSelected) => updateMultiSelect(FilterTypes.PartType, newSelected)}/>
        <MultiSelect className="px-7 mt-4 max-w-fit border-r-2 border-solid" title="Brand" options={brands} onChange={(newSelected) => updateMultiSelect(FilterTypes.Brand, newSelected)}/>
        <div id="dimensions" className="px-7 mt-4 max-w-fit">
            <h1 className="font-sans font-semibold text-2xl mb-2">
                Dimensions
            </h1>
            <div className="flex mb-6">
                <Input placeholder="Width (in.)" type="number" min={0} onChange={(e) => onValueChange(FilterTypes.Width, e.target.value)}/>
                <p className="font-sans font-semibold text-2xl mb-2 px-0 mx-2">X</p>
                <Input placeholder="Height (in.)" type="number" min={0} onChange={(e) => onValueChange(FilterTypes.Height, e.target.value)}/>
            </div>
            <h1 className="font-sans font-semibold text-2xl mb-2">
                Quantity
            </h1>
            <div className="flex mb-6">
                <Input placeholder="Lower Bound" type="number" min={0} onChange={(e) => onValueChange(FilterTypes.QuantityMin, e.target.value)}/>
                <p className="font-sans font-semibold text-2xl mb-2 px-0 mx-2">-</p>
                <Input placeholder="Upper Bound" type="number" min={0} onChange={(e) => onValueChange(FilterTypes.QuantityMax, e.target.value)}/>
            </div>
            <RadioButton label1="Active" label2="Inactive" selected={activeStatusSelected} onChange={changeActiveStatus}></RadioButton>
        </div>  
    </div>
}