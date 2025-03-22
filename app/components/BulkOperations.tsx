import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

export default function BulkOperations() {
    return <div className="flex bg-[#F4F4F5] items-center py-4">
        <Checkbox onCheckedChange={() => {}} className="ml-5"/>

        <div className="flex space-x-2 ml-14">
            <Button className="bg-[#D3E8FF] font-semibold text-black">Activate Selected</Button>
            <Button className="bg-[#FFD3D3] font-semibold text-black">Deactivate Selected</Button>
        </div>

        <Button className="ml-auto mr-5 bg-[#FF6C6C] font-semibold">Delete Selected</Button>
  </div>
}