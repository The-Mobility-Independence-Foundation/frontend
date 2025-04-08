import { ChangeEvent, useEffect, useState } from "react";
import { z } from "zod";
import { InventoryItemData, InventoryItems } from "../models/InventoryItem";
import { ControllerRenderProps, FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormControl, FormField, FormItem } from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import RadioButton from "./RadioButton";
import ImageCarousel, { ImageReference } from "./ImageCarousel";
import backendService from "../services/backend.service";
import { userEmitterBus } from "../layout";
import { UserData } from "../models/User";
import { Inventory } from "../models/Inventory";

interface CreateListingProps {
  onClose: (created: boolean) => void;
}

// TODO: title, description and attributes
export default function CreateListing({onClose}: CreateListingProps) {
  const [inventoryItems, setInventoryItems] = useState<InventoryItemData[]>([]);
  const [quantityAvailable, setQuantityAvailable] = useState(-1);
  const [activeButton, setActiveButton] = useState(1);
  const [imageDisplaying, setImageDisplaying] = useState<ImageReference>();
  const [orgID, setOrgID] = useState("");

  useEffect(() => {
    userEmitterBus.on("user", (userEmitted: UserData) => {
      if(userEmitted.organization) {
        setOrgID(userEmitted.organization.id);
      }
    });
  })

  useEffect(() => {
    // Grabs all items from every inventory
    if(orgID) {
      backendService.get(`/organizations/${orgID}/inventories`)
      .then(async response => {
        const responseAsInventory = response as Inventory;
        if(responseAsInventory.success) {
          const allItemsResponses = await Promise.all(
            responseAsInventory.data.results.map(async inventory => {
              const response = await backendService.get(`/organizations/${orgID}/inventories/${inventory.id}/items`);
              const responseAsInventoryItems = response as InventoryItems;
              return responseAsInventoryItems.success ? responseAsInventoryItems.data.results : [];
            })
          )
          setInventoryItems(allItemsResponses.flat());
        }
      });
    }
  }, [orgID]);

  const createListingSchema = z.object({
    inventoryItemID: z.number({
      required_error: "Select an item from your inventories",
    }),
    quantity: z
      .number({
        required_error: "Include how much you would like to list",
      })
      .min(1),
    active: z.boolean({
      required_error:
        "Indicate whether or not this listing will be active upon creation",
    }),
    attachment: z.string(),
  });

  const createListingForm = useForm<z.infer<typeof createListingSchema>>({
    resolver: zodResolver(createListingSchema),
    defaultValues: {
      active: true,
    },
  });

  const onFormSubmit = (values: z.infer<typeof createListingSchema>) => {
    console.log(values);
    // TODO: POST call for creating a listing
    onClose(true);
  };

  const onInventoryItemChange = (value: string, field: ControllerRenderProps<{
        inventoryItemID: number;
        quantity: number;
        active: boolean;
        attachment: string;
    }, "inventoryItemID">) => {
    field.onChange(value);
    inventoryItems.forEach((item) => {
      if (item.id.toString() == value) {
        setQuantityAvailable(item.quantity - item.publicCount);
      }
    });
  };

  const onActiveChange = (value: number, field: ControllerRenderProps<{
    inventoryItemID: number;
    quantity: number;
    active: boolean;
    attachment: string;
}, "active">) => {
    field.onChange(value == 1);
    setActiveButton(value);
  };

  const onAttachmentChange = (event: ChangeEvent<HTMLInputElement>) => {
    if(event.target?.files && event.target?.files.length > 0) {
      setImageDisplaying({
        url: URL.createObjectURL(event.target.files[0]),
        alt: event.target?.value,
        id: 1
      });
    }
  }

  return (
    <div className="w-full bg-white p-5" id="filters">
      <FormProvider {...createListingForm}>
        <form
          onSubmit={createListingForm.handleSubmit(onFormSubmit)}
          className="flex flex-grow"
        >
          <div className="flex justify-around items-center w-full
                    max-md:flex-col">
          <div className="w-[25rem] flex flex-col justify-between h-full">
            <FormField
              control={createListingForm.control}
              name="inventoryItemID"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <>
                      <Select
                        onValueChange={(value) =>
                          onInventoryItemChange(value, field)
                        }
                        required={true}
                      >
                        <SelectTrigger className="mb-[0.75rem]">
                          <SelectValue placeholder="Select an item from your inventories" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectLabel>Inveotry Item</SelectLabel>
                            {inventoryItems.map((item) => (
                              <SelectItem
                                key={item.id}
                                value={item.id.toString()}
                              >
                                {item.name} [{item.inventory?.name}]
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                      <div className="flex items-center">
                        <p>Quantity Available: </p>
                        <h5 className="ml-[1rem]">
                          {quantityAvailable > -1 ? quantityAvailable : "N/A"}
                        </h5>
                      </div>
                    </>
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={createListingForm.control}
              name="quantity"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      {...field}
                      type="number"
                      min="1"
                      disabled={quantityAvailable == -1}
                      placeholder="Quantity Listed"
                      className="max-w-[10rem] mb-5"
                      id="quantity"
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={createListingForm.control}
              name="active"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <RadioButton
                      label1="Active"
                      label2="Inactive"
                      selected={activeButton}
                      onChange={(newSelected) =>
                        onActiveChange(newSelected, field)
                      }
                      className="bg-[#F4F4F5]"
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
          <div
            className="w-[2px] h-[80%] bg-[#d9d9d9] rounded
                      max-md:w-[80%] max-md:h-[2px] max-md:my-[1rem]"
          />
          <div className="h-full flex flex-col justify-between w-[15rem]
                          max-md:w-[25rem]">
            <FormField
              control={createListingForm.control}
              name="attachment"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input 
                      {...field}
                      onChange={event => onAttachmentChange(event)}
                      type="file" 
                      accept=".png,.jpg,.jpeg"
                      className="mb-[1rem]"
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            {imageDisplaying &&
              <ImageCarousel 
                images={[imageDisplaying]}
              />
            }
            <div className="flex ml-auto mt-[1rem]
                            max-md:mx-auto">
            <button onClick={() => onClose(false)} className="button !bg-[#BBBBBB]">Cancel</button>
              <button type="submit" className="button ml-[1rem]">
                Create Listing
              </button>
            </div>
          </div>
          </div>
        </form>
      </FormProvider>
    </div>
  );
}
