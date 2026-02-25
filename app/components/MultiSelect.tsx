"use client";

import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { CheckedState } from "@radix-ui/react-checkbox";

interface MultiSelectProps {
    className: string
    title: string
    options: string[]
    onChange: (newSelected: string) => void
}

export default function MultiSelect({className, title, options, onChange}: MultiSelectProps) {
    return <div className={className}>
        <h1 className="font-sans font-semibold text-2xl mb-2">{title}</h1>
        <div className="max-h-[10rem] overflow-y-auto">
        {options.map((option) => 
            <div key={option}>
                <Label className="font-sans font-normal text-sm">
                    <Checkbox className="mr-2" onCheckedChange={(val: CheckedState) => onChange(val ? option : "")} />
                    {option}
                </Label>
                <br></br>
            </div>
        )}
        </div>
    </div>
}