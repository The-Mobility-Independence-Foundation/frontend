"use client"

import Conversation from "../components/Conversation";
import ConversationsList from "../components/ConversationsList";
import { testUserData } from "../models/User";

export default function PrivateMessages() {
  return (<div className="flex">
    <ConversationsList userId="1" className="w-[20%]"></ConversationsList>

     <Conversation conversationId="1" user={testUserData} className="w-[63%]"></Conversation>
  </div>);
}