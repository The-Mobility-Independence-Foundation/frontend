import { FormProvider, useForm } from "react-hook-form";
import ModalBody from "./ModalBody";
import ModalHeader from "./ModalHeader";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import backendService from "@/app/services/backend.service";
import { InventoryData } from "@/app/models/Inventory";
import { InventoryItemData } from "@/app/models/InventoryItem";
import { ImageReference } from "../ImageCarousel";

interface EditListingProps {
  onSubmit: (inventoryItem: InventoryItemData, image: ImageReference) => void
  onClose: () => void
}

export default function EditListingModal({onClose}: EditListingProps) {
  const editListingFormSchema = z.object({
    inventoryItemID: z.number({
        required_error: "Select an item from your inventories",
    }),
    attachment: z.string()
  });
  const editListingForm = useForm<z.infer<typeof editInventoryFormSchema>>({
    resolver: zodResolver(editInventoryFormSchema),
    defaultValues: {
      title: inventoryData.name,
      address: inventoryData.location
    }
  })
  
  const onInventorySubmit = (values: z.infer<typeof editInventoryFormSchema>) => {
    // TODO: Uncomment when backend is hooked up
    // const body = {
    //   name: values.title,
    //   description: "",
    //   location: values.address
    // };
    // backendService.patch(`/organizations/${organizationID}/inventories/${inventoryData.id}`, body)
    //   .then(response => {
    //     // TODO: toastr with message
    //   }
    // );
    onClose();
  }

  return (
    <div className="min-w-[25rem]">
      <ModalHeader title={`Edit ${inventoryData.name}`} onClose={onClose} />
      <ModalBody>
        <>
          <FormProvider {...editInventoryForm}>
            <form
              onSubmit={editInventoryForm.handleSubmit(onInventorySubmit)}
            >
              <FormField
                control={editInventoryForm.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        {...field}
                        type="string"
                        required={true}
                        placeholder="Title"
                        className="mb-[0.75rem]"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={editInventoryForm.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input 
                        {...field} 
                        type="string" 
                        placeholder="Address" 
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <div className="flex w-max ml-auto mt-[1.5rem]">
                <button onClick={onClose} className="button !bg-[#BBBBBB]">Cancel</button>
                <button type="submit" className="button ml-[1rem]">
                  Save
                </button>
              </div>
            </form>
          </FormProvider>
        </>
      </ModalBody>
    </div>
  );
}