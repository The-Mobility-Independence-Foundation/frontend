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
        const timer = setInterval(getMessages, 2000);
        return () => clearInterval(timer);
    }, []);

    const messageListRef = useRef(null);

    return (
        <div className={className}>
            <ChatMessageList>
                <ChatBubble variant='sent'>
                    <ChatBubbleMessage variant='sent' className="bg-[#034FA7]">
                        Hello, how has your day been? I hope you are doing well.
                    </ChatBubbleMessage>
                </ChatBubble>

                <ChatBubble variant='received'>
                    <ChatBubbleMessage variant='received' className="bg-[#002856] text-white flex-col justify-start">
                        Hi, I am doing well, thank you for asking. How can I help you today?
                    </ChatBubbleMessage>
                </ChatBubble>
            </ChatMessageList>
        </div>
        
      );
}