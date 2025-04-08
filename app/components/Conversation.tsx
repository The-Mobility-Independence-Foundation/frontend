import { MessageData, Messages } from "../models/Message";
import { useEffect, useRef, useState } from "react";
import { testMessages } from "../testData/TestMessagesData";
import { ChatMessageList } from "@/components/ui/chat/chat-message-list";
import { ChatBubble, ChatBubbleAction, ChatBubbleActionWrapper, ChatBubbleMessage } from "@/components/ui/chat/chat-bubble";
import ImageCarousel from "./ImageCarousel";
import { UserData } from "../models/User";
import { Pencil1Icon, PaperPlaneIcon, FileIcon, TrashIcon } from "@radix-ui/react-icons"
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { AutosizeTextarea } from '@/components/ui/autosize-textarea';
import { Spinner } from "@/components/spinner";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { ScrollArea } from "@/components/ui/scroll-area"
import backendService from "../services/backend.service";

const formSchema = z.object({
    message: z.string().min(0, ""),
    attachment: z.instanceof(File)
}).partial();

export interface ConversationProps {
    conversationId: string;
    user: UserData;
    className?: string;
}

const fileTypes = ["jpg","jpeg","png","pdf","doc","docx"];
const imageFileTypes = ["jpg","jpeg","png"];

export default function Conversation({conversationId, user, className}: ConversationProps) {
    const fileInputRef = useRef<HTMLInputElement>(null!);

    const [loading, setLoading] = useState(true);
    const [attachments, setAttachments] = useState<{url: string, type: string, name: string, file: File}[]>([])
    const [messagesEditing, setMessagesEditing] = useState<Map<string, boolean>>()

    const [messages, setMessages] = useState<Messages>({
        message: "Default",
        data: {
            count: 0,
            hasNext: false,
            nextToken: null,
            results: []
        }
    });

    const sendForm = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema)
    });

    const editForm = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema)
    });

    const getMessages = async () => {
        let response = await backendService.get(`/conversations/${conversationId}/messages`);
        setMessages(response);
    };

    useEffect(() => {
        setLoading(true);
        getMessages();
        setLoading(false);

        const timer = setInterval(getMessages, 2000);
        return () => clearInterval(timer);
    }, []);

    const uploadFile = (e: React.ChangeEvent<HTMLInputElement>) => {
        let currentAttachments = attachments;

        if(e.target.files != null) {
            let urlSplit = e.target.files[0].name.split(".");
            if(fileTypes.includes(urlSplit[urlSplit.length - 1])) {
                setAttachments(currentAttachments?.concat({url: URL.createObjectURL(e.target.files[0]), 
                    type: urlSplit[urlSplit.length - 1], name: e.target.files[0].name, file: e.target.files[0]}));
            } else {
                toast.error("Invalid file type. Must be of type jpg, jpeg, png, pdf, doc, or docx.");
            }
        }
    }

    const removeFile = (index: number) => {
        let currentAttachments = [...attachments];

        setAttachments([...currentAttachments.slice(0, index), ...currentAttachments.slice(index + 1)]);
    }

    function setEditing(messageId: string, editing: boolean) {
        let currentMessagesEditing = new Map(messagesEditing);

        currentMessagesEditing.set(messageId, editing);

        setMessagesEditing(currentMessagesEditing);
    }

    async function onSend(values: z.infer<typeof formSchema>) {
        const formData = new FormData();
        if(values.message && values.message.length != 0) {
            formData.append("content", values.message);
        }
        if(attachments.length != 0) {
            attachments.forEach((attachment) => {
                formData.append("files", attachment.file);
            });
        }

        backendService.post(`/conversations/${conversationId}/messages`, formData).then(response => {
            sendForm.reset({message: ""});
            setAttachments([]);
            getMessages();
        }).catch(error => {
            toast.error("Error sending message. Please try again.");
        });
    }

    function onEditSubmit(values: z.infer<typeof formSchema>, messageId: string) {
        backendService.patch(`/conversations/${conversationId}/messages/${messageId}`, {
            "content": values.message
        }).then(response => {
            getMessages();
        }).catch(error => {
            toast.error("Error editing message. Please try again.");
        });
    }

    function onDeleteMessage(messageId: string) {
        backendService.delete(`/conversations/${conversationId}/messages/${messageId}`);
    }

    return (
        <div className={"flex flex-col h-[calc(100vh-85px)] lg:h-[calc(100vh-90px)] 2xl:h-[calc(100vh-120px)] " + className}>
            <div className="bg-[#D3E8FF] flex-none">
                <h5 className="text-center">{user.firstName + " " + user.lastName}</h5>
             </div>
            
            {loading && <Spinner className="mt-14"></Spinner>}

            <div className="grow overflow-auto">
                <ScrollArea>
                    <ChatMessageList>
                        {messages.data?.results.slice()
                        .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()).map((message, index, messages) => {
                            return <>
                                {(index == 0 || new Date(new Date(messages[index - 1].createdAt).getTime() - 14400000).toLocaleDateString() != new Date(new Date(message.createdAt).getTime() - 14400000).toLocaleDateString()) && 
                                <div className="flex items-center my-4">
                                    <div className="flex-grow border-t border-gray-300"></div>
                                        <span className="mx-2 text-xs text-gray-500 whitespace-nowrap">
                                            {new Date(new Date(message.createdAt).getTime() - 14400000).toLocaleDateString()}
                                        </span>
                                    <div className="flex-grow border-t border-gray-300"></div>
                                </div>}

                                <ChatBubble key={message.id} variant={message.author.id != user.id ? "sent" : "received"} className="mb-0"> 
                                    <ChatBubbleMessage variant={message.author.id != user.id ? "sent" : "received"} 
                                        className={message.author.id != user.id ? "bg-[#034FA7] mb-0" : "bg-[#002856] text-white mb-0"}>
                                        {messagesEditing?.has(message.id) && messagesEditing.get(message.id) && 
                                            <Form {...editForm}>
                                                <form onSubmit={editForm.handleSubmit(values => onEditSubmit(values, message.id))}>
                                                <FormField
                                                    control={editForm.control}
                                                    name="message"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormControl>
                                                                <div className="relative">
                                                                    <AutosizeTextarea
                                                                        placeholder="Message"
                                                                        className="resize-none bg-transparent text-white"
                                                                        defaultValue={message.content}
                                                                        onKeyDown={(e) => {
                                                                            if (e.key == "Enter" && !e.shiftKey) {
                                                                                e.preventDefault();
                                                                                editForm.handleSubmit(values => onEditSubmit(values, message.id))();
                                                                                setEditing(message.id, false);
                                                                            } else if (e.key == "Escape") {
                                                                                setEditing(message.id, false);
                                                                            }
                                                                        }}
                                                                        {...field}
                                                                    />
                                                                </div>
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                                </form>
                                            </Form>}
                                    
                                        {(!messagesEditing?.has(message.id) || !messagesEditing.get(message.id)) && message.content}

                                        {message.attachments.length != 0 && 
                                        <ImageCarousel
                                            images={message.attachments.map((attachment, index) => (
                                                {
                                                    url: attachment.url,
                                                    alt: "",
                                                    id: index
                                                }
                                            ))}
                                            className="w-[150px] md:w-[300px] text-accent-foreground"
                                        /> }
                                    </ChatBubbleMessage>
                                    
                                    {message.author.id != user.id && 
                                    <ChatBubbleActionWrapper>
                                        <ChatBubbleAction
                                            className="size-7"
                                            icon={<Pencil1Icon />}
                                            onClick={() => {setEditing(message.id, true)}}
                                        />
                                        <ChatBubbleAction
                                            className="size-7"
                                            icon={<TrashIcon />}
                                            onClick={() => {onDeleteMessage(message.id)}}
                                        />
                                    </ChatBubbleActionWrapper>}
                                </ChatBubble>

                                <p className={"m-0 text-xs " + (message.author.id != user.id ? "text-right" : "")}>
                                    {new Date(new Date(message.createdAt).getTime() - 14400000).toLocaleTimeString("en-US", {
                                        hour: "numeric",
                                        minute: "2-digit",
                                        hour12: true
                                    })}
                                    {message.updatedAt != null && new Date(message.updatedAt).toLocaleString() != new Date(message.createdAt).toLocaleString() && <> (edited)</>}
                                </p>
                            </>
                        })}
                    </ChatMessageList>
                </ScrollArea>
            </div>

            <div className="bg-[#D1D5DB] py-6 px-8">
                <div className="mb-2 flex">
                    {attachments?.map((attachment, index) => (
                        <div className="relative group">
                            <Button variant="outline" onClick={() => removeFile(index)} className="h-6 p-1 absolute top-[2px] right-[2px] opacity-0 group-hover:opacity-100">
                                <TrashIcon />
                            </Button>

                            {imageFileTypes.includes(attachment.type) ?
                                <img src={attachment.url} className="h-[80px]"></img> :
                                <div>
                                    <FileIcon className="size-20" />
                                    <p className="text-xs text-center font-normal">{attachment.name.length <= 10 ? attachment.name : attachment.name.substring(0, 6) + "..."}</p>
                                </div>}

                        </div>
                    ))}
                </div>

                <Form {...sendForm}>
                    <form onSubmit={sendForm.handleSubmit(onSend)}>
                        <div className="flex content-end">
                            <div className="grow">
                                <FormField
                                    control={sendForm.control}
                                    name="message"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormControl>
                                                <div className="relative">
                                                    <AutosizeTextarea
                                                        placeholder="Message"
                                                        className="resize-none bg-white h-[42px]"
                                                        onKeyDown={(e) => {
                                                            if (e.key == "Enter" && !e.shiftKey) {
                                                                e.preventDefault();
                                                                sendForm.handleSubmit(onSend)();
                                                            }
                                                        }}
                                                        {...field}
                                                    />

                                                    <Button variant="ghost" type="submit" className="absolute bottom-0 right-0 h-[42px] w-[42px]">
                                                        <PaperPlaneIcon className="size-3.5" />
                                                    </Button>
                                                </div>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <FormField
                                control={sendForm.control}
                                name="attachment"
                                render={({ field }) => (
                                    <FormItem className="flex items-end">
                                        <Button variant="ghost" className="h-[42px] w-[42px]" type="button" onClick={()=> {fileInputRef.current.click()}}>
                                            <FileIcon className="size-3.5"/>
                                        </Button>

                                        <FormControl>
                                            <Input type="file" accept=".jpg,.jpeg,.png,.pdf,.doc,.docx" className="hidden" ref={fileInputRef} onChange={uploadFile} />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                        </div>
                    </form>
                </Form>
            </div>
        </div>
        
      );
}