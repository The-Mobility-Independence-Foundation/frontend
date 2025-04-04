"use client"

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
// import backendService from "../services/backend.service";
import { ListingData } from "../models/Listings";
import Link from "next/link";
import Modal from "../components/modals/Modal";
import CreateOrder from "../components/modals/CreateOrder";
import ImageCarousel, { ImageReference } from "../components/ImageCarousel";
// import {v4 as uuidv4} from "uuid";
import Listing from "../components/Listing";

export default function ListingPage() {
  const [listing, setListing] = useState<ListingData>();
  const [createOrderModalIsOpen, setCreateOrderModalIsOpen] = useState(false);
  const [images, setImages] = useState<ImageReference[]>();
  const [recommendedListings, setRecommendedListings] = useState<ListingData[]>([]);
  const [listingsFromOrg, setListingsFromOrg] = useState<ListingData[]>([]);

  const params = useSearchParams();
  const listingID = params.get("listing_id");

  useEffect(() => {
    // TODO: uncomment when backend is hooked up
    // backendService.get(`/listings/${listingID}`)
    //   .then(response => {
    //     const data = response?.data;
    //     setListing(data as ListingData);
    //   });
    // TODO: uncomment when backend is hooked up
    // backendService.get(`/listings/${listing.inventoryItem.inventory.organization.id}/listings`)
    //   .then(response => {
    //     const data = response?.data;
    //     setListingsFromOrg(data as ListingData[]);
    //   });

    // TODO: uncomment when backend is hooked up
    // backendService.get(`/orgs/${listing.}/recommended`)
    //   .then(response => {
    //     const data = response?.data;
    //     setRecommendedListings(data as ListingData[]);
    //   });
  }, [listingID])

  return (
    <>
      {listing && listing.inventoryItem && listing.inventoryItem.part && listing.inventoryItem.inventory && listing.inventoryItem.inventory.organization && (
        <>
          <div className="flex flex-col h-screen">
            {/** TOP BAR */}
            <div className="w-full min-h-min flex justify-between p-[0.65rem] bg-[#F4F4F5] drop-shadow-md overflow-hidden">
              <div className="mr-[0.25rem]">
                <h2>{listing.name}</h2>
                <p className="max-w-[20rem] text-sm">
                  {listing.inventoryItem.part.description}
                </p>
                <div className="flex mt-[1rem]">
                  <div>
                    <h5>{listing.inventoryItem.part.partNumber}</h5>
                    <p className="mt-[revert]">
                      {listing.inventoryItem.part.model}
                    </p>
                    <p>{listing.inventoryItem.part.partType}</p>
                  </div>
                  <ul className="ml-[3rem] max-h-[6rem] overflow-y-auto">
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
              <div className="flex flex-col my-[1rem] mx-[0.25rem] justify-between">
                <div>
                  <h5>{listing.inventoryItem.inventory.organization.name}</h5>
                  <p>{listing.inventoryItem.inventory.organization.phoneNumber}</p>
                  {listing.inventoryItem.inventory.organization.socials.map(social => 
                  <p>
                    {social}
                  </p>
                  )}
                </div>
                <Link
                  href={`/messages?u_id=${listing.inventoryItem.inventory.organization.id}`}
                  className="w-full"
                >
                  <button className="w-full button">Message</button>{" "}
                  {/**TODO: routes to specified user pv */}
                </Link>
              </div>
              <div className="flex flex-col my-[1rem] mx-[0.25rem] justify-between">
                <div>
                  <h5>{listing.inventoryItem.inventory.name}</h5>
                  {listing.inventoryItem.inventory.address &&
                    <div className="text-white">
                      <h5>{listing.inventoryItem.inventory.address.addressLine1}</h5>
                      <h5>{listing.inventoryItem.inventory.address.addressLine2}</h5>
                      <p>{listing.inventoryItem.inventory.address.city}, {listing.inventoryItem.inventory.address.state}</p>
                      <p>{listing.inventoryItem.inventory.address.zipCode}</p>
                    </div>
                    }
                </div>
                <div>
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
              {images && <ImageCarousel className="my-auto mx-[0.25rem]" images={images} />}
            </div>
            <div className="bg-[#D8EAF6] w-full flex-1 p-[0.65rem]">
              {/** LISTINGS FROM ORG */}
              <div className="mb-[2rem]">
                <h5 className="mb-[1rem]">Listings from Organization</h5>
                <div className="flex flex-nowrap overflow-x-scroll">
                {listingsFromOrg.map(listing => 
                  <Listing 
                    listing={listing}
                    className="mr-[1rem] bg-[#EFFBFF]"
                    key={listing.id}
                  />
                )}
                </div>
              </div>
              {/** RECOMMENDED LISTINGS */}
              <div>
                <h5 className="mb-[1rem]">Recommended Listings</h5>
                <div className="flex flex-nowrap overflow-x-scroll">
                {recommendedListings.map(listing => 
                  <Listing 
                    listing={listing}
                    className="mr-[1rem] bg-[#EFFBFF]"
                    key={listing.id}
                  />
                )}
                </div>
              </div>
            </div>
          </div>
          {/** ETC */}
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
      )}
    </>
  );
}