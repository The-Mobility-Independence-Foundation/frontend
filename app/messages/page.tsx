"use client"

import { useState } from "react";
import Conversation from "../components/Conversation";
import ConversationsList from "../components/ConversationsList";
import { ConversationData } from "../models/Conversation";
import { testUserData, UserData } from "../models/User";
import { HamburgerMenuIcon } from "@radix-ui/react-icons"
import { Button } from "@/components/ui/button";

export default function PrivateMessages() {
  const [conversationId, setConversationId] = useState<string>();
  const [user, setUser] = useState<UserData>();

  const selectConversation = (conversation: ConversationData) => {
      setConversationId(conversation.id);
      setUser(testUserData);
  }

  return (<div className="flex relative">
    <ConversationsList userId="1" className="w-[20%]" selectConversation={selectConversation}></ConversationsList>

    {conversationId != null && user != null && <Conversation conversationId={conversationId} user={user} className="w-full"></Conversation>}

    <Button className="fixed top-10 right-10">
      <HamburgerMenuIcon />
    </Button>
  </div>);
}