"use client"

import Conversation from "../components/Conversation";
import { testUserData } from "../models/User";

export default function PrivateMessages() {
  return (<div className="flex justify-center">
     <Conversation conversationId="1" user={testUserData} className="w-[70%]"></Conversation>
  </div>);
}