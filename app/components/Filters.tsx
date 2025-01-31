import MultiSelect from "./MultiSelect"
import { Input } from "@/components/ui/input"

interface Props {
    partTypes: string[]
    brands: string[]
}

export default function Filters({partTypes, brands}: Props) {
    return <div className="flex" id="filters">
        <MultiSelect className="px-7 mt-4 max-w-fit border-r-2 border-solid" title="Part Type" options={partTypes}/>
        <MultiSelect className="px-7 mt-4 max-w-fit border-r-2 border-solid" title="Brand" options={brands}/>
        <div id="dimensions" className="px-7 mt-4 max-w-fit">
            <h1 className="font-[inter] font-semibold text-2xl mb-2">
                Dimensions
            </h1>
            <div className="flex">
                <Input placeholder="Width (in.)"/>
                <p className="font-[inter] font-semibold text-2xl mb-2 px-0 mx-2">X</p>
                <Input placeholder="Height (in.)"/>
            </div>
        </div>
    </div>
}