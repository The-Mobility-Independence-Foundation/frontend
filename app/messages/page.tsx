"use client"

import { useEffect, useState } from "react";
import Conversation from "../components/Conversation";
import ConversationsList from "../components/ConversationsList";
import { ConversationData } from "../models/Conversation";
import { User, UserData } from "../models/User";
import { HamburgerMenuIcon } from "@radix-ui/react-icons"
import { Button } from "@/components/ui/button";
import Listing from "../components/Listing";
import backendService from "../services/backend.service";
import { ListingData, SingleListing } from "../models/Listings";
import { userEmitterBus } from "@/lib/userEmitterBus";

export default function PrivateMessages() {
  const [conversationId, setConversationId] = useState<string>();
  const [user, setUser] = useState<UserData>();
  const [listing, setListing] = useState<ListingData>();

  useEffect(() => {
    userEmitterBus.on("user", (userEmitted: UserData) => {
      setUser(userEmitted);
    })
  }, [])

  const selectConversation = async (conversation: ConversationData) => {
    console.log(conversation)
    if(conversation.listingId != null) {
      const response = await backendService.get(`/listing/${conversation.listingId}`);
      setListing((response as SingleListing).data);
    }

    setConversationId(conversation.id);

    const response = await backendService.get(`/users/${conversation.participantId}`);
    setUser((response as User).data);
  }

  return (user && <div className="flex relative">
    <ConversationsList userId={user.id} className="w-[20%]" selectConversation={selectConversation} />

    {conversationId != null && user != null && <Conversation conversationId={conversationId} user={user} className="w-full" />}

    {listing != null && 
      <>
      <Listing listing={listing} userID={user.id} />
      <Button variant="ghost" className="absolute top-0 right-0">
        <HamburgerMenuIcon />
      </Button>
      </> }
  </div>);
}