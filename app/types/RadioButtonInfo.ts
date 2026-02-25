import { FilterType } from "@/app/types/FilterTypes"

export type RadioButtonInfo = {
    filterType: FilterType,
    label1: string,
    label2: string
}

export type MultiRadioButtonInfo = {
    title: string,
    filterType: FilterType,
    labels: string[]
}