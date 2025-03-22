import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { CheckedState } from "@radix-ui/react-checkbox";
import { ACTIVE, INACTIVE, statuses } from "../models/Status";

export interface BulkOperationsProps {
    onCheckboxChange: (checked: CheckedState) => void;
    onChangeActiveStatus: (active: number) => void;
}

export default function BulkOperations({onCheckboxChange, onChangeActiveStatus}: BulkOperationsProps) {
    return <div className="flex bg-[#F4F4F5] items-center py-4">
        <Checkbox onCheckedChange={(checked) => onCheckboxChange(checked)} className="ml-5"/>

        <div className="flex space-x-2 ml-14">
            <Button className="bg-[#D3E8FF] font-semibold text-black" variant="secondary" onClick={() => onChangeActiveStatus(statuses.indexOf(ACTIVE)+1)}>Activate Selected</Button>
            <Button className="bg-[#FFD3D3] font-semibold text-black" variant="secondary" onClick={() => onChangeActiveStatus(statuses.indexOf(INACTIVE)+1)}>Deactivate Selected</Button>
        </div>

        <Button className="ml-auto mr-5 bg-[#FF6C6C] font-semibold">Delete Selected</Button>
  </div>
}