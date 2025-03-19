import { FormProvider, useForm } from "react-hook-form"
import ModalHeader from "./ModalHeader"
import ModalBody from "./ModalBody"
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import backendService from "@/app/services/backend.service";
import { useEffect, useState } from "react";
import { PartData } from "@/app/models/Part";
import { ModelData } from "@/app/models/Model";
import { FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";

interface CreateInventoryItemModalProps {
  onClose: () => void,
  organizationID: string | number,
  inventoryID: string | number
}

export default function CreateInventoryItemModal({onClose, organizationID, inventoryID}: CreateInventoryItemModalProps) {
  const [parts, setParts] = useState<PartData[]>([]);
  const [models, setModels] = useState<ModelData[]>([]);

  useEffect(() => {
    // TODO: comment out when backend is hooked up
    // backendService.get("/part")
    //   .then(response => {
    //     setParts(response.data);
    //   });
    // backendService.get("/model")
    //   .then(response => {
    //     setModels(response.data);
    //   });
  })
  
  const createInventoryItemFormSchema = z.object({
    name: z
      .string({
        required_error: "Name is required"
      }),
    partID: z
      .number({
        required_error: "Please select from the list of parts"
      }),
    modelID: z
      .number({
        required_error: "Please select from the list of models"
      }),
    quantity: z
      .number(),
    notes: z
      .string(),
    attributes: z
      .string()
  });
  const createInventoryItemForm = useForm<z.infer<typeof createInventoryItemFormSchema>>({
    resolver: zodResolver(createInventoryItemFormSchema)
  });

  const onFormSubmit = (values: z.infer<typeof createInventoryItemFormSchema>) => {
    // TODO: Uncomment when API is hooked up
    // const body = {
    //   name: values.name,
    //   inventoryID: inventoryID,
    //   partID: values.partID,
    //   modelID: values.modelID,
    //   quantity: values.quantity,
    //   publicCount: 0,
    //   notes: values.notes,
    //   attributes: values.attributes
    // }
    // backendService.post(`/organizations/${organizationID}/inventories/${inventoryID}/items`, body)
    //   .then(response => {
    //     // TODO: toastr with message
    //     onClose();
    //   });
    onClose();
  }
  
  return <div className="max-w-[35rem] w-[35rem]">
    <ModalHeader title="Create a New Inventory Item" onClose={onClose} />
    <ModalBody>
      <FormProvider {...createInventoryItemForm}>
        <form onSubmit={createInventoryItemForm.handleSubmit(onFormSubmit)}>
          <FormField
            control={createInventoryItemForm.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input 
                    {...field}
                    type="string"
                    required={true}
                    placeholder="Name"
                    className="mb-[0.75rem]"
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={createInventoryItemForm.control}
            name="partID"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                <Select
                  onValueChange={value => field.onChange(value)}
                  required={true}
                >
                  <SelectTrigger className="mb-[0.75rem]">
                    <SelectValue placeholder="Select a Part" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Parts</SelectLabel>
                      {parts.map(part => 
                        <SelectItem 
                          key={part.id}
                          value={part.id.toString()}
                        >
                          {part.name}
                        </SelectItem>
                      )}
                    </SelectGroup>
                  </SelectContent>
                </Select>
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={createInventoryItemForm.control}
            name="modelID"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                <Select
                  onValueChange={value => field.onChange(value)}
                  required={true}
                >
                  <SelectTrigger className="mb-[0.75rem]">
                    <SelectValue placeholder="Select a Model" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Models</SelectLabel>
                      {models.map(model => 
                        <SelectItem 
                          key={model.id}
                          value={model.id.toString()}
                        >
                          {model.name}
                        </SelectItem>
                      )}
                    </SelectGroup>
                  </SelectContent>
                </Select>
                </FormControl>
              </FormItem>
            )}
          />
        </form>
        
      </FormProvider>
    </ModalBody>
  </div>
}