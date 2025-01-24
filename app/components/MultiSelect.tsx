"use client";

import { Checkbox } from "@/components/ui/checkbox"

interface Props {
    title: String
    options: String[]
}

export default function MultiSelect({title, options}: Props) {
    return <div id="multi-select" className="mx-7 mt-4">
        <h1 className="font-[inter] font-semibold text-2xl mb-2">{title}</h1>
        {options.map((option) => 
            <>
                <label className="font-[inter] font-normal text-sm">
                    <Checkbox className="mr-2" />
                    {option}
                </label>
                <br></br>
            </>
        )}
    </div>
}