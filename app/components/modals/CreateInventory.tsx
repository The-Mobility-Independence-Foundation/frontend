import { FormProvider, useForm } from "react-hook-form";
import ModalBody from "./ModalBody";
import ModalHeader from "./ModalHeader";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import backendService from "@/app/services/backend.service";
import { Textarea } from "@/components/ui/textarea";
import { InventorySuccess } from "@/app/models/Inventory";
import { useState } from "react";
import { Spinner } from "@/components/ui/spinner";
import { ErrorCallback, toastErrors } from "@/app/models/Generic";

interface CreateInventoryModalProps {
  organizationID: number,
  onClose: (submit: boolean) => void
}

export default function CreateInventoryModal({organizationID, onClose}: CreateInventoryModalProps) {
  const [loadingCreation, setLoadingCreation] = useState(false);
  
  const createInventoryFormSchema = z.object({
    title: z
      .string({
        required_error: "Title is required"
      }),
    description: z
      .string({
        required_error: "Description is required"
      }),
    addressLine1: z
      .string({
        required_error: "Address Line 1 is required"
      }),
    addressLine2: z
      .string(),
    city: z
      .string({
        required_error: "City is required"
      }),
    state: z
      .string({
        required_error: "State is required"
      }),
    zipCode: z
      .string({
        required_error: "Zip Code is required"
      })
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
    setLoadingCreation(true);
    const body = {
      addressLine1: values.addressLine1,
      addressLine2: values.addressLine2 || "",
      city: values.city,
      state: values.state,
      zipCode: values.zipCode,
      name: values.title,
      description: values.description
    }
    backendService.post(`/organizations/${organizationID}/inventories`, body)
      .then(response => {
        const responseAsInventory = response as InventorySuccess;
        if(!responseAsInventory.success) {
          toastErrors(response as ErrorCallback);
          setLoadingCreation(false);
          return;
        }
        onClose(true);
    });
  }

  return (
    <div className="min-w-[25rem]">
      <ModalHeader title="Create a New Inventory" onClose={() => onClose(false)} />
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
                      required
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
                      required
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
                        required
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
                        required
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
                          required
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
                          required
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <div className="flex w-max ml-auto mt-[1.5rem]">
              <button 
                onClick={() => onClose(false)} 
                className="button !bg-[#BBBBBB]"
                disabled={loadingCreation}
              >Cancel</button>
              <button 
                type="submit" 
                className="button ml-[1rem] h-[3rem] w-[5rem]"
                disabled={loadingCreation}
              >
                {loadingCreation ? <Spinner className="text-white" /> : "Create"}
              </button>
            </div>
          </form>
        </FormProvider>
      </ModalBody>
    </div>
  );
}