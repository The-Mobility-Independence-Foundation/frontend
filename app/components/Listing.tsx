import { ListingData } from "../models/Listings";

export interface Props {
  listing: ListingData
}

export default function Listing({listing}: Props) {
  return <>
    Listing!
  </>
}