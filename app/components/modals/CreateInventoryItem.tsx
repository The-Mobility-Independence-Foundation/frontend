import { FormProvider, useForm } from "react-hook-form"
import ModalHeader from "./ModalHeader"
import ModalBody from "./ModalBody"
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import backendService from "@/app/services/backend.service";
import { useEffect, useState } from "react";
import { PartData } from "@/app/models/Part";
import { ModelData } from "@/app/models/Model";

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
  const createInventoryForm = useForm<z.infer<typeof createInventoryItemFormSchema>>({
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
  
  return <div className="min-w-[25rem]">
    <ModalHeader title="Create a New Inventory Item" onClose={onClose} />
    <ModalBody>
      <FormProvider {...createInventoryForm}>
        <form onSubmit={createInventoryForm.handleSubmit(onFormSubmit)}>

        </form>
        
      </FormProvider>
    </ModalBody>
  </div>
}