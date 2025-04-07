import { FormProvider, useForm } from "react-hook-form";
import ModalHeader from "./ModalHeader";
import ModalBody from "./ModalBody";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import backendService from "@/app/services/backend.service";
import { useCallback, useEffect, useState } from "react";
import { PartData, Parts } from "@/app/models/Part";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  ATTRIBUTES_STRING_REGEX,
  InventoryItemsPost,
  stringToAttributes,
} from "@/app/models/InventoryItem";
import Modal from "./Modal";
import CreatePartModal from "./CreatePart";
import { toast } from "sonner";
import { toastErrors } from "@/app/models/Generic";
import { Spinner } from "@/components/ui/spinner";

interface CreateInventoryItemModalProps {
  onClose: (submitted: boolean) => void;
  organizationID: string | number;
  inventoryID: string | number;
}

// any changes here should be made to the EditInventoryItemModal as well
export default function CreateInventoryItemModal({
  onClose,
  organizationID,
  inventoryID,
}: CreateInventoryItemModalProps) {
  const [createPartModalIsOpen, setCreatePartModalIsOpen] = useState(false);
  const [parts, setParts] = useState<PartData[]>([]);
  const [pendingPart, setPendingPart] = useState<string | null>();
  const [loading, setLoading] = useState(false);

  const attributesPlaceholder =
    'Each attribute must be separated by new lines and formatted as "key:value" pairs. i.e.\ncolor:red\nwidth:3in.\nheight:5in.';

  const getParts = useCallback(() => {
    backendService.get("/parts?limit=100").then((response) => {
      const responseAsParts = response as Parts;
      if (!responseAsParts.success) {
        toastErrors(response);
        setParts([]);
        return;
      }
      setParts(responseAsParts.data.results);
    });
  }, []);

  const createInventoryItemFormSchema = z.object({
    partID: z.string({
      // This would be a number but the value in SelectItem has to be a string
      required_error: "Please select from the list of parts",
    }),
    quantity: z.coerce
      .number({
        required_error: "Quantity is required",
      })
      .min(0),
    attributes: z.string().regex(ATTRIBUTES_STRING_REGEX),
    notes: z.string(),
  });
  const createInventoryItemForm = useForm<
    z.infer<typeof createInventoryItemFormSchema>
  >({
    resolver: zodResolver(createInventoryItemFormSchema),
    defaultValues: {
      partID: "",
      quantity: undefined,
      attributes: "",
      notes: "",
    },
  });

  const onFormSubmit = (
    values: z.infer<typeof createInventoryItemFormSchema>
  ) => {
    setLoading(true);
    const body = {
      partId: values.partID,
      modelId: parts.find((part) => part.id == parseInt(values.partID))?.model
        ?.id,
      quantity: values.quantity,
      publicCount: values.quantity,
      notes: values.notes,
      attributes: stringToAttributes(values.attributes),
    };
    backendService
      .post(
        `/organizations/${organizationID}/inventories/${inventoryID}/items`,
        body
      )
      .then((response) => {
        const responseAsInventoryItems = response as InventoryItemsPost;
        if (!responseAsInventoryItems.success) {
          toastErrors(response);
          setLoading(false);
          return;
        }
        toast(responseAsInventoryItems.message);
        setLoading(false);
        onClose(true);
      });
  };

  const onCreatePartModalClose = async (part: PartData | null) => {
    setCreatePartModalIsOpen(false);
    if (part) {
      setPendingPart(part.id.toString());
      getParts();
    }
  };

  useEffect(() => {
    if (pendingPart && parts.find((p) => p.id.toString() == pendingPart)) {
      createInventoryItemForm.setValue("partID", pendingPart);
      setPendingPart(null);
    }
  }, [pendingPart, parts]);

  useEffect(() => {
    getParts();
  }, []);

  return (
    <>
      <ModalHeader
        title="Create a New Inventory Item"
        onClose={() => onClose(false)}
      />
      <ModalBody>
        <FormProvider {...createInventoryItemForm}>
          <form onSubmit={createInventoryItemForm.handleSubmit(onFormSubmit)}>
            <FormField
              control={createInventoryItemForm.control}
              name="partID"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Select
                      onValueChange={(value) => field.onChange(value)}
                      required={true}
                      value={field.value}
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
            <button
              className="button text-xs mb-[0.75rem]"
              onClick={() => setCreatePartModalIsOpen(true)}
            >
              Create New Part
            </button>
            <FormField
              control={createInventoryItemForm.control}
              name="quantity"
              render={({ field }) => (
                <FormItem className="w-[48%] mb-[0.75rem]">
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
                <FormItem className="mb-[1.75rem]">
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
            <div className="flex">
              <button
                onClick={() => onClose(false)}
                className="button ml-auto !bg-[#BBBBBB]"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="button ml-[1rem] h-[2.75rem] w-[8rem]"
                disabled={loading}
              >
                {loading ? <Spinner className="text-white" /> : "Create"}
              </button>
            </div>
          </form>
        </FormProvider>
      </ModalBody>
      <Modal
        isOpen={createPartModalIsOpen}
        onClose={() => setCreatePartModalIsOpen(false)}
      >
        <CreatePartModal onClose={(part) => onCreatePartModalClose(part)} />
      </Modal>
    </>
  );
}
