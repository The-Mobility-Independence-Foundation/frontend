import { useState } from "react";
import { z } from "zod";
import { InventoryItemData } from "../models/InventoryItem";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormControl, FormField, FormItem } from "@/components/ui/form";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import RadioButton from "./RadioButton";

// TODO: second half
export default function CreateListing() {
  const [inventoryItems, setInventoryItems] = useState<InventoryItemData[]>([]);
  const [quantityAvailable, setQuantityAvailable] = useState(-1);
  const [activeButton, setActiveButton] = useState(1);

  // TODO: API call for grabbing all items from all inventories

  const createListingSchema = z.object({
    inventoryItemID: z
      .number({
        required_error: "Select an item from your inventories"
      }),
    quantity: z
      .number({
        required_error: "Include how much you would like to list"
      })
      .min(1),
    active: z
      .boolean({
        required_error: "Indicate whether or not this listing will be active upon creation"
      }),
    attachment: z
      .string()
  });

  const createListingForm = useForm<z.infer<typeof createListingSchema>>({
    resolver: zodResolver(createListingSchema),
    defaultValues: {
      active: true
    }
  });

  const onFormSubmit = (values: z.infer<typeof createListingSchema>) => {
    console.log(values);
    // TODO: POST call for creating a listing
  }

  const onInventoryItemChange = (value: string, field: any) => {
    field.onChange(value);
    inventoryItems.forEach(item => {
      if(item.id.toString() == value) {
        setQuantityAvailable(item.quantity - item.publicCount);
      }
    });
  }

  const onActiveChange = (value: number, field: any) => {
    field.onChange(value == 1);
    setActiveButton(value);
  }

  return <div className="w-full bg-white p-5" id="filters">
      <FormProvider {...createListingForm}>
        <form 
          onSubmit={createListingForm.handleSubmit(onFormSubmit)}
          className="flex justify-around w-min 
                    max-md:flex-col max-md:items-center max-md:w-full"
        >
          <div className="w-[25rem]">
            <FormField
              control={createListingForm.control}
              name="inventoryItemID"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                  <Select
                    onValueChange={value => onInventoryItemChange(value, field)}
                    required={true}
                  >
                    <SelectTrigger className="mb-[0.75rem]">
                      <SelectValue placeholder="Select an item from your inventories" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Inveotry Item</SelectLabel>
                        {inventoryItems.map(item => 
                          <SelectItem 
                            key={item.id}
                            value={item.id.toString()}
                          >
                              {item.name} [{item.inventory.name}]
                          </SelectItem>
                        )}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  </FormControl>
                </FormItem>
              )}
            />
            <p className="flex items-center">Quantity Available: <h5 className="ml-[1rem]">{quantityAvailable > -1 ? quantityAvailable : "N/A"}</h5></p>
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
                      onChange={newSelected => onActiveChange(newSelected, field)}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
        </form>
      </FormProvider>
    </div>
}