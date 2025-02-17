"use client"

import { ListingData } from "../models/Listings";
import ImageCarousel, { ImageReference } from "./ImageCarousel";
import {v4 as uuidv4} from "uuid";
import Link from "next/link";
import { Checkbox } from "@/components/ui/checkbox"
import { CheckedState } from "@radix-ui/react-checkbox";
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button";
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

export interface Props {
  listing: ListingData;
  myListing?: boolean;
  onCheckboxChange?: (checked: CheckedState) => void;
}

export default function Listing({listing, myListing, onCheckboxChange}: Props) {
  const userID = 1; // TODO: replace with real User ID

  const inventoryItem = listing.inventoryItem;
  const part = inventoryItem.part;
  const images: ImageReference[] = [
    {
      url: listing.attachment,
      alt: `Attachment for ${part.name}`,
      id: uuidv4()
    }
  ];

  const quantityFormSchema = z.object({
    quantity: z.coerce
      .number()
      .min(1, "Must list at least one item.")
      .max(inventoryItem.publicCount, "Listing quantity cannot exceed public count")
  })

  const quantityForm = useForm<z.infer<typeof quantityFormSchema>>({
    resolver: zodResolver(quantityFormSchema),
    defaultValues: {
      quantity: listing.quantity,
    }
  });

  const onSubmit = (values: z.infer<typeof quantityFormSchema>) => {
    // let quantity = parseInt(values.quantity);
    console.log(values.quantity);
  }

  return <div className="flex justify-between w-full bg-[#F4F4F5] min-h-[11rem] drop-shadow-md rounded-sm px-[1rem] py-[0.75rem] 
                        max-xl:flex-col max-xl:w-max 
                        max-sm:pl-[2rem]"
          >
    <div className="flex 
                    max-sm:flex-col"
    >
      <div className="flex">
        {onCheckboxChange != null && 
          <Checkbox onCheckedChange={(checked) => onCheckboxChange(checked)} />
        }
        <ImageCarousel images={images}></ImageCarousel>
      </div>
      <div className="flex max-sm:mt-[1rem]">
        <div>
          <h4>{part.name}</h4>
          <h5>{part.partNumber}</h5>
          <p className="mt-[revert]">{part.model}</p>
          <p>{part.partType}</p>
        </div>
        <ul className="ml-[3rem] max-h-[10rem] overflow-y-auto">
          {Object.keys(listing.attributes).map(key => 
          <li className="mb-[0.25rem]" key={`${key}: ${listing.attributes[key]}`}>
            - {key}: {listing.attributes[key]}
          </li>)}
        </ul>
      </div>
    </div>
    <div className="flex 
                    max-xl:mt-[1rem]
                    max-sm:flex-col"
    >
      <div className="flex
                      max-sm:justify-between"
      >
        <div className="mr-[5rem]">
          <h5 className="mb-[1rem]">{inventoryItem.inventory.name}</h5>
          <p>{inventoryItem.inventory.location}</p>
        </div>
        <div className="flex flex-col justify-between mr-[5rem]
                        max-sm:mr-[0rem]">
          <h5>{inventoryItem.inventory.organization.name}</h5>
          <div>
            <p>{inventoryItem.inventory.organization.email}</p>
            <p>{inventoryItem.inventory.organization.phoneNumber}</p>
          </div>
          <Link
            href={`/messages?u_id=${userID}`}
            className="w-full"
          >
            <button 
              className="w-full"
            >Message</button> {/**TODO: routes to specified user pv */}
          </Link>
        </div>
      </div>
      {myListing ? 
      <div className="mt-auto">
        <FormProvider {...quantityForm}>
          <form onSubmit={quantityForm.handleSubmit(onSubmit)}>
            <FormField
              control={quantityForm.control}
              name="quantity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel >Quantity Available:</FormLabel>
                  <FormControl>
                    <Input 
                      {...field}
                      className="bg-white rounded-sm"
                      type="number"
                      min="1"
                      max={listing.inventoryItem.publicCount}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            >
            </FormField>
          </form>
        </FormProvider>
      </div>
      : 
      <div className="flex flex-col justify-between">
        <div className="mt-[1.5rem]">
          <p className="w-max mx-auto">Quantity Available:</p>
          <h5 className="w-min mx-auto">{listing.quantity}</h5>
        </div>
        <button>Create Order</button> {/**TODO: opens "Create Order" modal */}
      </div>
      }
    </div>
  </div>
}