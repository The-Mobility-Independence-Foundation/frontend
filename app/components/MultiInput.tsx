"use client";

import { Input } from "@/components/ui/input";
import { MultiInputInfo } from "../types/MultiInputInfo";
import { Fragment } from "react";

export default function MultiInput({title, inputs, divider}: MultiInputInfo) {
    return <>
        <h1 className="font-sans font-semibold text-2xl mb-2">
            {title}
        </h1>
        <div className="flex mb-6">
            {inputs.map((inputInfo, i) => (
                <Fragment key={inputInfo.placeholder}>
                    <Input 
                        placeholder={inputInfo.placeholder} 
                        type={inputInfo.type} 
                        min={inputInfo.minValue}
                        max={inputInfo.maxValue} 
                        onChange={(e) => inputInfo.onValueChange(new Map([[title, e.target.value]]))}/>
                    {i < inputs.length - 1 && <p className="font-sans font-semibold text-2xl mb-2 px-0 mx-2">{divider}</p>}
                </Fragment>
            ))}
        </div>
    </>
}