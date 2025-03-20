import { useState } from "react";
import { z } from "zod";
import { InventoryItemData } from "../models/InventoryItem";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

export default function CreateListing() {
  const [inventoryItems, setInventoryItems] = useState<InventoryItemData[]>([]);
  const [selectedInventoryItem, setSelectedInventoryItem] = useState<InventoryItemData>();

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
    attachment: z
      .string()
  });

  const createListingForm = useForm<z.infer<typeof createListingSchema>>({
    resolver: zodResolver(createListingSchema)
  });

  const onFormSubmit = (values: z.infer<typeof createListingSchema>) => {
    console.log(values);
    // TODO: POST call for creating a listing
  }

  return <div className="md:flex w-full bg-white pb-5" id="filters">
      <FormProvider {...createListingForm}>
        <form onSubmit={createListingForm.handleSubmit(onFormSubmit)}>

        </form>
      </FormProvider>
    </div>
}