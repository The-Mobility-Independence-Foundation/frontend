import { useState } from "react";
import { ConversationData, Conversations } from "../models/Conversation";
import Search from "./Search";
import ConversationPreview from "./ConversationPreview";
import backendService from "../services/backend.service";
import { MessageData } from "../models/Message";

export interface ConversationsListProps {
    userId: string;
    className: string;
    selectConversation: (conversation: ConversationData) => void;
}

export default function ConversationsList({userId, className, selectConversation}: ConversationsListProps) {
    const [conversations, setConversations] = useState<Conversations>({
        message: "Default",
        data: {
            count: 0,
            hasNext: false,
            nextToken: null,
            results: []
        }
    });
    const [conversationMessagesMap, setConversationMessagesMap] = useState<Map<string, MessageData[]>>(new Map());
    const [userNames, setUserNames] = useState<Map<string, string>>(new Map());

    const receiveConversations = async (conversations: object) => {
        setConversations((conversations as Conversations));
        
        const messagesPromises = (conversations as Conversations).data.results.map(async (conversation: ConversationData) => {
            const response = await backendService.get(`/conversations/${conversation.id}/messages`);
            return [conversation.id, response.data.results] as [string, MessageData[]];
        });

        const usernamePromises = (conversations as Conversations).data.results.map(async (conversation: ConversationData): Promise<[string, string]> => {
            const userIdToGet = conversation.initiatorId !== userId ? conversation.initiatorId : conversation.participantId;
            const response = await backendService.get(`/users/${userIdToGet}`);
            return [conversation.id, response.data.firstName + " " + response.data.lastName];
        });

        const [messages, userNames] = await Promise.all([
            Promise.all(messagesPromises),
            Promise.all(usernamePromises)
        ]);
    
        setConversationMessagesMap(new Map(messages));
        setUserNames(new Map(userNames));
    };

    return (
        <div className={"bg-[#F4F4F5] " + className}>
            <Search 
                apiRoute={`/users/${userId}/conversations`}
                receiveResponse={receiveConversations}
                placeholderText="Search Conversations" 
                searchBy={"id"}
                boxWidth="w-[70%]"
            />

            {conversations.data?.results.map((conversation, index, conversations) => {
                const messages = conversationMessagesMap.get(conversation.id);
                const username = userNames.get(conversation.id);

                return <ConversationPreview 
                    key={conversation.id}
                    userName={username ? username : ""}
                    // listing={conversation.listingId != null ? await getListingName(conversation.listingId) : undefined}
                    message={messages?.[0]?.content}
                    lastConversation={index == conversations.length - 1}
                    time={messages && messages.length != 0 ? new Date(new Date(messages[0].createdAt).getTime() - 14400000).toLocaleTimeString([], {
                        hour: "numeric",
                        minute: "2-digit",
                        hour12: true,
                    }) : new Date(new Date(conversation.createdAt).getTime() - 14400000).toLocaleTimeString([], {
                        hour: "numeric",
                        minute: "2-digit",
                        hour12: true,
                    })}
                    important={false} // Not used currently
                    onClick={() => selectConversation(conversation)}
                />
            })}
        </div>
    )
}