import MultiSelect from "./MultiSelect"

export default function Filters() {
    return <div id="filters">
        <MultiSelect title="Part Type" options={["Type 1", "Type 2", "Type 3", "Type 4"]}/>
    </div>
}