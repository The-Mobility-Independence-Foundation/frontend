"use client"

import { Button } from "@/components/ui/button"

interface Props {
    label1: string
    label2: string
    selected: number
    onChange: (newSelected: number) => void
}

export default function RadioButton({label1, label2, selected, onChange}: Props) {
    const SELECTED_CSS = "text-black bg-[#D3E8FF] hover:bg-[#D3E8FF] disabled:opacity-100 flex-1 min-w-0";
    const UNSELECTED_CSS = "text-black bg-transparent shadow-none flex-1 min-w-0";

    return <div className="flex bg-[#F4F4F5] max-w-fit rounded-md p-1">
        <Button className={selected == 1 ? SELECTED_CSS : UNSELECTED_CSS} disabled={selected == 1} variant="ghost" onClick={() => onChange(1)}>{label1}</Button>
        <Button className={selected == 2 ? SELECTED_CSS : UNSELECTED_CSS} disabled={selected == 2} variant="ghost" onClick={() => onChange(2)}>{label2}</Button>
    </div>
}