import { Messages } from "../models/Message";
import { useEffect, useRef, useState } from "react";
import { testMessages } from "../testData/TestMessagesData";
import { ChatMessageList } from "@/components/ui/chat/chat-message-list";
import { ChatBubble, ChatBubbleMessage } from "@/components/ui/chat/chat-bubble";
import ImageCarousel from "./ImageCarousel";

export interface MessagesProps {
    conversationId: string;
    userId: string;
    className?: string;
}

export default function Conversation({conversationId, userId, className}: MessagesProps) {    
    const [messages, setMessages] = useState<Messages>({
        message: "Default",
        data: {
            count: 0,
            hasNext: false,
            nextToken: null,
            results: []
        }
    });

    const getMessages = async () => {
        // TODO api call
        setMessages(testMessages)
    };

    useEffect(() => {
        getMessages();

        const timer = setInterval(getMessages, 2000);
        return () => clearInterval(timer);
    }, []);

    return (
        <div className={className}>
            <ChatMessageList>
                {messages.data?.results.map((message, index, messages) => {
                    return <>
                        {(index == 0 || messages[index - 1].createdAt.toLocaleDateString() != message.createdAt.toLocaleDateString()) && 
                        <div className="flex items-center my-4">
                            <div className="flex-grow border-t border-gray-300"></div>
                                <span className="mx-2 text-xs text-gray-500 whitespace-nowrap">
                                    {message.createdAt.toLocaleDateString()}
                                </span>
                            <div className="flex-grow border-t border-gray-300"></div>
                        </div>}
                        <ChatBubble key={message.id} variant={message.authorId == userId ? "sent" : "received"} className="mb-0">
                            <ChatBubbleMessage variant={message.authorId == userId ? "sent" : "received"} 
                            className={message.authorId == userId ? "bg-[#034FA7] mb-0" : "bg-[#002856] text-white mb-0"}>
                                {message.messageContent}
                            </ChatBubbleMessage>
                        </ChatBubble>
                        <p className={"m-0 text-xs " + (message.authorId == userId ? "text-right" : "")}>
                            {index == messages.length - 1 && message.readStatus == "read" && <>Read </>}
                            {message.createdAt.toLocaleTimeString([], {
                                hour: "numeric",
                                minute: "2-digit",
                                hour12: true,
                            })}
                            {message.updatedAt != null && message.updatedAt.toLocaleString() != message.createdAt.toLocaleString() && <> (edited)</>}
                        </p>
                    </>
                })}
            </ChatMessageList>
        </div>
        
      );
}