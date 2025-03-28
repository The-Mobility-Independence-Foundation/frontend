import { FormProvider, useForm } from "react-hook-form";
import ModalBody from "./ModalBody";
import ModalHeader from "./ModalHeader";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import backendService from "@/app/services/backend.service";
import { InventoryData, InventorySuccess } from "@/app/models/Inventory";
import { Textarea } from "@/components/ui/textarea";
import { ErrorCallback, toastErrors } from "@/app/models/Generic";
import { useState } from "react";
import { Spinner } from "@/components/ui/spinner";

interface EditInventoryModalProps {
  organizationID: number,
  inventoryData: InventoryData,
  onClose: (submit: boolean) => void
}

export default function EditInventoryModal({organizationID, inventoryData, onClose}: EditInventoryModalProps) {
  const [loadingEdit, setLoadingEdit] = useState(false);

  const editInventoryFormSchema = z.object({
    title: z
      .string()
      .min(1, "Title is required"),
      description: z
      .string({
        required_error: "Description is required"
      }),
  });
  const editInventoryForm = useForm<z.infer<typeof editInventoryFormSchema>>({
    resolver: zodResolver(editInventoryFormSchema),
    defaultValues: {
      title: inventoryData.name,
      description: inventoryData.description
    }
  })
  
  const onInventorySubmit = (values: z.infer<typeof editInventoryFormSchema>) => {
    setLoadingEdit(true);
    const body = {
      name: values.title,
      description: values.description
    };
    backendService.patch(`/organization/${organizationID}/inventory/${inventoryData.id}`, body)
      .then(response => {
        const responseAsInventory = response as InventorySuccess;
        if(!responseAsInventory.success) {
          toastErrors(response as ErrorCallback);
          setLoadingEdit(false);
          return;
        }
        onClose(true);
      }
    );
  }

  return (
    <div className="min-w-[25rem]">
      <ModalHeader title={`Edit ${inventoryData.name}`} onClose={() => onClose(false)} />
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
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Textarea 
                        {...field} 
                        placeholder="Description" 
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <div className="flex w-max ml-auto mt-[1.5rem]">
                <button 
                  onClick={() => onClose(false)} 
                  className="button !bg-[#BBBBBB]"
                  disabled={loadingEdit}
                >Cancel</button>
                <button 
                  type="submit" 
                  className="button ml-[1rem] h-[3rem] w-[5rem]"
                  disabled={loadingEdit}
                >
                  {loadingEdit ? <Spinner className="text-white" /> : "Create"}
                </button>
              </div>
            </form>
          </FormProvider>
        </>
      </ModalBody>
    </div>
  );
}