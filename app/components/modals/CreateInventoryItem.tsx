import { FormProvider, useForm } from "react-hook-form"
import ModalHeader from "./ModalHeader"
import ModalBody from "./ModalBody"
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
// import backendService from "@/app/services/backend.service";
import { useEffect, useState } from "react";
import { PartData } from "@/app/models/Part";
import { ModelData } from "@/app/models/Model";
import { FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ATTRIBUTES_STRING_REGEX } from "@/app/models/InventoryItem";
import Modal from "./Modal";
import CreatePartModal from "./CreatePart";
import CreateModelModal from "./CreateModel";

interface CreateInventoryItemModalProps {
  onClose: () => void,
  organizationID: string | number,
  inventoryID: string | number
}

// TODO: test form, any changes here should be made to the EditInventoryItemModal as well
export default function CreateInventoryItemModal({onClose, organizationID, inventoryID}: CreateInventoryItemModalProps) {
  const [createPartModalIsOpen, setCreatePartModalIsOpen] = useState(false);
  const [createModelModalIsOpen, setCreateModelModalIsOpen] = useState(false);

  const parts = useState<PartData[]>([])[0];
  const models = useState<ModelData[]>([])[0];

  const attributesPlaceholder = "Each attribute must be separated by new lines and formatted as \"key:value\" pairs. i.e.\ncolor:red\nwidth:3in.\nheight:5in."

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
      .string({ // This and modelID would both be numbers but the value in SelectItem has to be a string
        required_error: "Please select from the list of parts"
      }),
    modelID: z
      .string({
        required_error: "Please select from the list of models"
      }),
    quantity: z
      .number({
        required_error: "Quantity is required"
      })
      .min(0),
    attributes: z
      .string()
      .regex(ATTRIBUTES_STRING_REGEX),
    notes: z
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
    if(organizationID && values && inventoryID) {
      onClose();
    }
  }
  
  return (
    <>
      <ModalHeader title="Create a New Inventory Item" onClose={onClose} />
      <ModalBody>
        <FormProvider {...createInventoryItemForm}>
          <form onSubmit={createInventoryItemForm.handleSubmit(onFormSubmit)}>
            <div className="w-full flex mb-[0.75rem]">
              <FormField
                control={createInventoryItemForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="w-[48%] mr-auto">
                    <FormControl>
                      <Input
                        {...field}
                        type="string"
                        required={true}
                        placeholder="Name"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={createInventoryItemForm.control}
                name="quantity"
                render={({ field }) => (
                  <FormItem className="w-[48%]">
                    <FormControl>
                      <Input
                        {...field}
                        type="number"
                        required={true}
                        placeholder="Quantity"
                        min="0"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={createInventoryItemForm.control}
              name="partID"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Select
                      onValueChange={(value) => field.onChange(value)}
                      required={true}
                    >
                      <SelectTrigger className="mb-[0.25rem]">
                        <SelectValue placeholder="Select a Part" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Parts</SelectLabel>
                          {parts.map((part) => (
                            <SelectItem
                              key={part.id}
                              value={part.id.toString()}
                            >
                              {part.name}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </FormControl>
                </FormItem>
              )}
            />
            <button className="button text-xs mb-[0.75rem]" onClick={() => setCreatePartModalIsOpen(true)}>Create New Part</button>
            <FormField
              control={createInventoryItemForm.control}
              name="modelID"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Select
                      onValueChange={(value) => field.onChange(value)}
                      required={true}
                    >
                      <SelectTrigger className="mb-[0.25rem]">
                        <SelectValue placeholder="Select a Model" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Models</SelectLabel>
                          {models.map((model) => (
                            <SelectItem
                              key={model.id}
                              value={model.id.toString()}
                            >
                              {model.name}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </FormControl>
                </FormItem>
              )}
            />
            <button className="button text-xs mb-[1.5rem]" onClick={() => setCreateModelModalIsOpen(true)}>Create New Model</button>
            <FormField
              control={createInventoryItemForm.control}
              name="attributes"
              render={({ field }) => (
                <FormItem className="mb-[1.5rem]">
                  <FormLabel>Attributes</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder={attributesPlaceholder}
                      className="h-[10rem]"
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={createInventoryItemForm.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="Insert any notes about the item here"
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <div className="flex w-max ml-auto mt-[1.5rem]">
              <button onClick={onClose} className="button !bg-[#BBBBBB]">
                Cancel
              </button>
              <button type="submit" className="button ml-[1rem]">
                Create
              </button>
            </div>
          </form>
        </FormProvider>
      </ModalBody>
      <Modal
        isOpen={createPartModalIsOpen}
        onClose={() => setCreatePartModalIsOpen(false)}
      >
        <CreatePartModal
          onClose={() => setCreatePartModalIsOpen(false)}
        />
      </Modal>
      <Modal
        isOpen={createModelModalIsOpen}
        onClose={() => setCreateModelModalIsOpen(false)}
      >
        <CreateModelModal
          onClose={() => setCreateModelModalIsOpen(false)}
        />
      </Modal>
    </>
  );
}