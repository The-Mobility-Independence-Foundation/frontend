import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { CheckedState } from "@radix-ui/react-checkbox";
import { ACTIVE, INACTIVE, LISTING_STATUSES } from "../models/Listings";

export interface BulkOperationsProps {
    onCheckboxChange: (checked: CheckedState) => void;
    onChangeActiveStatus?: (active: number) => void;
    onDelete?: () => void;
}

export default function BulkOperations({onCheckboxChange, onChangeActiveStatus, onDelete}: BulkOperationsProps) {
    return <div className="flex bg-[#F4F4F5] items-center py-4">
        <Checkbox onCheckedChange={(checked) => onCheckboxChange(checked)} className="ml-1 sm:ml-6"/>

        {onChangeActiveStatus && <div className="flex space-x-1 sm:space-x-2 ml-2 sm:ml-14">
            <Button className="bg-[#D3E8FF] font-semibold text-black" variant="secondary" onClick={() => onChangeActiveStatus(LISTING_STATUSES.indexOf(ACTIVE)+1)}>Activate Selected</Button>
            <Button className="bg-[#FFD3D3] font-semibold text-black" variant="secondary" onClick={() => onChangeActiveStatus(LISTING_STATUSES.indexOf(INACTIVE)+1)}>Deactivate Selected</Button>
        </div>}

        {onDelete && <Button className="ml-1 sm:ml-auto mr-5 bg-[#FF6C6C] font-semibold" onClick={onDelete}>Delete Selected</Button>}
  </div>
}