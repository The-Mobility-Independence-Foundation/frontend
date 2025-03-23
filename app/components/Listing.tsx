"use client"

import { ListingData, PatchListing } from "../models/Listings";
import ImageCarousel, { ImageReference } from "./ImageCarousel";
import {v4 as uuidv4} from "uuid";
import Link from "next/link";
import { Checkbox } from "@/components/ui/checkbox"
import { CheckedState } from "@radix-ui/react-checkbox";
import { Input } from "@/components/ui/input"
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import backendService from "../services/backend.service";
import RadioButton from "./RadioButton";
import { ACTIVE, INACTIVE, statuses } from "../models/Status";
import { useState } from "react";
import Modal from "./modals/Modal";
import CreateOrder from "./modals/CreateOrder";
import Menu from "./Menu";

export interface ListingProps {
  listing: ListingData;
  myListing?: boolean;
  onCheckboxChange?: (checked: CheckedState) => void;
  checked?: boolean;
  onStatusChange?: (status: number) => void;
  activeStatus?: number;
  className?: string;
}

export default function Listing({listing, myListing, onCheckboxChange, checked, onStatusChange, activeStatus, className}: ListingProps) {
  const userID = 1; // TODO: replace with real User ID

  const [createOrderModalIsOpen, setCreateOrderModalIsOpen] = useState(false);

  const inventoryItem = listing.inventoryItem;
  const part = inventoryItem.part;
  const images: ImageReference[] = [
    {
      url: listing.attachment,
      alt: `Attachment for ${listing.title}`,
      id: uuidv4()
    }
  ];

  const quantityFormSchema = z.object({
    quantity: z.coerce
      .number()
      .min(1, "Must list at least one item.")
      .max(inventoryItem.publicCount, `Listing quantity cannot exceed public count (${inventoryItem.publicCount})`)
  })

  const quantityForm = useForm<z.infer<typeof quantityFormSchema>>({
    resolver: zodResolver(quantityFormSchema),
    defaultValues: {
      quantity: listing.quantity,
    }
  });

  const patchListing = (body: PatchListing) => {
    backendService.put(`/listings/${listing.id}`, body)
      .then(response => {
        // TODO: toastr with message
      });
  }

  const onQuantitySubmit = (values: z.infer<typeof quantityFormSchema>) => {
    patchListing({
      title: listing.title,
      description: "",
      attributes: listing.attributes,
      quantity: values.quantity,
      inventoryItemId: inventoryItem.id,
      status: listing.status
    });
  }

  const onActiveChange = (newSelected: number) => {
    if (onStatusChange) { onStatusChange(newSelected); }
    patchListing({
      title: listing.title,
      description: "",
      attributes: listing.attributes,
      quantity: listing.quantity,
      inventoryItemId: inventoryItem.id,
      status: statuses[newSelected-1]
    });
  }

  const onMenuItemClick = (itemClicked: string) => {
    switch(itemClicked) {
      case "Activate": {
        onActiveChange(1);
        break;
      }
      case "Deactivate": {
        onActiveChange(2);
        break;
      }
    }
  }

  return (
    <>
      <div
        className={`flex justify-between w-full bg-[#F4F4F5] min-h-[11rem] drop-shadow-md rounded-sm px-[1rem] py-[0.75rem] 
                  max-xl:flex-col max-xl:w-max 
                  max-sm:pl-[2rem] ${className}`}
      >
        <div
          className="flex 
                    max-sm:flex-col"
        >
          <div className="flex">
            {onCheckboxChange != null && (
              <Checkbox
                checked={checked}
                onCheckedChange={(checked) => onCheckboxChange(checked)}
              />
            )}
            <ImageCarousel images={images}></ImageCarousel>
          </div>
          <div className="flex max-sm:mt-[1rem]">
            <div>
              <Link href={`/listing?listing_id=${listing.id}`}><h4 className="hover:underline">{listing.title}</h4></Link>
              <h5>{part.partNumber}</h5>
              <p className="mt-[revert]">{part.model}</p>
              <p>{part.partType}</p>
            </div>
            <ul className="ml-[3rem] max-h-[10rem] overflow-y-auto">
              {Object.keys(listing.attributes).map((key) => (
                <li
                  className="mb-[0.25rem]"
                  key={`${key}: ${listing.attributes[key]}`}
                >
                  - {key}: {listing.attributes[key]}
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div
          className="flex 
                    max-xl:mt-[1rem]
                    max-sm:flex-col"
        >
          <div
            className="flex
                      max-sm:justify-between"
          >
            <div className="mr-[5rem]">
              <h5 className="mb-[1rem]">{inventoryItem.inventory.name}</h5>
              <p>{inventoryItem.inventory.location}</p>
            </div>
            {myListing ? (
              <div className="flex flex-col justify-between mr-[5rem]">
                <Link
                  href={`/inventories/inventory?inventoryID=${inventoryItem.inventory.id}&inventoryItemID=${inventoryItem.id}`}
                  className="text-[#009D4F] text-center"
                >
                  View Part in Inventory
                </Link>
                <RadioButton
                  label1={ACTIVE}
                  label2={INACTIVE}
                  selected={activeStatus != undefined ? activeStatus : 1}
                  onChange={onActiveChange}
                />
              </div>
            ) : (
              <div
                className="flex flex-col justify-between mr-[5rem]
                          max-sm:mr-[0rem]"
              >
                <h5>{inventoryItem.inventory.organization.name}</h5>
                <div>
                  <p>{inventoryItem.inventory.organization.email}</p>
                  <p>{inventoryItem.inventory.organization.phoneNumber}</p>
                </div>
                <Link href={`/messages?u_id=${inventoryItem.inventory.organization.id}`} className="w-full">
                  <button className="w-full button">Message</button>{" "}
                  {/**TODO: routes to specified user pv */}
                </Link>
              </div>
            )}
          </div>
          {myListing ? (
            <div className="mt-auto">
              <FormProvider {...quantityForm}>
                <form onSubmit={quantityForm.handleSubmit(onQuantitySubmit)}>
                  <FormField
                    control={quantityForm.control}
                    name="quantity"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Quantity Available:</FormLabel>
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
                  ></FormField>
                </form>
              </FormProvider>
            </div>
          ) : (
            <div className="flex flex-col justify-between">
              <div className="mt-[1.5rem]">
                <p className="w-max mx-auto">Quantity Available:</p>
                <h5 className="w-min mx-auto">{listing.quantity}</h5>
              </div>
              <button className="button" onClick={() => setCreateOrderModalIsOpen(true)}>
                Create Order
              </button>
            </div>
          )}
        </div>

        {myListing && <Menu items={["Edit", activeStatus == 1 ? "Deactivate" : "Activate", "Delete"]} onItemClick={onMenuItemClick} className="fixed top-2 right-4"></Menu>}
      </div>
      <Modal
        isOpen={createOrderModalIsOpen}
        onClose={() => setCreateOrderModalIsOpen(false)}
      >
        <CreateOrder 
          listing={listing} 
          listingImages={images}
          onClose={() => setCreateOrderModalIsOpen(false)}
        />
      </Modal>
    </>
  );
}