import { Messages } from "../models/Message";
import { useEffect, useRef, useState } from "react";
import { testMessages } from "../testData/TestMessagesData";
import { ChatMessageList } from "@/components/ui/chat/chat-message-list";
import { ChatBubble, ChatBubbleAction, ChatBubbleActionWrapper, ChatBubbleMessage } from "@/components/ui/chat/chat-bubble";
import ImageCarousel from "./ImageCarousel";
import { UserData } from "../models/User";
import { Pencil1Icon } from "@radix-ui/react-icons"
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea"

const formSchema = z.object({
    message: z.string().nonempty("Please enter a message").max(2000, "Message exceeds character limit")
});

export interface MessagesProps {
    conversationId: string;
    user: UserData;
    className?: string;
}

export default function Conversation({conversationId, user, className}: MessagesProps) {    
    const [messages, setMessages] = useState<Messages>({
        message: "Default",
        data: {
            count: 0,
            hasNext: false,
            nextToken: null,
            results: []
        }
    });

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema)
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

    function onSubmit(values: z.infer<typeof formSchema>) {

    }

    return (
        <div className={"flex flex-col h-[calc(100vh-85px)] lg:h-[calc(100vh-90px)] " + className}>
            <div className="bg-[#D3E8FF] flex-none">
                <h5 className="text-center">{user.displayName}</h5>
             </div>
            
            <div className="grow">
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

                            <ChatBubble key={message.id} variant={message.authorId == user.id ? "sent" : "received"} className="mb-0">
                                <ChatBubbleMessage variant={message.authorId == user.id ? "sent" : "received"} 
                                className={message.authorId == user.id ? "bg-[#034FA7] mb-0" : "bg-[#002856] text-white mb-0"}>
                                    {message.messageContent}
                                </ChatBubbleMessage>
                                <ChatBubbleActionWrapper>
                                    <ChatBubbleAction
                                        className="size-7"
                                        icon={<Pencil1Icon />}
                                        onClick={() => {}}
                                    />
                                </ChatBubbleActionWrapper>
                            </ChatBubble>

                            <p className={"m-0 text-xs " + (message.authorId == user.id ? "text-right" : "")}>
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

            <div className="bg-[#D1D5DB] py-6 px-8 flex-none">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        <FormField
                            control={form.control}
                            name="message"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Message"
                                            className="resize-none bg-white"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </form>
                </Form>
            </div>
        </div>
        
      );
}