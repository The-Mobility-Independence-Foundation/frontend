import { FormProvider, useForm } from "react-hook-form";
import ModalBody from "./ModalBody";
import ModalHeader from "./ModalHeader";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import backendService from "@/app/services/backend.service";
import { Textarea } from "@/components/ui/textarea";

interface CreateInventoryModalProps {
  organizationID: number,
  onClose: () => void
}

export default function CreateInventoryModal({organizationID, onClose}: CreateInventoryModalProps) {
  const createInventoryFormSchema = z.object({
    title: z
      .string()
      .min(1, "Title is required"),
    description: z
      .string(),
    addressLine1: z
      .string(),
    addressLine2: z
      .string(),
    city: z
      .string(),
    state: z
      .string(),
    zipCode: z
      .string()
  });
  const createInventoryForm = useForm<z.infer<typeof createInventoryFormSchema>>({
    resolver: zodResolver(createInventoryFormSchema),
    defaultValues: {
      title: "",
      description: "",
      addressLine1: "",
      addressLine2: "",
      city: "",
      state: "",
      zipCode: ""
    }
  })
  
  const onInventorySubmit = (values: z.infer<typeof createInventoryFormSchema>) => {
    // const body = {
    //   name: values.title,
    //   organizationID: organizationID,
    //   description: "",
    //   location: values.address
    // };
    // TODO: Create new address and create inventory after that's created
    // TODO: loading spinner
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
              name="description"
              render={({ field }) => (
                <FormItem className="mb-[1.5rem]">
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="Description"
                      className="h-[5rem]"
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <div>
              <FormField
                control={createInventoryForm.control}
                name="addressLine1"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Address Line 1"
                        className="mb-[0.75rem]"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={createInventoryForm.control}
                name="addressLine2"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Address Line 2"
                        className="mb-[0.75rem]"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={createInventoryForm.control}
                name="city"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="City"
                        className="mb-[0.75rem]"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <div className="flex justify-between mb-[1.5rem]">
                <FormField
                  control={createInventoryForm.control}
                  name="state"
                  render={({ field }) => (
                    <FormItem className="w-[48%]">
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="State"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={createInventoryForm.control}
                  name="zipCode"
                  render={({ field }) => (
                    <FormItem className="w-[48%]">
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Zip Code"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </div>
            {/* <FormField
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
            /> */}
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