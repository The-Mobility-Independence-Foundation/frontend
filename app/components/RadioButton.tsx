"use client"

import { Button } from "@/components/ui/button"

interface RadioButtonProps {
    label1: string
    label2: string
    selected: number
    onChange: (newSelected: number) => void,
    className?: string
}

export default function RadioButton({label1, label2, selected, onChange, className}: RadioButtonProps) {
    const SELECTED_CSS = "text-black bg-[#D3E8FF] hover:bg-[#D3E8FF] disabled:opacity-100 flex-1 min-w-0";
    const UNSELECTED_CSS = "text-black bg-transparent shadow-none flex-1 min-w-0";

    return <div className={"flex max-w-fit rounded-md p-1 " + className}>
        <Button className={selected == 1 ? SELECTED_CSS : UNSELECTED_CSS} disabled={selected == 1} variant="ghost" onClick={() => onChange(1)}>{label1}</Button>
        <Button className={selected == 2 ? SELECTED_CSS : UNSELECTED_CSS} disabled={selected == 2} variant="ghost" onClick={() => onChange(2)}>{label2}</Button>
    </div>
}