"use client";

import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"

interface Props {
    className: string
    title: string
    options: string[]
}

export default function MultiSelect({className, title, options}: Props) {
    return <div id="multi-select" className={className}>
        <h1 className="font-[inter] font-semibold text-2xl mb-2">{title}</h1>
        {options.map((option) => 
            <div key={option}>
                <Label className="font-[inter] font-normal text-sm">
                    <Checkbox className="mr-2" />
                    {option}
                </Label>
                <br></br>
            </div>
        )}
    </div>
}