"use client"

import Conversation from "../components/Conversation";

export default function PrivateMessages() {
  return (<div className="flex justify-center">
     <Conversation conversationId="1" userId="1" className="w-[70%]"></Conversation>
  </div>);
}