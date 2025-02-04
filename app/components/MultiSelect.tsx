"use client";

import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"

interface Props {
    className: string
    title: string
    options: string[]
    onChange: (newSelected: string) => void
}

export default function MultiSelect({className, title, options, onChange}: Props) {
    return <div className={className}>
        <h1 className="font-[inter] font-semibold text-2xl mb-2">{title}</h1>
        {options.map((option) => 
            <div key={option}>
                <Label className="font-[inter] font-normal text-sm">
                    <Checkbox className="mr-2" onClick={() => onChange(option)} />
                    {option}
                </Label>
                <br></br>
            </div>
        )}
    </div>
}