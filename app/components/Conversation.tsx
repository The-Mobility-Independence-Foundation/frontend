import { MessageBox, MessageList } from "react-chat-elements";
import { Messages } from "../models/Message";
import { useEffect, useRef, useState } from "react";
import { testMessages } from "../testData/TestMessagesData";

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
            {/* <MessageList
            referance={messageListRef} // Pass the reference
            className="message-list"
            lockable={true}
            toBottomHeight={"100%"}
            dataSource={[
                {
                    id: 1,
                    className: "bg-[#002856]",
                    position: "left",
                    type: "text",
                    title: "",
                    text: "Give me a message list example!",
                    date: new Date(),
                    focus: false,
                    titleColor: "#000",
                    status: "read",
                    forwarded: false,
                    replyButton: false,
                    removeButton: false,
                    notch: true,
                    retracted: false,
                },
                {
                    id: 2,
                    className: "bg-[#002856]",
                    position: "right",
                    type: "text",
                    title: "",
                    text: "That's all.",
                    date: new Date(),
                    focus: false,
                    titleColor: "#000",
                    status: "sent",
                    forwarded: false,
                    replyButton: false,
                    removeButton: true,
                    notch: true,
                    retracted: false,
                },
            ]}
            /> */}

        <MessageBox
            id={2}
            className="bg-[#002856]" // Custom background color
            position="right"
            type="text"
            title="" // No title
            text="That's all."
            date={new Date()} // Current date/time
            focus={false}
            titleColor="#000"
            status="sent" // Message status
            forwarded={false}
            replyButton={false}
            removeButton={true}
            notch={true}
            retracted={false}
            />
        </div>
        
      );
}