"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
// import backendService from "../services/backend.service";
import { SingleListing, ListingData, Listings } from "../models/Listings";
import Link from "next/link";
import Modal from "../components/modals/Modal";
import CreateOrder from "../components/modals/CreateOrder";
import ImageCarousel, { ImageReference } from "../components/ImageCarousel";
// import {v4 as uuidv4} from "uuid";
import Listing from "../components/Listing";
import backendService from "../services/backend.service";
import { toastErrors } from "../models/Generic";
import { userEmitterBus } from "../layout";
import { UserData } from "../models/User";
import { Spinner } from "@/components/ui/spinner";

export default function ListingPage() {
  const [listing, setListing] = useState<ListingData>();
  const [createOrderModalIsOpen, setCreateOrderModalIsOpen] = useState(false);
  const [images, setImages] = useState<ImageReference[]>([]);
  const [recommendedListings, setRecommendedListings] = useState<ListingData[]>(
    []
  );
  const [listingsFromOrg, setListingsFromOrg] = useState<ListingData[]>([]);
  const [loadingListing, setLoadingListing] = useState(false);
  const [loadingOrgListings, setLoadingOrgListings] = useState(false);
  const [loadingRecommendedListings, setLoadingRecommendedListings] =
    useState(false);
  const [userID, setUserID] = useState("");

  const params = useSearchParams();
  const listingID = params.get("listingID");

  useEffect(() => {
    userEmitterBus.on("user", (userEmitted: UserData) => {
      setUserID(userEmitted.id);
    });
  });

  useEffect(() => {
    setLoadingListing(true);
    backendService.get(`/listings/${listingID}`).then((response) => {
      setLoadingListing(false);
      const responseAsListing = response as SingleListing;
      if (!responseAsListing.success) {
        toastErrors(response);
        return;
      }
      setListing(responseAsListing.data);
    });
  }, [listingID]);

  useEffect(() => {
    if (!listing) {
      return;
    }

    setLoadingOrgListings(true);
    backendService
      .get(`/listings/${listing.organization.id}/listings`)
      .then((response) => {
        setLoadingOrgListings(false);
        const responseAsOrgListings = response as Listings;
        if (!responseAsOrgListings.success) {
          toastErrors(response);
          return;
        }
        setListingsFromOrg(responseAsOrgListings.data.results);
      });
    // TODO: API call for recommended listings
    // backendService.get(`/orgs/${listing.}/recommended`)
    //   .then(response => {
    //     const data = response?.data;
    //     setRecommendedListings(data as ListingData[]);
    //   });
    setImages(
      listing.attachments.map((att) => {
        return {
          url: att.url,
          alt: att.fileName,
          id: att.id,
        };
      })
    );
  }, [listing]);

  return (
    <>
      {listing && (
          <>
            <div className="flex flex-col h-screen">
              {/** TOP BAR */}
              <div className="w-full min-h-min flex justify-between p-[0.65rem] bg-[#F4F4F5] drop-shadow-md overflow-hidden">
                <div className="mr-[0.25rem]">
                  <h2>{loadingListing ? "Loading..." : listing.name}</h2>
                  <p className="max-w-[20rem] text-sm">{listing.description}</p>
                  <div className="flex mt-[1rem]">
                    <div>
                      <h5>{listing.part.name}</h5>
                      <p className="mt-[revert]">
                        {listing.part.partNumber}
                      </p>
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
                    <h5>{listing.organization.name}</h5>
                    <p>
                      {listing.organization.phoneNumber}
                    </p>
                    {listing.organization.socials.map(
                      (social) => (
                        <p key={social}>{social}</p>
                      )
                    )}
                  </div>
                  <Link
                    href={`/messages?u_id=${listing.organization.id}`}
                    className="w-full"
                  >
                    <button className="w-full button">Message</button>{" "}
                    {/**TODO: routes to specified user pv */}
                  </Link>
                </div>
                <div className="flex flex-col my-[1rem] mx-[0.25rem] justify-between">
                  <div>
                    <h5>{listing.inventory.name}</h5>
                    {listing.inventory.address && (
                      <div className="text-white">
                        <h5>
                          {listing.address.addressLine1}
                        </h5>
                        <h5>
                          {listing.address.addressLine2}
                        </h5>
                        <p>
                          {listing.address.city},{" "}
                          {listing.address.state}
                        </p>
                        <p>{listing.address.zipCode}</p>
                      </div>
                    )}
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
                {images && (
                  <ImageCarousel
                    className="my-auto mx-[0.25rem]"
                    images={images}
                  />
                )}
              </div>
              <div className="bg-[#D8EAF6] w-full flex-1 p-[0.65rem]">
                {/** LISTINGS FROM ORG */}
                <div className="mb-[2rem]">
                  <h5 className="mb-[1rem]">Listings from Organization</h5>
                  <div className="flex flex-nowrap overflow-x-scroll">
                    {loadingOrgListings && <Spinner />}
                    {!loadingOrgListings &&
                      listingsFromOrg.map((listing) => (
                        <Listing
                          listing={listing}
                          userID={userID}
                          className="mr-[1rem] bg-[#EFFBFF]"
                          key={listing.id}
                        />
                      ))}
                  </div>
                </div>
                {/** RECOMMENDED LISTINGS */}
                <div>
                  <h5 className="mb-[1rem]">Recommended Listings</h5>
                  <div className="flex flex-nowrap overflow-x-scroll">
                    {loadingRecommendedListings && <Spinner />}
                    {!loadingRecommendedListings &&
                      recommendedListings.map((listing) => (
                        <Listing
                          listing={listing}
                          userID={userID}
                          className="mr-[1rem] bg-[#EFFBFF]"
                          key={listing.id}
                        />
                      ))}
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
