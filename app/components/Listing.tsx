"use client";

import {
  LISTING_STATUSES,
  ListingData,
  ListingPatchData,
  ACTIVE,
  INACTIVE,
} from "../models/Listings";
import ImageCarousel, { ImageReference } from "./ImageCarousel";
// import {v4 as uuidv4} from "uuid";
import Link from "next/link";
import { Checkbox } from "@/components/ui/checkbox";
import { CheckedState } from "@radix-ui/react-checkbox";
import { Input } from "@/components/ui/input";
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
// import backendService from "../services/backend.service";
import RadioButton from "./RadioButton";
import { useEffect, useState } from "react";
import Modal from "./modals/Modal";
import CreateOrder from "./modals/CreateOrder";
import Menu from "./Menu";
import { InventoryData } from "../models/Inventory";
import { OrganizationData } from "../models/Organization";
import { userEmitterBus } from "../layout";
import { UserData } from "../models/User";

export interface ListingProps {
  listing: ListingData;
  myListing?: boolean;
  onCheckboxChange?: (checked: CheckedState) => void;
  checked?: boolean;
  onStateChange?: (state: number) => void;
  activeState?: number;
  onOpenChange?: (open: boolean, listing: ListingData) => void;
  onMenuItemClickModal?: (itemClicked: string) => void;
  className?: string;
}

const ACTIVATE = "Activate";
const DEACTIVATE = "Deactivate";
const EDIT = "Edit Attachment";
const DELETE = "Delete";

export default function Listing({
  listing,
  myListing,
  onCheckboxChange,
  checked,
  onStateChange,
  activeState,
  onOpenChange,
  onMenuItemClickModal,
  className,
}: ListingProps) {
  const [createOrderModalIsOpen, setCreateOrderModalIsOpen] = useState(false);
  const [userID, setUserID] = useState("");

  const part = listing.part;
  const organization = listing.organization;
  const inventory = listing.inventory;
  const inventoryItem = listing.inventoryItem; // should not be null if myListing
  const images: ImageReference[] = listing.attachments.map((att) => {
    return {
      url: att.url,
      alt: att.fileName,
      id: att.id,
    };
  });

  const quantityFormSchema = z.object({
    quantity: z.coerce
      .number()
      .min(1, "Must list at least one item.")
      .max(
        inventoryItem ? inventoryItem.publicCount : 0,
        inventoryItem
          ? `Listing quantity cannot exceed public count (${inventoryItem.publicCount})`
          : "You do not have access to modify this field"
      ),
  });

  const quantityForm = useForm<z.infer<typeof quantityFormSchema>>({
    resolver: zodResolver(quantityFormSchema),
    defaultValues: {
      quantity: listing.quantity,
    },
  });

  useEffect(() => {
    userEmitterBus.on("user", (userEmitted: UserData) => {
      setUserID(userEmitted.id);
    })
  })

  const patchListing = (body: ListingPatchData) => {
    // TODO: patch listing
    // backendService.put(`/listings/${listing.id}`, body)
    //   .then(response => {
    //   });
    console.log(body);
  };

  const onQuantitySubmit = (values: z.infer<typeof quantityFormSchema>) => {
    patchListing({
      quantity: values.quantity,
    });
  };

  const onActiveChange = (newSelected: number) => {
    if (onStateChange) {
      onStateChange(newSelected);
    }
    patchListing({
      state: LISTING_STATUSES[newSelected - 1].toLowerCase(),
    });
  };

  const onMenuItemClick = (itemClicked: string) => {
    switch (itemClicked) {
      case ACTIVATE: {
        onActiveChange(1);
        break;
      }
      case DEACTIVATE: {
        onActiveChange(2);
        break;
      }
      default: {
        if (onMenuItemClickModal) {
          onMenuItemClickModal(itemClicked);
        }
      }
    }
  };
  return (
    <>
      {inventory && organization && part && (
        <>
          <div
            className={`flex flex-wrap justify-between w-full bg-[#F4F4F5] min-h-[11rem] drop-shadow-md rounded-sm px-[1rem] py-[0.75rem] ${className}`}
          >
            <div className="flex flex-wrap">
              <div className="flex">
                {onCheckboxChange != null && (
                  <Checkbox
                    checked={checked}
                    onCheckedChange={(checked) => onCheckboxChange(checked)}
                  />
                )}
                <ImageCarousel images={images} />
              </div>

              <div className="flex">
                <div>
                  <Link href={`/listing?listingID=${listing.id}`}>
                    <h4 className="hover:underline">{listing.name}</h4>
                  </Link>
                  <h5>{part.name}</h5>
                  <p className="mt-[revert]">{part.partNumber}</p>
                </div>

                <ul className="ml-[3rem] max-h-[10rem] overflow-y-auto">
                  {Object.entries(listing.attributes).map(([key, value]) => (
                    <li className="mb-[0.25rem]" key={`${key}: ${value}`}>
                      - {key}: {value}
                    </li>
                  ))}
                </ul>

                <p className="max-w-[5rem]">{listing.description}</p>
              </div>
            </div>

            <div className="flex flex-wrap">
              <div className="flex max-sm:justify-between">
                <div className="mr-[5rem]">
                  <h5 className="mb-[1rem]">{inventory.name}</h5>
                  {inventory.address && (
                    <div className="text-white">
                      <h5>{inventory.address.addressLine1}</h5>
                      <h5>{inventory.address.addressLine2}</h5>
                      <p>
                        {inventory.address.city}, {inventory.address.state}
                      </p>
                      <p>{inventory.address.zipCode}</p>
                    </div>
                  )}
                </div>

                {myListing && inventoryItem ? (
                  <>
                    <div className="flex flex-col mr-[5rem]">
                      <Link
                        href={`/inventories/inventory?inventory_id=${inventory.id}&inventoryItemID=${inventoryItem.id}`}
                        className="text-[#009D4F] text-center"
                      >
                        View Part in Inventory
                      </Link>
                      <RadioButton
                        label1={ACTIVE}
                        label2={INACTIVE}
                        selected={activeState != undefined ? activeState : 1}
                        onChange={onActiveChange}
                        className="bg-[#FFFFFF] mt-auto"
                      />
                    </div>

                    <div className="mt-auto">
                      <FormProvider {...quantityForm}>
                        <form
                          onSubmit={quantityForm.handleSubmit(onQuantitySubmit)}
                        >
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
                                    max={inventoryItem.publicCount}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </form>
                      </FormProvider>
                    </div>

                    <Menu
                      onOpenChange={(open) =>
                        onOpenChange && onOpenChange(open, listing)
                      }
                      items={[
                        EDIT,
                        activeState === 1 ? DEACTIVATE : ACTIVATE,
                        DELETE,
                      ]}
                      onItemClick={onMenuItemClick}
                      className="fixed top-2 right-4 sm:top-0 sm:right-0 xl:top-2 xl:right-4"
                    />
                  </>
                ) : (
                  <>
                    <div className="flex flex-col justify-between mr-[5rem] max-sm:mr-[0rem]">
                      <h5>{organization.name}</h5>
                      <p>{organization.phoneNumber}</p>
                      <Link
                        href={`/messages?u_id=${organization.id}`}
                        className="w-full"
                      >
                        <button className="w-full button">Message</button>
                      </Link>
                    </div>

                    <div className="flex flex-col justify-between">
                      <div className="mt-[1.5rem]">
                        <p className="w-max mx-auto">Quantity Available:</p>
                        <h5 className="w-min mx-auto">{listing.quantity}</h5>
                      </div>
                      <button
                        className="button"
                        onClick={() => setCreateOrderModalIsOpen(true)}
                      >
                        Create Order
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          <Modal
            isOpen={createOrderModalIsOpen}
            onClose={() => setCreateOrderModalIsOpen(false)}
          >
            <CreateOrder
              listing={listing}
              userID={userID}
              listingImages={images}
              onClose={() => setCreateOrderModalIsOpen(false)}
            />
          </Modal>
        </>
      )}
    </>
  );
}
