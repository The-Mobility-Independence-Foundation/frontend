import { FormProvider, useForm } from "react-hook-form";
import ModalBody from "./ModalBody";
import ModalHeader from "./ModalHeader";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import backendService from "@/app/services/backend.service";

interface CreateInventoryModalProps {
  organizationID: number,
  onClose: () => void
}

export default function CreateInventoryModal({organizationID, onClose}: CreateInventoryModalProps) {
  const createInventoryFormSchema = z.object({
    title: z
      .string()
      .min(1, "Title is required"),
    address: z
      .string()
      .regex(/(\d{1,5}\s\w.\s(\b\w*\b\s){1,2}\w*\.)?/, "Must be in the format \"2014 Forrest Hills Dr.\"")
  });
  const createInventoryForm = useForm<z.infer<typeof createInventoryFormSchema>>({
    resolver: zodResolver(createInventoryFormSchema),
    defaultValues: {
      title: "",
      address: ""
    }
  })
  
  const onInventorySubmit = (values: z.infer<typeof createInventoryFormSchema>) => {
    const body = {
      name: values.title,
      organizationID: organizationID,
      description: "",
      location: values.address
    };
    // TODO: Create new address and create inventory after that's created
    // TODO: form for address
    // TODO: loading spinner
    // TODO: field for description
    // backendService.post(`/organizations/${organizationID}/inventories`, body)
    //   .then(response => {
    //     // TODO: toastr with message
    //   }
    // );
    if(organizationID && values) {
      onClose();
    }
  }

  return (
    <div className="min-w-[25rem]">
      <ModalHeader title="Create a New Inventory" onClose={onClose} />
      <ModalBody>
        <FormProvider {...createInventoryForm}>
          <form
            onSubmit={createInventoryForm.handleSubmit(onInventorySubmit)}
          >
            <FormField
              control={createInventoryForm.control}
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
              control={createInventoryForm.control}
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
                Create
              </button>
            </div>
          </form>
        </FormProvider>
      </ModalBody>
    </div>
  );
}